// Flat vector icon set — consistent stroke-based style across all icons.
// Each icon is 24x24 by default, uses currentColor for theming.

interface IconProps {
  size?: number
  className?: string
}

export function IconPregnancy({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="14" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M16 14V10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M6 22h36" stroke="currentColor" strokeWidth="2.5" />
      <rect x="20" y="19" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="24" y1="22" x2="24" y2="25" stroke="currentColor" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconBirthday({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M10 38V28c0-1.1.9-2 2-2h24c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2z" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M6 28h36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="18" y1="26" x2="18" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="26" x2="24" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="26" x2="30" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="18" cy="17" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="24" cy="15" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="30" cy="17" r="2" fill="currentColor" opacity="0.6" />
      <path d="M10 33h28" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    </svg>
  )
}

export function IconWedding({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="22" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="24" cy="22" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M20 22c0-2.2 1.8-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M24 12V8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="6" r="2" fill="currentColor" opacity="0.5" />
      <path d="M16 38l8-6 8 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="24" y1="32" x2="24" y2="40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconGraduation({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M24 8L4 18l20 10 20-10L24 8z" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      <path d="M12 23v12c0 0 4 5 12 5s12-5 12-5V23" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="44" y1="18" x2="44" y2="34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42 34h4l-2 4-2-4z" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

export function IconHousewarming({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M6 22L24 8l18 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M10 20v18c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V20" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <rect x="19" y="30" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <line x1="24" y1="30" x2="24" y2="40" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <line x1="19" y1="35" x2="29" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    </svg>
  )
}

export function IconThoiNoi({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="14" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M18 12c0-1 .5-2 1.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M14 24c-2 2-4 6-4 10 0 4 6 8 14 8s14-4 14-8c0-4-2-8-4-10" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M20 32h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <circle cx="20" cy="13" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="28" cy="13" r="1.5" fill="currentColor" opacity="0.5" />
      <path d="M21 17c0 0 1.5 2 3 2s3-2 3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  )
}

export function IconGift({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="20" width="36" height="20" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <rect x="8" y="14" width="32" height="8" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <line x1="24" y1="14" x2="24" y2="40" stroke="currentColor" strokeWidth="2.5" />
      <path d="M24 14c0 0-4-6-8-6s-4 3-2 5 6 1 10 1" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M24 14c0 0 4-6 8-6s4 3 2 5-6 1-10 1" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function IconLink({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IconCheck({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconPlus({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IconCart({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" />
      <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IconHeart({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
    </svg>
  )
}

export function IconUsers({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IconArrowLeft({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <line x1="19" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <polyline points="12,19 5,12 12,5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconSettings({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  )
}

export function IconTrash({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IconEdit({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  )
}

export function IconQR({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="14" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="2" y="14" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="5" y="5" width="2" height="2" fill="currentColor" />
      <rect x="17" y="5" width="2" height="2" fill="currentColor" />
      <rect x="5" y="17" width="2" height="2" fill="currentColor" />
      <rect x="14" y="14" width="2" height="2" fill="currentColor" />
      <rect x="18" y="14" width="2" height="2" fill="currentColor" />
      <rect x="14" y="18" width="2" height="2" fill="currentColor" />
      <rect x="18" y="18" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

// Map occasion type to its icon component
export const OCCASION_ICONS: Record<string, React.FC<IconProps>> = {
  pregnancy: IconPregnancy,
  birthday: IconBirthday,
  wedding: IconWedding,
  graduation: IconGraduation,
  housewarming: IconHousewarming,
  thoi_noi: IconThoiNoi,
}
