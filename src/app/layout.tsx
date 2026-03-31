import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import Header from '@/components/Header'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tặng — Danh sách quà tặng cho mọi dịp',
  description: 'Tạo danh sách quà tặng, chia sẻ với bạn bè và người thân. Nhận quà đúng ý, tránh trùng lặp.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className={montserrat.variable}>
      <body className="font-sans antialiased min-h-screen bg-neutral-50 text-neutral-900">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
