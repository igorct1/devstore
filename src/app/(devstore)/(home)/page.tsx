import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/data/api'
import { Product } from '@/data/types/product'
import { formatPrice } from '@/utils/formatPrice'

export default async function Home() {
  const [highlightedProduct, ...otherProducts] = await getFeaturedProducts()

  return (
    <div className="grid max-h-[860px] grid-cols-9 grid-rows-6 gap-6">
      <Link
        href={`/product/${highlightedProduct.slug}`}
        className="relative group col-span-6 row-span-6 rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end"
      >
        <Image
          src={`${highlightedProduct.image}`}
          alt=""
          width={830}
          height={860}
          quality={100}
          className="group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-28 right-28 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
          <span className="text-sm truncate">{highlightedProduct.title}</span>
          <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
            {formatPrice(highlightedProduct.price)}
          </span>
        </div>
      </Link>
      {otherProducts.map((product) => {
        return (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group relative col-span-3 row-span-3 rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end"
          >
            <Image
              src={product.image}
              alt=""
              width={830}
              height={860}
              quality={100}
              className="group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-10 right-10 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
              <span className="text-sm truncate">{product.title}</span>
              <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
                {formatPrice(product.price)}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

async function getFeaturedProducts(): Promise<Product[]> {
  const products = await api('/products/featured')
  const json = await products.json()
  return json
}
