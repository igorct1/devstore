import { api } from '@/data/api'
import { Product } from '@/data/types/product'
import { formatPrice } from '@/utils/formatPrice'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

interface SearchProps {
  searchParams: {
    q: string
  }
}

async function getSearchedProducts(query: string): Promise<Product[]> {
  const products = await api(`/products/search?q=${query}`, {
    next: {
      revalidate: 60 * 60 * 1, // 1 hour
    },
  })
  const response = await products.json()
  return response
}

export default async function Search({ searchParams }: SearchProps) {
  const { q: query } = searchParams
  const products = await getSearchedProducts(query)

  // redirecionar usuario caso ele acesse essa página sem um parametro de search
  if (!query) {
    redirect('/')
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="p-sm">
        Resultados para: <span className="font-semibold">{query}</span>
      </p>

      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => {
          return (
            <Link
              key={product.id}
              href={product.slug}
              className="group relative  rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end"
            >
              <Image
                src={product.image}
                alt=""
                width={480}
                height={480}
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
    </div>
  )
}
