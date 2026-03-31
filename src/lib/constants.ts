import type { RegistryType } from '@/lib/types/database'

// Occasion type configurations — consistent warm palette tints
export const OCCASION_TYPES: Record<RegistryType, {
  labelVi: string
  labelEn: string
  tint: string      // Subtle background tint for cards/banners
  accent: string    // Slightly stronger tint for borders
}> = {
  pregnancy: {
    labelVi: 'Rời công tác',
    labelEn: 'Farewell',
    tint: '#FFF5F5',
    accent: '#FEE8E8',
  },
  birthday: {
    labelVi: 'Sinh nhật',
    labelEn: 'Birthday',
    tint: '#FFF8F0',
    accent: '#FEF0DD',
  },
  wedding: {
    labelVi: 'Đám cưới',
    labelEn: 'Wedding',
    tint: '#FFF9F5',
    accent: '#FFF0E8',
  },
  graduation: {
    labelVi: 'Tốt nghiệp',
    labelEn: 'Graduation',
    tint: '#F5F7FF',
    accent: '#E8EDFF',
  },
  housewarming: {
    labelVi: 'Tân gia',
    labelEn: 'Housewarming',
    tint: '#F5FFF8',
    accent: '#E5F8EC',
  },
  thoi_noi: {
    labelVi: 'Mừng em bé',
    labelEn: 'Baby Shower',
    tint: '#FFF5F9',
    accent: '#FEE8F0',
  },
}

// Vietnamese banks supported by VietQR
export const VIETNAMESE_BANKS = [
  { id: 'VCB', name: 'Vietcombank' },
  { id: 'TCB', name: 'Techcombank' },
  { id: 'MB', name: 'MB Bank' },
  { id: 'ACB', name: 'ACB' },
  { id: 'VPB', name: 'VPBank' },
  { id: 'TPB', name: 'TPBank' },
  { id: 'STB', name: 'Sacombank' },
  { id: 'HDB', name: 'HDBank' },
  { id: 'VIB', name: 'VIB' },
  { id: 'SHB', name: 'SHB' },
  { id: 'EIB', name: 'Eximbank' },
  { id: 'MSB', name: 'MSB' },
  { id: 'BIDV', name: 'BIDV' },
  { id: 'CTG', name: 'VietinBank' },
  { id: 'AGR', name: 'Agribank' },
  { id: 'OCB', name: 'OCB' },
  { id: 'LPB', name: 'LienVietPostBank' },
  { id: 'BAB', name: 'Bac A Bank' },
  { id: 'SCB', name: 'SCB' },
  { id: 'NAB', name: 'Nam A Bank' },
]

// Generate VietQR URL
export function generateVietQRUrl({
  bankId,
  accountNumber,
  accountName,
  amount,
  transferNote,
}: {
  bankId: string
  accountNumber: string
  accountName: string
  amount: number
  transferNote: string
}): string {
  const params = new URLSearchParams({
    amount: amount.toString(),
    addInfo: transferNote,
    accountName,
  })
  return `https://img.vietqr.io/image/${bankId}-${accountNumber}-compact2.png?${params.toString()}`
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Format Vietnamese currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

// Append affiliate tag to Shopee URLs
export function appendAffiliateTag(url: string): string {
  if (!url) return url
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('shopee')) {
      parsed.searchParams.set('af_id', process.env.NEXT_PUBLIC_SHOPEE_AFFILIATE_ID || 'YOUR_AFFILIATE_ID')
    }
    return parsed.toString()
  } catch {
    return url
  }
}
