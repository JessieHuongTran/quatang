'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

export default function LanguageToggle() {
  const locale = useLocale()
  const router = useRouter()
  const isVi = locale === 'vi'

  const toggleLocale = () => {
    const newLocale = isVi ? 'en' : 'vi'
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`
    router.refresh()
  }

  return (
    <button
      onClick={toggleLocale}
      className="relative flex items-center w-16 h-7 rounded-full bg-neutral-200 p-0.5 cursor-pointer
                 transition-colors"
      aria-label="Toggle language"
    >
      {/* Track labels */}
      <span className={`absolute left-1.5 text-[10px] font-bold tracking-wide transition-opacity
                        ${isVi ? 'opacity-0' : 'opacity-100 text-neutral-500'}`}>
        VI
      </span>
      <span className={`absolute right-1.5 text-[10px] font-bold tracking-wide transition-opacity
                        ${isVi ? 'opacity-100 text-neutral-500' : 'opacity-0'}`}>
        EN
      </span>

      {/* Thumb */}
      <span
        className={`relative w-7 h-6 rounded-full bg-white shadow-sm flex items-center justify-center
                    text-[10px] font-bold text-neutral-800 transition-transform duration-200 ease-out
                    ${isVi ? 'translate-x-0' : 'translate-x-[34px]'}`}
      >
        {isVi ? 'VI' : 'EN'}
      </span>
    </button>
  )
}
