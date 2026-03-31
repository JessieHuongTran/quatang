import { NextResponse } from 'next/server'

// Parse Vietnamese price formats into a number (in VND)
function parsePrice(text: string | null | undefined): number | null {
  if (!text) return null

  // Match patterns like "4.500.000đ", "450,000 VND", "₫450.000"
  const patterns = [
    /(\d{1,3}(?:[.,]\d{3})+)\s*(?:đ|₫|VND|vnđ)/i,
    /(?:đ|₫|VND|vnđ)\s*(\d{1,3}(?:[.,]\d{3})+)/i,
    /(\d{1,3}(?:[.,]\d{3})+)/,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const numStr = match[1].replace(/[.,]/g, '')
      const num = parseInt(numStr, 10)
      if (num >= 1000) return num
    }
  }

  // Handle range like "450.000 - 500.000đ" → use midpoint
  const rangeMatch = text.match(/(\d{1,3}(?:[.,]\d{3})+)\s*[-–]\s*(\d{1,3}(?:[.,]\d{3})+)/)
  if (rangeMatch) {
    const low = parseInt(rangeMatch[1].replace(/[.,]/g, ''), 10)
    const high = parseInt(rangeMatch[2].replace(/[.,]/g, ''), 10)
    if (low >= 1000 && high >= 1000) {
      return Math.round((low + high) / 2)
    }
  }

  return null
}

// Extract Open Graph meta tags from raw HTML
function extractOGFromHtml(html: string) {
  const getMetaContent = (property: string): string | null => {
    // Match both property="og:X" and name="og:X"
    const regex = new RegExp(
      `<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']|<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${property}["']`,
      'i'
    )
    const match = html.match(regex)
    return match ? (match[1] || match[2] || null) : null
  }

  const title =
    getMetaContent('og:title') ||
    getMetaContent('twitter:title') ||
    html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ||
    null

  const image =
    getMetaContent('og:image') ||
    getMetaContent('twitter:image') ||
    null

  const description =
    getMetaContent('og:description') ||
    getMetaContent('description') ||
    null

  const priceAmount =
    getMetaContent('product:price:amount') ||
    getMetaContent('og:price:amount') ||
    null

  return { title, image, description, priceAmount }
}

async function tryMicrolink(url: string) {
  const response = await fetch(
    `https://api.microlink.io?url=${encodeURIComponent(url)}`,
    { signal: AbortSignal.timeout(8000) }
  )
  const result = await response.json()

  if (result.status !== 'success' || !result.data) return null

  const { title, image, description } = result.data
  const priceFromMeta = result.data.price?.amount || result.data.price?.value || null

  return {
    title: title || null,
    image: image?.url || null,
    price: priceFromMeta ? Math.round(parseFloat(priceFromMeta)) : parsePrice(title) || parsePrice(description),
    description: description || null,
  }
}

async function tryDirectFetch(url: string) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
    },
  })

  const html = await response.text()
  const og = extractOGFromHtml(html)

  if (!og.title && !og.image) return null

  const price = og.priceAmount
    ? Math.round(parseFloat(og.priceAmount))
    : parsePrice(og.title) || parsePrice(og.description)

  return {
    title: og.title,
    image: og.image,
    price,
    description: og.description,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  // Try Microlink first, then direct fetch as fallback
  let data = null

  try {
    data = await tryMicrolink(url)
  } catch {
    // Microlink failed, try fallback
  }

  if (!data || (!data.title && !data.image)) {
    try {
      data = await tryDirectFetch(url)
    } catch {
      // Direct fetch also failed
    }
  }

  if (!data || (!data.title && !data.image)) {
    return NextResponse.json({ error: 'Could not fetch URL data' }, { status: 422 })
  }

  return NextResponse.json({
    ...data,
    url,
  })
}
