'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { OCCASION_TYPES } from '@/lib/constants'
import { OCCASION_ICONS, IconPlus, IconLink, IconTrash } from '@/components/Icons'
import type { Registry, RegistryType } from '@/lib/types/database'

interface RegistryWithCount extends Registry {
  item_count: number
}

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const tCommon = useTranslations('common')
  const tOccasions = useTranslations('occasions')
  const supabase = createClient()

  const [registries, setRegistries] = useState<RegistryWithCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRegistries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadRegistries = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('registries')
      .select('*, registry_items(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped = data.map((r: any) => ({
        ...r,
        item_count: r.registry_items?.[0]?.count || 0,
      }))
      setRegistries(mapped)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return
    await supabase.from('registries').delete().eq('id', id)
    setRegistries((prev) => prev.filter((r) => r.id !== id))
  }

  const copyLink = async (slug: string) => {
    const url = `${window.location.origin}/${slug}`
    await navigator.clipboard.writeText(url)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-neutral-900">{t('title')}</h1>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary-500
                     text-white text-sm font-semibold hover:bg-primary-600 transition-all
                     shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30"
        >
          <IconPlus size={16} />
          {t('newRegistry')}
        </Link>
      </div>

      {registries.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-400 mb-4">
            <IconPlus size={28} />
          </div>
          <p className="text-sm text-neutral-500 mb-4">{t('noRegistries')}</p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary-500
                       text-white text-sm font-semibold hover:bg-primary-600 transition-all
                       shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30"
          >
            <IconPlus size={16} />
            {t('newRegistry')}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {registries.map((registry) => {
            const occasion = OCCASION_TYPES[registry.type as RegistryType]
            const Icon = OCCASION_ICONS[registry.type]

            return (
              <div
                key={registry.id}
                className="card-hover bg-white rounded-xl border border-neutral-200 p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-primary-500"
                    style={{ backgroundColor: occasion?.tint }}
                  >
                    {Icon && <Icon size={22} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-semibold text-neutral-900 truncate">{registry.title}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-neutral-400">{tOccasions(registry.type)}</span>
                      <span className="text-neutral-200">·</span>
                      <span className="text-xs text-neutral-400">{registry.item_count} {t('items')}</span>
                      {registry.event_date && (
                        <>
                          <span className="text-neutral-200">·</span>
                          <span className="text-xs text-neutral-400">
                            {new Date(registry.event_date).toLocaleDateString('vi-VN')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(registry.id)}
                    className="p-2 rounded-lg border border-neutral-200 text-neutral-400
                               hover:text-red-500 hover:border-red-200 hover:bg-red-50
                               transition-all shadow-sm shrink-0"
                    title={t('deleteRegistry')}
                  >
                    <IconTrash size={16} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-100">
                  <Link
                    href={`/dashboard/${registry.id}`}
                    className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold
                               hover:bg-neutral-800 transition-all shadow-sm"
                  >
                    {t('manageItems')}
                  </Link>
                  <Link
                    href={`/dashboard/${registry.id}/contributions`}
                    className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 text-xs font-semibold
                               hover:bg-neutral-50 transition-all shadow-sm"
                  >
                    {t('viewContributions')}
                  </Link>
                  {registry.is_public && (
                    <button
                      onClick={() => copyLink(registry.slug)}
                      className="px-4 py-2 rounded-lg border border-primary-200 bg-primary-50
                                 text-primary-600 text-xs font-semibold
                                 hover:bg-primary-100 transition-all shadow-sm ml-auto"
                    >
                      <span className="flex items-center gap-1.5">
                        <IconLink size={14} />
                        {tCommon('copyLink')}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
