import Link from 'next/link'
import Navbar from '../_components/Navbar'

export const metadata ={
  title: 'Shop | VAM Enterprises',
}

interface Product {
  id: string
  name: string
  price: string
  href: string
  description: string
  highlights: string[]
  breadcrumbs: { id: number; name: string; href: string }[]
  variants: {
    id: number
    name: string | null
    images: { id: number; src: string; alt: string }[]
  }[]
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`, {
      cache: 'no-store',
    })
    if (!res.ok) {
      return []
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div>
      <Navbar/>
      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold text-center tracking-tight text-white">Products</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                {product.variants.length > 0 && product.variants[0].images.length > 0 && (
                  <img
                    alt={product.variants[0].images[0].alt}
                    src={product.variants[0].images[0].src}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                )}
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-white">
                    <Link href={`/shop/${product.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.description.slice(0, 50)}...</p>
                </div>
                <p className="text-sm font-medium text-white">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
