'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { OCCASION_TYPES, formatCurrency } from '@/lib/constants'
import { OCCASION_ICONS, IconPlus, IconArrowLeft, IconEdit, IconTrash, IconLink, IconUsers } from '@/components/Icons'
import type { Registry, RegistryItem, RegistryType } from '@/lib/types/database'

export default function ManageRegistryPage() {
  const t = useTranslations('items')
  const tCommon = useTranslations('common')
  const params = useParams()
  const registryId = params.registryId as string
  const supabase = createClient()

  const [registry, setRegistry] = useState<Registry | null>(null)
  const [items, setItems] = useState<RegistryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<RegistryItem | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [priceEstimate, setPriceEstimate] = useState('')
  const [buyUrl, setBuyUrl] = useState('')
  const [isGroupGift, setIsGroupGift] = useState(false)
  const [targetAmount, setTargetAmount] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  // Scraping state
  const [scrapeUrl, setScrapeUrl] = useState('')
  const [scraping, setScraping] = useState(false)
  const [scrapeError, setScrapeError] = useState('')
  const [scrapedImageUrl, setScrapedImageUrl] = useState<string | null>(null)
  const scrapeTimerRef = useRef<NodeJS.Timeout | null>(null)

  const loadData = useCallback(async () => {
    const { data: reg } = await supabase
      .from('registries')
      .select('*')
      .eq('id', registryId)
      .single()

    if (reg) setRegistry(reg)

    const { data: itms } = await supabase
      .from('registry_items')
      .select('*')
      .eq('registry_id', registryId)
      .order('position', { ascending: true })

    if (itms) setItems(itms)
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registryId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const resetForm = () => {
    setName('')
    setPriceEstimate('')
    setBuyUrl('')
    setIsGroupGift(false)
    setTargetAmount('')
    setPhotoFile(null)
    setEditingItem(null)
    setShowForm(false)
    setScrapeUrl('')
    setScrapeError('')
    setScrapedImageUrl(null)
  }

  const handleScrapeUrl = async (url: string) => {
    setScrapeUrl(url)
    setScrapeError('')

    if (scrapeTimerRef.current) clearTimeout(scrapeTimerRef.current)

    if (!url || !url.startsWith('http')) return

    scrapeTimerRef.current = setTimeout(async () => {
      setScraping(true)
      try {
        const res = await fetch(`/api/scrape-url?url=${encodeURIComponent(url)}`)
        const data = await res.json()

        if (!res.ok || data.error) {
          setScrapeError('Không lấy được thông tin, bạn có thể nhập thủ công')
          setScraping(false)
          return
        }

        if (data.title && !name) setName(data.title)
        if (data.price && !priceEstimate) setPriceEstimate((data.price / 1000).toString())
        if (data.image) setScrapedImageUrl(data.image)
        setBuyUrl(url)
      } catch {
        setScrapeError('Không lấy được thông tin, bạn có thể nhập thủ công')
      }
      setScraping(false)
    }, 500)
  }

  const handleEdit = (item: RegistryItem) => {
    setEditingItem(item)
    setName(item.name)
    setPriceEstimate(item.price_estimate ? (item.price_estimate / 1000).toString() : '')
    setBuyUrl(item.buy_url || '')
    setIsGroupGift(item.is_group_gift)
    setTargetAmount(item.target_amount ? (item.target_amount / 1000).toString() : '')
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    let photoUrl = editingItem?.photo_url || scrapedImageUrl || null

    if (photoFile) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const ext = photoFile.name.split('.').pop()
        const path = `${user.id}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('registry-photos')
          .upload(path, photoFile)

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('registry-photos')
            .getPublicUrl(path)
          photoUrl = urlData.publicUrl
        }
      }
    }

    // Convert from thousands to full VND
    const priceInVnd = priceEstimate ? parseFloat(priceEstimate) * 1000 : null
    const targetInVnd = isGroupGift && targetAmount ? parseFloat(targetAmount) * 1000 : null

    const itemData = {
      registry_id: registryId,
      name,
      photo_url: photoUrl,
      price_estimate: priceInVnd,
      buy_url: buyUrl || null,
      is_group_gift: isGroupGift,
      target_amount: targetInVnd,
      position: editingItem ? editingItem.position : items.length,
    }

    if (editingItem) {
      await supabase.from('registry_items').update(itemData).eq('id', editingItem.id)
    } else {
      await supabase.from('registry_items').insert(itemData)
    }

    resetForm()
    setSaving(false)
    loadData()
  }

  const copyShareLink = async () => {
    if (!registry) return
    const url = `${window.location.origin}/${registry.slug}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('registry_items').delete().eq('id', id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  if (!registry) return null

  const occasion = OCCASION_TYPES[registry.type as RegistryType]
  const Icon = OCCASION_ICONS[registry.type]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 mb-6">
        <IconArrowLeft size={14} />
        {tCommon('back')}
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-primary-500"
            style={{ backgroundColor: occasion?.tint }}
          >
            {Icon && <Icon size={22} />}
          </div>
          <h1 className="text-lg font-bold text-neutral-900">{registry.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {registry.is_public && (
            <button
              onClick={copyShareLink}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold
                         transition-all shadow-sm ${
                           copied
                             ? 'bg-green-500 text-white shadow-green-500/25'
                             : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                         }`}
            >
              <IconLink size={14} />
              {copied ? tCommon('copied') : tCommon('share')}
            </button>
          )}
          <Link
            href={`/dashboard/${registryId}/contributions`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold
                       border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-all shadow-sm"
          >
            Đóng góp
          </Link>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary-500
                       text-white text-xs font-semibold hover:bg-primary-600 transition-all
                       shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30"
          >
            <IconPlus size={14} />
            {t('addItem')}
          </button>
        </div>
      </div>

      {/* Add/Edit Item Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 mb-6">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">
            {editingItem ? t('editItem') : t('addItem')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* URL Scrape — top of form */}
            {!editingItem && (
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">
                  Link sản phẩm (Shopee, Tiki, Lazada...)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <IconLink size={14} />
                  </span>
                  <input
                    type="url"
                    value={scrapeUrl}
                    onChange={(e) => handleScrapeUrl(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-neutral-200 text-sm bg-white
                               focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
                    placeholder="Dán link sản phẩm để tự động điền..."
                  />
                  {scraping && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="block w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </span>
                  )}
                </div>
                {scrapeError && (
                  <p className="text-xs text-amber-600 mt-1">{scrapeError}</p>
                )}
              </div>
            )}

            {/* Scraped image preview */}
            {scrapedImageUrl && !photoFile && (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-neutral-50 border border-neutral-100">
                <img
                  src={scrapedImageUrl}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 truncate">{name || 'Ảnh sản phẩm'}</p>
                  <button
                    type="button"
                    onClick={() => setScrapedImageUrl(null)}
                    className="text-xs text-red-500 hover:underline mt-0.5"
                  >
                    Xóa ảnh
                  </button>
                </div>
              </div>
            )}

            <div className={`grid grid-cols-2 gap-3 ${scraping ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">{t('name')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white
                             focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
                  placeholder={t('namePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">{t('priceEstimate')} (x1.000 VND)</label>
                <input
                  type="number"
                  value={priceEstimate}
                  onChange={(e) => setPriceEstimate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white
                             focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
                  placeholder="500 = 500.000₫"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">
                {scrapedImageUrl ? 'Thay ảnh khác' : t('photo')}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-neutral-500 file:mr-3 file:py-1.5 file:px-3
                           file:rounded-lg file:border-0 file:text-xs file:font-medium
                           file:bg-neutral-100 file:text-neutral-600 hover:file:bg-neutral-200"
              />
            </div>

            {!scrapeUrl && (
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">{t('buyUrl')}</label>
                <input
                  type="url"
                  value={buyUrl}
                  onChange={(e) => setBuyUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white
                             focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
                  placeholder={t('buyUrlPlaceholder')}
                />
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isGroupGift}
                onChange={(e) => setIsGroupGift(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-xs font-medium text-neutral-600 flex items-center gap-1">
                <IconUsers size={14} />
                {t('isGroupGift')}
              </span>
            </label>

            {isGroupGift && (
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">{t('targetAmount')} (x1.000 VND)</label>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white
                             focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
                  placeholder="2000 = 2.000.000₫"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-lg bg-primary-500 text-white text-xs font-semibold
                           hover:bg-primary-600 transition-all disabled:opacity-50
                           shadow-md shadow-primary-500/25"
              >
                {saving ? '...' : tCommon('save')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-lg border border-neutral-200 text-neutral-600 text-xs font-semibold
                           hover:bg-neutral-50 transition-all shadow-sm"
              >
                {tCommon('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items List */}
      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-300 mb-3">
            <IconPlus size={24} />
          </div>
          <p className="text-sm text-neutral-400">{t('noItems')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="card-hover bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-4 shadow-sm"
            >
              {item.photo_url ? (
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                  <Image src={item.photo_url} alt={item.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-300 shrink-0">
                  <IconGiftPlaceholder />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-neutral-900 truncate">{item.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  {item.price_estimate && (
                    <span className="text-xs text-neutral-500">{formatCurrency(item.price_estimate)}</span>
                  )}
                  {item.is_group_gift && item.target_amount && (
                    <>
                      <span className="text-neutral-200">·</span>
                      <span className="text-xs text-primary-500 font-medium">
                        {Math.round((item.current_amount / item.target_amount) * 100)}%
                      </span>
                    </>
                  )}
                  {item.is_purchased && (
                    <div>
                      <span className="text-xs text-green-600 font-medium">
                        {tCommon('claimed')}
                        {item.purchased_by_name && ` — ${item.purchased_by_name}`}
                      </span>
                      {item.purchased_message && (
                        <p className="text-xs text-neutral-400 italic mt-0.5">
                          &ldquo;{item.purchased_message}&rdquo;
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {item.is_group_gift && item.target_amount && (
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden mt-1.5 max-w-[200px]">
                    <div
                      className="h-full bg-primary-400 rounded-full animate-progress"
                      style={{ width: `${Math.min(100, (item.current_amount / item.target_amount) * 100)}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 rounded-lg border border-neutral-200 text-neutral-500
                             hover:text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50
                             transition-all shadow-sm"
                >
                  <IconEdit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg border border-neutral-200 text-neutral-400
                             hover:text-red-500 hover:border-red-200 hover:bg-red-50
                             transition-all shadow-sm"
                >
                  <IconTrash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function IconGiftPlaceholder() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="10" width="18" height="11" rx="1" />
      <rect x="4" y="7" width="16" height="4" rx="1" />
      <line x1="12" y1="7" x2="12" y2="21" />
    </svg>
  )
}
