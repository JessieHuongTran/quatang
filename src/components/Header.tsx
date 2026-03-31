'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import LanguageToggle from './LanguageToggle'
import { IconGift, IconSettings } from './Icons'
import { useEffect, useState, useRef } from 'react'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const t = useTranslations('common')
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setMenuOpen(false)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors">
          <IconGift size={22} />
          <span className="text-lg font-bold tracking-tight">{t('appName')}</span>
        </Link>

        <div className="flex items-center gap-4">
          <LanguageToggle />

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    {t('dashboard')}
                  </Link>

                  {/* Gear dropdown */}
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600
                                 hover:bg-neutral-100 transition-colors"
                    >
                      <IconSettings size={18} />
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg border border-neutral-200
                                      shadow-lg py-1 z-50">
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setMenuOpen(false)}
                          className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          {t('settings')}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-neutral-600
                                     hover:bg-neutral-50 transition-colors"
                        >
                          {t('logout')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-medium px-4 py-1.5 rounded-lg bg-primary-500 text-white
                               hover:bg-primary-600 transition-colors"
                  >
                    {t('register')}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
