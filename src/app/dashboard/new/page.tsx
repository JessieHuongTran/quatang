'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { OCCASION_TYPES, generateSlug } from '@/lib/constants'
import { OCCASION_ICONS, IconArrowLeft } from '@/components/Icons'
import type { RegistryType } from '@/lib/types/database'

export default function NewRegistryPage() {
  const t = useTranslations('registry')
  const tCommon = useTranslations('common')
  const tOccasions = useTranslations('occasions')
  const router = useRouter()
  const supabase = createClient()

  const [type, setType] = useState<RegistryType | ''>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!type) return
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const slug = generateSlug(title) + '-' + Date.now().toString(36)

    const { data, error: insertError } = await supabase
      .from('registries')
      .insert({
        user_id: user.id,
        title,
        type,
        slug,
        description: description || null,
        event_date: eventDate || null,
        is_public: true,
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      router.push(`/dashboard/${data.id}`)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 mb-6">
        <IconArrowLeft size={14} />
        {tCommon('back')}
      </Link>

      <h1 className="text-xl font-bold text-neutral-900 mb-6">{t('createTitle')}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Occasion Type Picker */}
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-2">{t('occasionType')}</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(OCCASION_TYPES) as RegistryType[]).map((occasionType) => {
              const Icon = OCCASION_ICONS[occasionType]
              const isSelected = type === occasionType
              return (
                <button
                  key={occasionType}
                  type="button"
                  onClick={() => setType(occasionType)}
                  className={`flex items-center gap-2.5 p-3 rounded-lg text-left transition-all border ${
                    isSelected
                      ? 'border-primary-400 bg-primary-50'
                      : 'border-neutral-100 bg-white hover:border-neutral-200'
                  }`}
                >
                  <div className={`shrink-0 ${isSelected ? 'text-primary-500' : 'text-neutral-400'}`}>
                    {Icon && <Icon size={22} />}
                  </div>
                  <span className={`text-xs font-medium ${isSelected ? 'text-primary-600' : 'text-neutral-600'}`}>
                    {tOccasions(occasionType)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">{t('title')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm bg-white
                       focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none transition-colors"
            placeholder={t('titlePlaceholder')}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">{t('description')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm bg-white
                       focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none
                       transition-colors resize-none"
            placeholder={t('descriptionPlaceholder')}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">{t('eventDate')}</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm bg-white
                       focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none transition-colors"
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading || !type || !title}
          className="w-full py-2.5 rounded-lg bg-primary-500 text-white text-sm font-semibold
                     hover:bg-primary-600 transition-colors disabled:opacity-40"
        >
          {loading ? '...' : t('create')}
        </button>
      </form>
    </div>
  )
}
