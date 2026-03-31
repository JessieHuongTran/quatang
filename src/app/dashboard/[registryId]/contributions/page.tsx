'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/constants'
import { IconArrowLeft, IconCheck } from '@/components/Icons'
import type { Contribution, Registry } from '@/lib/types/database'

interface ContributionWithItem extends Contribution {
  registry_items: { name: string; target_amount: number | null }
}

export default function ContributionsPage() {
  const t = useTranslations('contributions')
  const tCommon = useTranslations('common')
  const params = useParams()
  const registryId = params.registryId as string
  const supabase = createClient()

  const [registry, setRegistry] = useState<Registry | null>(null)
  const [contributions, setContributions] = useState<ContributionWithItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    const { data: reg } = await supabase
      .from('registries')
      .select('*')
      .eq('id', registryId)
      .single()

    if (reg) setRegistry(reg)

    const { data: items } = await supabase
      .from('registry_items')
      .select('id')
      .eq('registry_id', registryId)

    if (items && items.length > 0) {
      const itemIds = items.map((i) => i.id)
      const { data: contribs } = await supabase
        .from('contributions')
        .select('*, registry_items(name, target_amount)')
        .in('registry_item_id', itemIds)
        .order('created_at', { ascending: false })

      if (contribs) setContributions(contribs as unknown as ContributionWithItem[])
    }

    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registryId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleConfirm = async (contributionId: string) => {
    // Just mark as confirmed — amount already counted when contribution was made
    await supabase
      .from('contributions')
      .update({ status: 'confirmed' })
      .eq('id', contributionId)

    loadData()
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  const totalConfirmed = contributions
    .filter((c) => c.status === 'confirmed')
    .reduce((sum, c) => sum + c.amount, 0)

  const totalPending = contributions
    .filter((c) => c.status === 'pledged')
    .reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 mb-6">
        <IconArrowLeft size={14} />
        {tCommon('back')}
      </Link>

      <h1 className="text-lg font-bold text-neutral-900 mb-6">
        {t('title')} {registry?.title}
      </h1>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
          <div className="text-xs text-neutral-400 mb-1">{t('totalConfirmed')}</div>
          <div className="text-lg font-bold text-neutral-900">{formatCurrency(totalConfirmed)}</div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
          <div className="text-xs text-neutral-400 mb-1">{t('totalPending')}</div>
          <div className="text-lg font-bold text-neutral-900">{formatCurrency(totalPending)}</div>
        </div>
      </div>

      {contributions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-neutral-400">{t('noContributions')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {contributions.map((c) => (
            <div
              key={c.id}
              className="card-hover bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-900">{c.contributor_name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide ${
                    c.status === 'confirmed'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {c.status === 'confirmed' ? t('confirmed') : t('pledged')}
                  </span>
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  {c.registry_items?.name} · {formatCurrency(c.amount)}
                </div>
                {c.contributor_message && (
                  <p className="text-xs text-neutral-400 mt-1 italic">&ldquo;{c.contributor_message}&rdquo;</p>
                )}
              </div>

              {c.status === 'pledged' && (
                <button
                  onClick={() => handleConfirm(c.id)}
                  className="shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-lg
                             bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-all
                             shadow-md shadow-green-500/25 hover:shadow-lg"
                >
                  <IconCheck size={14} />
                  {t('confirmButton')}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
