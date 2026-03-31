import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export default getRequestConfig(async () => {
  const cookieStore = cookies()
  const locale = cookieStore.get('locale')?.value || 'vi'

  return {
    locale,
    messages: (await import(`@/i18n/messages/${locale}.json`)).default,
  }
})
