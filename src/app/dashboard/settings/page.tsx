'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { VIETNAMESE_BANKS } from '@/lib/constants'
import { IconArrowLeft } from '@/components/Icons'
import type { UserProfile, PaymentMethod } from '@/lib/types/database'

export default function SettingsPage() {
  const t = useTranslations('settings')
  const tCommon = useTranslations('common')
  const supabase = createClient()

  const [, setProfile] = useState<UserProfile | null>(null)
  const [payment, setPayment] = useState<PaymentMethod | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [fullName, setFullName] = useState('')
  const [language, setLanguage] = useState('vi')
  const [bankName, setBankName] = useState('')
  const [bankId, setBankId] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [momoPhone, setMomoPhone] = useState('')
  const [zalopayPhone, setZalopayPhone] = useState('')

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profileData } = await supabase
      .from('users').select('*').eq('id', user.id).single()

    if (profileData) {
      setProfile(profileData)
      setFullName(profileData.full_name || '')
      setLanguage(profileData.preferred_language || 'vi')
    }

    const { data: paymentData } = await supabase
      .from('payment_methods').select('*').eq('user_id', user.id).eq('is_primary', true).single()

    if (paymentData) {
      setPayment(paymentData)
      setBankName(paymentData.bank_name || '')
      setBankId(paymentData.bank_id || '')
      setAccountNumber(paymentData.account_number || '')
      setAccountName(paymentData.account_name || '')
      setMomoPhone(paymentData.momo_phone || '')
      setZalopayPhone(paymentData.zalopay_phone || '')
    }

    setLoading(false)
  }

  const showSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('users').update({ full_name: fullName, preferred_language: language }).eq('id', user.id)
    document.cookie = `locale=${language};path=/;max-age=31536000`
    setSaving(false)
    showSaved()
  }

  const handleSavePayment = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const paymentData = {
      user_id: user.id,
      bank_name: bankName || null,
      bank_id: bankId || null,
      account_number: accountNumber || null,
      account_name: accountName || null,
      momo_phone: momoPhone || null,
      zalopay_phone: zalopayPhone || null,
      is_primary: true,
    }

    if (payment) {
      await supabase.from('payment_methods').update(paymentData).eq('id', payment.id)
    } else {
      await supabase.from('payment_methods').insert(paymentData)
    }

    setSaving(false)
    showSaved()
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 mb-6">
        <IconArrowLeft size={14} />
        {tCommon('back')}
      </Link>

      <h1 className="text-xl font-bold text-neutral-900 mb-6">{t('title')}</h1>

      {saved && (
        <div className="mb-4 text-xs text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg">
          Saved
        </div>
      )}

      {/* Profile */}
      <section className="bg-white rounded-xl border border-neutral-200 p-5 mb-4 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-900 mb-4">{t('profile')}</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">{t('fullName')}</label>
            <input
              type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white
                         focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">{t('language')}</label>
            <select
              value={language} onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white
                         focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
          <button
            onClick={handleSaveProfile} disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-primary-500 text-white text-xs font-semibold
                       hover:bg-primary-600 transition-all disabled:opacity-50
                       shadow-md shadow-primary-500/25"
          >
            {t('updateProfile')}
          </button>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-900 mb-4">{t('paymentMethods')}</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">{t('bankName')}</label>
            <select
              value={bankId}
              onChange={(e) => {
                setBankId(e.target.value)
                const bank = VIETNAMESE_BANKS.find((b) => b.id === e.target.value)
                if (bank) setBankName(bank.name)
              }}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white
                         focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
            >
              <option value="">--</option>
              {VIETNAMESE_BANKS.map((bank) => (
                <option key={bank.id} value={bank.id}>{bank.name} ({bank.id})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">{t('accountNumber')}</label>
              <input
                type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white
                           focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">{t('accountName')}</label>
              <input
                type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white
                           focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
              />
            </div>
          </div>

          <hr className="border-neutral-100 my-2" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">{t('momoPhone')}</label>
              <input
                type="tel" value={momoPhone} onChange={(e) => setMomoPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white
                           focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">{t('zalopayPhone')}</label>
              <input
                type="tel" value={zalopayPhone} onChange={(e) => setZalopayPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white
                           focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSavePayment} disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-primary-500 text-white text-xs font-semibold
                       hover:bg-primary-600 transition-all disabled:opacity-50
                       shadow-md shadow-primary-500/25"
          >
            {t('savePayment')}
          </button>
        </div>
      </section>
    </div>
  )
}
