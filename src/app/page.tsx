'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { OCCASION_TYPES } from '@/lib/constants'
import { OCCASION_ICONS, IconGift, IconUsers, IconQR } from '@/components/Icons'
import type { RegistryType } from '@/lib/types/database'

export default function LandingPage() {
  const t = useTranslations('landing')
  const tOccasions = useTranslations('occasions')
  const tCommon = useTranslations('common')

  const occasions: RegistryType[] = ['birthday', 'wedding', 'pregnancy', 'graduation', 'housewarming', 'thoi_noi']

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-900 leading-tight tracking-tight mb-5">
          {t('heroLine1')}{' '}
          <br className="hidden md:block" />
          <span className="text-rotate-wrapper text-primary-500">
            <span className="text-rotate-inner">
              {occasions.map((occ) => (
                <span key={occ}>{tOccasions(occ)}</span>
              ))}
            </span>
          </span>
        </h1>
        <p className="text-base md:text-lg text-neutral-500 mb-8 max-w-md mx-auto leading-relaxed">
          {t('subtitleLine1')}
          <br />
          {t('subtitleLine2')}
        </p>
        <Link
          href="/register"
          className="inline-flex items-center px-7 py-3 rounded-lg bg-primary-500 text-white
                     font-semibold hover:bg-primary-600 transition-all text-sm
                     shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30"
        >
          {t('cta')}
        </Link>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-neutral-900 mb-2 tracking-tight">
          {t('howItWorks')}
        </h2>
        <p className="text-center text-neutral-400 mb-14 text-sm">
          {t('howItWorksSubtitle')}
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { num: '01', title: t('step1Title'), desc: t('step1Desc') },
            { num: '02', title: t('step2Title'), desc: t('step2Desc') },
            { num: '03', title: t('step3Title'), desc: t('step3Desc') },
          ].map((step, i) => (
            <div
              key={step.num}
              className={`card-hover border border-neutral-200 rounded-2xl p-7
                         shadow-sm animate-fade-up animate-delay-${i + 1}`}
            >
              <div className="text-5xl font-extrabold text-neutral-100 mb-5 leading-none">
                {step.num}
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">{step.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Occasions */}
      <section className="bg-neutral-50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-neutral-900 mb-2 tracking-tight">
            {t('occasionsLine1')}{' '}
            <span className="text-primary-500">{t('occasionsAccent')}</span>
          </h2>
          <p className="text-center text-neutral-400 mb-12 text-sm">
            {t('occasionsSubtitle')}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(Object.keys(OCCASION_TYPES) as RegistryType[]).map((type, i) => {
              const Icon = OCCASION_ICONS[type]
              return (
                <div
                  key={type}
                  className={`card-hover flex items-center gap-3 p-4 rounded-xl bg-white
                             border border-neutral-200 shadow-sm cursor-default
                             animate-fade-up animate-delay-${(i % 3) + 1}`}
                >
                  <div className="text-primary-500 shrink-0">
                    <Icon size={28} />
                  </div>
                  <span className="text-sm font-semibold text-neutral-800">
                    {tOccasions(type)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-neutral-900 mb-2 tracking-tight">
          {t('featuresLine1')}{' '}
          <span className="text-primary-500">{t('featuresAccent')}</span>
        </h2>
        <p className="text-center text-neutral-400 mb-12 text-sm">
          {t('featuresSubtitle')}
        </p>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="card-hover border border-neutral-200 rounded-2xl p-7 shadow-sm animate-fade-up animate-delay-1">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-500 mb-4">
              <IconUsers size={22} />
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-2">
              {t('groupGifts')}
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              {t('groupGiftsDesc')}
            </p>
          </div>
          <div className="card-hover border border-neutral-200 rounded-2xl p-7 shadow-sm animate-fade-up animate-delay-2">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-500 mb-4">
              <IconQR size={22} />
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-2">
              {t('vietqr')}
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              {t('vietqrDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-neutral-900 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight leading-snug">
            {t('ctaBottomLine1')}
            <br />
            <span className="text-primary-400">{t('ctaBottomAccent')}</span>
          </h2>
          <p className="text-sm text-neutral-400 mb-8">
            {t('ctaBottomSubtitle')}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-7 py-3 rounded-lg bg-primary-500 text-white
                       font-semibold hover:bg-primary-400 transition-all text-sm
                       shadow-lg shadow-primary-500/30"
          >
            {t('cta')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-primary-500 mb-1">
            <IconGift size={16} />
            <span className="text-sm font-bold">{tCommon('appName')}</span>
          </div>
          <p className="text-xs text-neutral-400">{tCommon('tagline')}</p>
        </div>
      </footer>
    </div>
  )
}
