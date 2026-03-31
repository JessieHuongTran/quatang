'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { OCCASION_TYPES } from '@/lib/constants'
import { OCCASION_ICONS, IconGift, IconUsers, IconQR } from '@/components/Icons'
import { MockRegistryPreview, TESTIMONIALS, EcommerceLogos } from '@/components/MockRegistry'
import type { RegistryType } from '@/lib/types/database'

// Intersection Observer hook for scroll-triggered animations
function useRevealOnScroll() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reveal the section container
            entry.target.classList.add('visible')
            // Reveal all children with .reveal class
            entry.target.querySelectorAll('.reveal').forEach((el) => {
              el.classList.add('visible')
            })
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    const el = ref.current
    if (el) {
      // Observe the container and all .reveal children inside
      el.querySelectorAll('.reveal').forEach((child) => observer.observe(child))
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return ref
}

export default function LandingPage() {
  const t = useTranslations('landing')
  const tOccasions = useTranslations('occasions')
  const tCommon = useTranslations('common')

  const howRef = useRevealOnScroll()
  const previewRef = useRevealOnScroll()
  const occasionsRef = useRevealOnScroll()
  const featuresRef = useRevealOnScroll()
  const testimonialsRef = useRevealOnScroll()
  const ctaRef = useRevealOnScroll()

  const occasions: RegistryType[] = ['birthday', 'wedding', 'pregnancy', 'graduation', 'housewarming', 'thoi_noi']

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-5 pt-16 pb-14 md:pt-24 md:pb-20 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-neutral-900 leading-[1.15] tracking-tight mb-5">
          <span className="block sm:inline">{t('heroLine1')}</span>{' '}
          <span className="text-rotate-wrapper text-primary-500">
            <span className="text-rotate-inner">
              {occasions.map((occ) => (
                <span key={occ}>{tOccasions(occ)}</span>
              ))}
            </span>
          </span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-neutral-500 mb-8 max-w-sm sm:max-w-md mx-auto leading-relaxed">
          <span className="block">{t('subtitleLine1')}</span>
          <span className="block">{t('subtitleLine2')}</span>
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
      <section ref={howRef} className="max-w-5xl mx-auto px-5 py-16 md:py-24">
        <div className="reveal">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-neutral-900 mb-2 tracking-tight">
            {t('howItWorks')}
          </h2>
          <p className="text-center text-neutral-400 mb-12 md:mb-16 text-sm">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {[
            { num: '01', title: t('step1Title'), desc: t('step1Desc') },
            { num: '02', title: t('step2Title'), desc: t('step2Desc') },
            { num: '03', title: t('step3Title'), desc: t('step3Desc') },
          ].map((step, i) => (
            <div
              key={step.num}
              className={`reveal reveal-delay-${i + 1} card-hover border border-neutral-200 rounded-2xl p-6 md:p-7 shadow-sm`}
            >
              <div className="text-4xl md:text-5xl font-extrabold text-neutral-300 mb-4 md:mb-5 leading-none">
                {step.num}
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">{step.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mock Registry Preview */}
      <section ref={previewRef} className="bg-neutral-50 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-5">
          <div className="reveal">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-neutral-900 mb-2 tracking-tight">
              {t('previewLine1')}{' '}
              <span className="text-primary-500">{t('previewAccent')}</span>
            </h2>
            <p className="text-center text-neutral-400 mb-10 md:mb-14 text-sm">
              {t('previewSubtitle')}
            </p>
          </div>
          <div className="reveal reveal-delay-2">
            <MockRegistryPreview />
          </div>
        </div>
      </section>

      {/* Supported ecommerce */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-5">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-neutral-900 mb-10 tracking-tight">
            {t('ecommerce')}
          </h2>
          <EcommerceLogos />
        </div>
      </section>

      {/* Occasions */}
      <section ref={occasionsRef} className="bg-neutral-50 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-5">
          <div className="reveal">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-neutral-900 mb-2 tracking-tight">
              {t('occasionsLine1')}{' '}
              <span className="text-primary-500">{t('occasionsAccent')}</span>
            </h2>
            <p className="text-center text-neutral-400 mb-10 md:mb-14 text-sm">
              {t('occasionsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(Object.keys(OCCASION_TYPES) as RegistryType[]).map((type, i) => {
              const Icon = OCCASION_ICONS[type]
              return (
                <div
                  key={type}
                  className={`reveal reveal-delay-${i + 1} card-hover flex items-center gap-3 p-4 rounded-xl bg-white
                             border border-neutral-200 shadow-sm cursor-default`}
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
      <section ref={featuresRef} className="max-w-5xl mx-auto px-5 py-16 md:py-24">
        <div className="reveal">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-neutral-900 mb-2 tracking-tight">
            {t('featuresLine1')}{' '}
            <span className="text-primary-500">{t('featuresAccent')}</span>
          </h2>
          <p className="text-center text-neutral-400 mb-10 md:mb-14 text-sm">
            {t('featuresSubtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          <div className="reveal reveal-delay-1 card-hover border border-neutral-200 rounded-2xl p-6 md:p-7 shadow-sm">
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
          <div className="reveal reveal-delay-2 card-hover border border-neutral-200 rounded-2xl p-6 md:p-7 shadow-sm">
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

      {/* Testimonials */}
      <section ref={testimonialsRef} className="bg-neutral-50 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-5">
          <div className="reveal">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-neutral-900 mb-2 tracking-tight">
              {t('testimonialsLine1')}{' '}
              <span className="text-primary-500">{t('testimonialsAccent')}</span>
            </h2>
            <p className="text-center text-neutral-400 mb-10 md:mb-14 text-sm">
              {t('testimonialsSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((testimonial, i) => (
              <div
                key={i}
                className={`reveal reveal-delay-${i + 1} card-hover bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">{testimonial.name}</div>
                    <div className="text-[11px] text-neutral-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section ref={ctaRef} className="bg-neutral-900 py-16 md:py-24">
        <div className="reveal max-w-2xl mx-auto px-5 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight leading-snug">
            <span className="block">{t('ctaBottomLine1')}</span>
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
        <div className="max-w-4xl mx-auto px-5 text-center">
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
