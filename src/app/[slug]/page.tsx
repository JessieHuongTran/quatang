'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { OCCASION_TYPES, formatCurrency, appendAffiliateTag } from '@/lib/constants'
import { OCCASION_ICONS, IconCart, IconUsers, IconCheck, IconGift, IconLink } from '@/components/Icons'
import type { Registry, RegistryItem, RegistryType, UserProfile } from '@/lib/types/database'

export default function PublicRegistryPage() {
  const t = useTranslations('publicRegistry')
  const tCommon = useTranslations('common')
  const params = useParams()
  const slug = params.slug as string
  const supabase = createClient()

  const [registry, setRegistry] = useState<Registry | null>(null)
  const [owner, setOwner] = useState<UserProfile | null>(null)
  const [items, setItems] = useState<RegistryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [claimingItem, setClaimingItem] = useState<RegistryItem | null>(null)
  const [claimName, setClaimName] = useState('')
  const [claimMessage, setClaimMessage] = useState('')
  const [claiming, setClaiming] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: registry?.title || 'Gift Registry', url })
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const loadData = useCallback(async () => {
    if (['dashboard', 'login', 'register', 'auth'].includes(slug)) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const { data: reg } = await supabase
      .from('registries')
      .select('*')
      .eq('slug', slug)
      .eq('is_public', true)
      .single()

    if (!reg) {
      setNotFound(true)
      setLoading(false)
      return
    }

    setRegistry(reg)

    const { data: ownerData } = await supabase
      .from('users').select('*').eq('id', reg.user_id).single()
    if (ownerData) setOwner(ownerData)

    const { data: itms } = await supabase
      .from('registry_items')
      .select('*')
      .eq('registry_id', reg.id)
      .order('position', { ascending: true })
    if (itms) setItems(itms)

    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleClaim = async () => {
    if (!claimingItem || !claimName) return
    setClaiming(true)

    await supabase
      .from('registry_items')
      .update({
        is_purchased: true,
        purchased_by_name: claimName,
        purchased_message: claimMessage || null,
        purchased_at: new Date().toISOString(),
      })
      .eq('id', claimingItem.id)

    setClaimingItem(null)
    setClaimName('')
    setClaimMessage('')
    setClaiming(false)
    loadData()
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  if (notFound || !registry) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-neutral-400">{t('registryPrivate')}</p>
      </div>
    )
  }

  const occasion = OCCASION_TYPES[registry.type as RegistryType]
  const Icon = OCCASION_ICONS[registry.type]

  return (
    <div className="min-h-screen">
      {/* Banner — clean minimal */}
      <div className="bg-white border-b border-neutral-100" style={{ backgroundColor: occasion?.tint }}>
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/70 text-primary-500 mb-4">
            {Icon && <Icon size={30} />}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2 tracking-tight">
            {registry.title}
          </h1>
          {owner && (
            <p className="text-sm text-neutral-500">by {owner.full_name}</p>
          )}
          {registry.event_date && (
            <p className="text-xs text-neutral-400 mt-1">
              {t('eventDate')}: {new Date(registry.event_date).toLocaleDateString('vi-VN')}
            </p>
          )}
          {registry.description && (
            <p className="text-sm text-neutral-500 mt-3 max-w-md mx-auto">{registry.description}</p>
          )}
          <button
            onClick={handleShare}
            className="mt-5 inline-flex items-center gap-1.5 px-5 py-2 rounded-lg
                       bg-neutral-900 text-white text-xs font-semibold
                       hover:bg-neutral-800 transition-all shadow-md"
          >
            <IconLink size={14} />
            {copied ? tCommon('copied') : tCommon('share')}
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const isPurchased = item.is_purchased
            const isFullyFunded = item.is_fully_funded

            return (
              <div
                key={item.id}
                className={`card-hover bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm
                            ${isPurchased || isFullyFunded ? 'opacity-60' : ''}`}
              >
                {item.photo_url ? (
                  <div className={`relative h-44 bg-neutral-100 ${isPurchased ? 'blur-[2px]' : ''}`}>
                    <Image src={item.photo_url} alt={item.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className={`h-44 bg-neutral-50 flex items-center justify-center text-neutral-200
                                   ${isPurchased ? 'blur-[2px]' : ''}`}>
                    <IconGift size={40} />
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">{item.name}</h3>

                  {item.price_estimate && !item.is_group_gift && (
                    <p className="text-xs text-neutral-400 mb-3">{formatCurrency(item.price_estimate)}</p>
                  )}

                  {/* Group Gift Progress */}
                  {item.is_group_gift && item.target_amount && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-primary-500 font-medium">
                          {formatCurrency(item.current_amount)}
                        </span>
                        <span className="text-neutral-400">
                          {formatCurrency(item.target_amount)}
                        </span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-400 rounded-full animate-progress"
                          style={{ width: `${Math.min(100, (item.current_amount / item.target_amount) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {isPurchased ? (
                    <div className="flex items-center gap-1.5 py-2 text-xs font-medium text-green-600">
                      <IconCheck size={14} />
                      {t('claimed')}
                    </div>
                  ) : isFullyFunded ? (
                    <div className="flex items-center gap-1.5 py-2 text-xs font-medium text-green-600">
                      <IconCheck size={14} />
                      {t('fullyFunded')}
                    </div>
                  ) : item.is_group_gift ? (
                    <Link
                      href={`/${slug}/contribute/${item.id}`}
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg
                                 bg-primary-500 text-white text-xs font-semibold
                                 hover:bg-primary-600 transition-all
                                 shadow-md shadow-primary-500/25 hover:shadow-lg"
                    >
                      <IconUsers size={14} />
                      {t('contribute')}
                    </Link>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {item.buy_url ? (
                        <a
                          href={appendAffiliateTag(item.buy_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg
                                     bg-primary-500 text-white text-xs font-semibold
                                     hover:bg-primary-600 transition-all
                                     shadow-md shadow-primary-500/25 hover:shadow-lg"
                        >
                          <IconCart size={14} />
                          {t('buyGift')}
                        </a>
                      ) : (
                        <div />
                      )}
                      <button
                        onClick={() => setClaimingItem(item)}
                        className="flex items-center justify-center gap-1.5
                                    py-2.5 rounded-lg border border-neutral-200 text-neutral-700 text-xs font-semibold
                                    hover:bg-neutral-50 transition-all shadow-sm"
                      >
                        <IconCheck size={14} />
                        {t('buyGift')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Claim Modal */}
      {claimingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5">
            <h2 className="text-sm font-bold text-neutral-900 mb-1">{t('claimTitle')}</h2>
            <p className="text-xs text-neutral-400 mb-4">
              {claimingItem.name}
              {claimingItem.price_estimate && ` — ${formatCurrency(claimingItem.price_estimate)}`}
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">{t('yourName')}</label>
                <input
                  type="text"
                  value={claimName}
                  onChange={(e) => setClaimName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm
                             focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">{t('message')}</label>
                <input
                  type="text"
                  value={claimMessage}
                  onChange={(e) => setClaimMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm
                             focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
                  placeholder={t('messagePlaceholder')}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={handleClaim}
                disabled={!claimName || claiming}
                className="flex-1 py-2 rounded-lg bg-primary-500 text-white text-xs font-semibold
                           hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                {claiming ? '...' : t('confirmClaim')}
              </button>
              <button
                onClick={() => setClaimingItem(null)}
                className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-600 text-xs font-medium
                           hover:bg-neutral-50 transition-colors"
              >
                {tCommon('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
