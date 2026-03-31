'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, generateVietQRUrl, OCCASION_TYPES } from '@/lib/constants'
import { IconArrowLeft, IconCheck } from '@/components/Icons'
import type { Registry, RegistryItem, PaymentMethod, RegistryType } from '@/lib/types/database'

type PaymentType = 'bank_transfer' | 'momo' | 'zalopay'

export default function ContributePage() {
  const t = useTranslations('contribution')
  const params = useParams()
  const slug = params.slug as string
  const itemId = params.itemId as string
  const supabase = createClient()

  const [registry, setRegistry] = useState<Registry | null>(null)
  const [item, setItem] = useState<RegistryItem | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  const [contributorName, setContributorName] = useState('')
  const [contributorEmail, setContributorEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>('bank_transfer')
  const [submitting, setSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    const { data: reg } = await supabase
      .from('registries').select('*').eq('slug', slug).single()

    if (!reg) { setLoading(false); return }
    setRegistry(reg)

    const { data: itemData } = await supabase
      .from('registry_items').select('*').eq('id', itemId).single()
    if (itemData) setItem(itemData)

    const { data: pm } = await supabase
      .from('payment_methods').select('*').eq('user_id', reg.user_id).eq('is_primary', true).single()
    if (pm) setPaymentMethods(pm)

    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, itemId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!item || !registry) return
    setSubmitting(true)

    const transferNote = `${item.name} - ${registry.title}`

    const contributionAmount = parseFloat(amount)

    // Save the contribution
    await supabase.from('contributions').insert({
      registry_item_id: item.id,
      contributor_name: contributorName,
      contributor_email: contributorEmail || null,
      contributor_message: message || null,
      amount: contributionAmount,
      payment_method: paymentMethod,
      transfer_note: transferNote,
      status: 'pledged',
    })

    // Update the item's progress immediately
    const newAmount = (item.current_amount || 0) + contributionAmount
    const isFullyFunded = item.target_amount ? newAmount >= item.target_amount : false
    await supabase
      .from('registry_items')
      .update({
        current_amount: newAmount,
        is_fully_funded: isFullyFunded,
      })
      .eq('id', item.id)

    setSubmitting(false)
    setSubmitted(true)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  if (!registry || !item) return null

  const occasion = OCCASION_TYPES[registry.type as RegistryType]
  const transferNote = `${item.name} - ${registry.title}`
  const remaining = item.target_amount ? item.target_amount - item.current_amount : 0

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-50 text-green-500 mb-4">
            <IconCheck size={28} />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">{t('thankYou')}</h1>
          <p className="text-sm text-neutral-500 mb-6">{t('thankYouMessage')}</p>
          <Link
            href={`/${slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-500 text-white
                       text-sm font-semibold hover:bg-primary-600 transition-colors"
          >
            <IconArrowLeft size={14} />
            {t('backToRegistry')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link href={`/${slug}`} className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 mb-6">
        <IconArrowLeft size={14} />
        {t('backToRegistry')}
      </Link>

      {/* Item Summary */}
      <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: occasion?.tint }}>
        <h1 className="text-base font-bold text-neutral-900 mb-1">
          {t('title')} &ldquo;{item.name}&rdquo;
        </h1>
        {item.target_amount && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-neutral-700">
                {formatCurrency(item.current_amount)} / {formatCurrency(item.target_amount)}
              </span>
              <span className="text-neutral-400">{formatCurrency(remaining)} left</span>
            </div>
            <div className="h-2 bg-white/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-400 rounded-full animate-progress"
                style={{ width: `${Math.min(100, (item.current_amount / item.target_amount) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">{t('yourName')} *</label>
            <input
              type="text" value={contributorName} onChange={(e) => setContributorName(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm
                         focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">{t('yourEmail')}</label>
            <input
              type="email" value={contributorEmail} onChange={(e) => setContributorEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm
                         focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">{t('amount')} (VND) *</label>
          <input
            type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            required min={1000}
            className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm
                       focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none bg-white"
            placeholder="200000"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[50000, 100000, 200000, 500000, 1000000].map((a) => (
              <button
                key={a} type="button" onClick={() => setAmount(a.toString())}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  amount === a.toString()
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                }`}
              >
                {formatCurrency(a)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">{t('message')}</label>
          <textarea
            value={message} onChange={(e) => setMessage(e.target.value)} rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm
                       focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none resize-none bg-white"
            placeholder={t('messagePlaceholder')}
          />
        </div>

        {/* Payment Methods */}
        {!paymentMethods ? (
          <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">{t('noPaymentMethods')}</p>
        ) : (
          <div className="space-y-3">
            <label className="block text-xs font-medium text-neutral-500">{t('paymentMethod')}</label>
            <div className="flex gap-2">
              {paymentMethods.bank_name && (
                <button type="button" onClick={() => setPaymentMethod('bank_transfer')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    paymentMethod === 'bank_transfer' ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}>{t('bankTransfer')}</button>
              )}
              {paymentMethods.momo_phone && (
                <button type="button" onClick={() => setPaymentMethod('momo')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    paymentMethod === 'momo' ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}>MoMo</button>
              )}
              {paymentMethods.zalopay_phone && (
                <button type="button" onClick={() => setPaymentMethod('zalopay')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    paymentMethod === 'zalopay' ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}>ZaloPay</button>
              )}
            </div>

            {/* Bank Transfer */}
            {paymentMethod === 'bank_transfer' && paymentMethods.bank_name && (
              <div className="bg-neutral-50 rounded-xl p-4 space-y-2">
                <div className="text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">{t('bankName')}</span>
                    <span className="font-medium text-neutral-700">{paymentMethods.bank_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">{t('accountNumber')}</span>
                    <span className="font-mono font-medium text-neutral-700">{paymentMethods.account_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">{t('accountName')}</span>
                    <span className="font-medium text-neutral-700">{paymentMethods.account_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">{t('transferNote')}</span>
                    <span className="font-mono text-neutral-500 text-[11px]">{transferNote}</span>
                  </div>
                </div>

                {paymentMethods.bank_id && paymentMethods.account_number && amount && (
                  <div className="text-center pt-2">
                    <p className="text-[11px] text-neutral-400 mb-2">{t('scanQR')}</p>
                    <div className="inline-block bg-white p-1.5 rounded-lg border border-neutral-100">
                      <Image
                        src={generateVietQRUrl({
                          bankId: paymentMethods.bank_id,
                          accountNumber: paymentMethods.account_number,
                          accountName: paymentMethods.account_name || '',
                          amount: parseFloat(amount),
                          transferNote,
                        })}
                        alt="VietQR" width={220} height={220} className="rounded" unoptimized
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MoMo */}
            {paymentMethod === 'momo' && paymentMethods.momo_phone && (
              <div className="bg-neutral-50 rounded-xl p-4 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-400">{t('momoPhone')}</span>
                  <span className="font-mono font-medium text-neutral-700">{paymentMethods.momo_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{t('transferNote')}</span>
                  <span className="font-mono text-neutral-500 text-[11px]">{transferNote}</span>
                </div>
              </div>
            )}

            {/* ZaloPay */}
            {paymentMethod === 'zalopay' && paymentMethods.zalopay_phone && (
              <div className="bg-neutral-50 rounded-xl p-4 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-400">{t('zalopayPhone')}</span>
                  <span className="font-mono font-medium text-neutral-700">{paymentMethods.zalopay_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{t('transferNote')}</span>
                  <span className="font-mono text-neutral-500 text-[11px]">{transferNote}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !contributorName || !amount || !paymentMethods}
          className="w-full py-3 rounded-lg bg-primary-500 text-white text-sm font-bold
                     hover:bg-primary-600 transition-all disabled:opacity-40
                     shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30"
        >
          {submitting ? '...' : t('confirmPayment')}
        </button>
      </form>
    </div>
  )
}
