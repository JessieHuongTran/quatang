'use client'

import Image from 'next/image'
import { IconBirthday, IconCheck } from './Icons'

// Mock registry preview with real product images
export function MockRegistryPreview() {
  const items = [
    {
      name: 'Xe đẩy em bé Joie Litetrax',
      price: '4.500.000 ₫',
      image: '/mock/stroller.jpg',
      claimed: false,
      isGroup: false,
    },
    {
      name: 'Bộ chăn ga gối cũi cho bé',
      price: '1.200.000 ₫',
      image: '/mock/bedding.jpg',
      claimed: true,
      claimedBy: 'Minh',
      isGroup: false,
    },
    {
      name: 'Máy hút sữa điện đôi Medela',
      price: '3.800.000 ₫',
      image: '/mock/pump.jpg',
      claimed: false,
      isGroup: true,
      progress: 65,
      funded: '2.470.000 ₫',
      contributors: 4,
    },
    {
      name: 'Cũi gỗ cho bé sơ sinh',
      price: '2.900.000 ₫',
      image: '/mock/crib.jpg',
      claimed: false,
      isGroup: false,
    },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Registry header mock */}
      <div className="bg-gradient-to-r from-primary-50 to-pink-50 rounded-t-2xl p-6 text-center border border-neutral-200 border-b-0">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/70 text-primary-500 mb-2">
          <IconBirthday size={22} />
        </div>
        <h3 className="text-base font-bold text-neutral-900">Sinh nhật bé An — 1 tuổi</h3>
        <p className="text-xs text-neutral-500 mt-0.5">by Thanh Hương · 15/04/2026</p>
      </div>

      {/* Items grid mock */}
      <div className="grid grid-cols-2 gap-0 border border-neutral-200 rounded-b-2xl overflow-hidden bg-white">
        {items.map((item, i) => (
          <div
            key={i}
            className={`p-4 ${i < 2 ? 'border-b border-neutral-100' : ''} ${i % 2 === 0 ? 'border-r border-neutral-100' : ''} ${item.claimed ? 'opacity-50' : ''}`}
          >
            <div className="relative h-24 rounded-lg overflow-hidden bg-neutral-100 mb-3">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>

            <h4 className="text-xs font-semibold text-neutral-900 mb-0.5 truncate">{item.name}</h4>
            <p className="text-[11px] text-neutral-400 mb-2">{item.price}</p>

            {item.claimed ? (
              <div className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
                <IconCheck size={12} />
                Đã mua — {item.claimedBy}
              </div>
            ) : item.isGroup ? (
              <div>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-primary-500 font-medium">{item.funded}</span>
                  <span className="text-neutral-400">{item.contributors} người góp</span>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-400 rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1">
                <div className="text-[10px] font-semibold text-white bg-primary-500 rounded py-1 text-center">
                  Mua tặng
                </div>
                <div className="text-[10px] font-semibold text-neutral-600 border border-neutral-200 rounded py-1 text-center">
                  Đã mua
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Testimonials with real avatar photos
export const TESTIMONIALS = [
  {
    name: 'Thanh Hương',
    role: 'Mẹ bỉm sữa',
    text: 'Mình tạo danh sách cho baby shower, bạn bè chọn quà chính xác luôn. Không bị trùng món nào!',
    avatar: '/avatars/woman1.jpg',
  },
  {
    name: 'Minh Đức',
    role: 'Chú rể',
    text: 'Đám cưới mình dùng Tặng Gì Đây để bạn bè góp tiền mua tủ lạnh. QR chuyển khoản tiện cực!',
    avatar: '/avatars/man1.jpg',
  },
  {
    name: 'Phương Anh',
    role: 'Sinh viên',
    text: 'Dùng cho sinh nhật, chỉ cần gửi link cho mọi người. Ai cũng biết mình thích gì, khỏi đoán.',
    avatar: '/avatars/woman2.jpg',
  },
]

// Real ecommerce logos — grayscale by default, color on hover
export function EcommerceLogos() {
  const logos = [
    { name: 'Shopee', src: '/logos/shopee.png', width: 144, height: 48 },
    { name: 'Tiki', src: '/logos/tiki.png', width: 96, height: 38 },
    { name: 'Lazada', src: '/logos/lazada.png', width: 132, height: 43 },
  ]

  return (
    <div className="flex items-center justify-center gap-10 md:gap-16">
      {logos.map((logo) => (
        <div
          key={logo.name}
          className="grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
        >
          <Image
            src={logo.src}
            alt={logo.name}
            width={logo.width}
            height={logo.height}
            className="object-contain h-10 md:h-12 w-auto"
          />
        </div>
      ))}
    </div>
  )
}
