import { api } from '@/data/api'
import { env } from '@/data/env'
import { Product } from '@/data/types/product'
import { ImageResponse } from 'next/og'
import colors from 'tailwindcss/colors'
export const runtime = 'edge'

export const alt = ''
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

async function getProduct(slug: string): Promise<Product> {
  const products = await api(`/products/${slug}`, {
    next: {
      revalidate: 60 * 60 * 1, // 1hour
    },
  })
  const json = await products.json()
  return json
}

// Image generation
export default async function Image({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)

  const productImageURL = new URL(product.image, env.APP_URL).toString()

  return new ImageResponse(
    (
      <div
        style={{
          background: colors.zinc[950],
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <img src={productImageURL} style={{ width: '100%' }} alt="" />
      </div>
    ),
    {
      ...size,
    },
  )
}
