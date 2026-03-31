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
      // Only accept values that look like VND (> 1000)
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.microlink.io?url=${encodeURIComponent(url)}`,
      { signal: AbortSignal.timeout(10000) }
    )

    const result = await response.json()

    if (result.status !== 'success' || !result.data) {
      return NextResponse.json({ error: 'Could not fetch URL data' }, { status: 422 })
    }

    const { title, image, description } = result.data

    // Try to extract price from multiple sources
    const priceFromMeta = result.data.price?.amount || result.data.price?.value || null
    const priceFromTitle = parsePrice(title)
    const priceFromDesc = parsePrice(description)
    const price = priceFromMeta
      ? Math.round(parseFloat(priceFromMeta))
      : priceFromTitle || priceFromDesc || null

    return NextResponse.json({
      title: title || null,
      image: image?.url || null,
      price,
      description: description || null,
      url,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to scrape URL' }, { status: 500 })
  }
}
