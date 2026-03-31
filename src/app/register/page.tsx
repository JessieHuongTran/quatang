'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { IconGift } from '@/components/Icons'

export default function RegisterPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-500 mb-4">
            <IconGift size={24} />
          </div>
          <h1 className="text-xl font-bold text-neutral-900">{t('registerTitle')}</h1>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">{t('fullName')}</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm
                         focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none
                         transition-colors bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm
                         focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none
                         transition-colors bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm
                         focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none
                         transition-colors bg-white"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary-500 text-white text-sm font-semibold
                       hover:bg-primary-600 transition-all disabled:opacity-50
                       shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30"
          >
            {loading ? '...' : t('registerButton')}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-400 mt-6">
          {t('hasAccount')}{' '}
          <Link href="/login" className="text-primary-500 font-medium hover:underline">
            {t('loginLink')}
          </Link>
        </p>
      </div>
    </div>
  )
}
