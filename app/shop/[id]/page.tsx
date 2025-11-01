import { StarIcon } from '@heroicons/react/20/solid'
import { notFound } from 'next/navigation'
import Navbar from '@/app/_components/Navbar'

const reviews = { href: '#', average: 4 }


function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter((c): c is string => Boolean(c)).join(' ')
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const productId = params.id

  const product = await getProduct(productId)

  if (!product) {
    return { title: 'Product not found | VAM Enterprises' }
  }

  return {
    title: `${product.name} | VAM Enterprises`,
  }
}

interface Product {
  id: string
  name: string
  price: string
  href: string
  description: string
  details: string
  highlights: string[]
  breadcrumbs: { id: number; name: string; href: string }[]
  variants: {
    id: number
    name: string | null
    images: { id: number; src: string; alt: string }[]
  }[]
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${id}`, {
      cache: 'no-store',
    })
    if (!res.ok) {
      return null
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = params.id

  const product = await getProduct(productId)

  if (!product) {
    notFound()
  }

  // Flatten images from variants for display (guard against undefined)
  const images = (product.variants ?? []).flatMap((variant) => variant.images ?? [])

  return (
    <div>
      <Navbar />
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {product.breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a href={breadcrumb.href} className="mr-2 text-sm font-medium text-white">
                    {breadcrumb.name}
                  </a>
                  <svg
                    fill="currentColor"
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <a href={product.href} aria-current="page" className="font-medium text-white hover:text-gray-100">
                {product.name}
              </a>
            </li>
          </ol>
        </nav>

  {/* Main layout: gallery left, sticky buy panel right */}
  <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-12 lg:gap-x-20 lg:pr-[30rem]">
          {/* Left: Gallery (col-span 7) */}
          <div className="lg:col-span-7">
            <div className="w-full">
              {/* Main image */}
              <div className="aspect-w-4 aspect-h-5 w-full overflow-hidden rounded-lg bg-gray-800">
                {images[0] ? (
                  <img
                    src={images[0].src}
                    alt={images[0].alt ?? product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">No image</div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="mt-4 grid grid-cols-4 gap-4">
                {images.slice(0, 8).map((img) => (
                  <button key={img.id} className="overflow-hidden rounded-md bg-gray-700 hover:ring-2 focus:outline-none">
                    <img src={img.src} alt={img.alt ?? product.name} className="h-20 w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Details + fixed add to cart (col-span 5) */}
          <div className="lg:col-span-5 lg:top-24 lg:right-8 lg:w-[28rem] lg:max-h-[90vh] lg:overflow-auto">
            {/* Keep column space; whole right column fixed on large screens */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{product.name}</h1>

                <p className="mt-4 text-3xl tracking-tight text-gray-200">{product.price}</p>

                <div className="mt-6 flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        aria-hidden="true"
                        className={classNames(reviews.average > rating ? 'text-gray-100' : 'text-gray-800', 'h-5 w-5 shrink-0')}
                      />
                    ))}
                  </div>
                  <p className="sr-only">{reviews.average} out of 5 stars</p>
                </div>

                <div className="mt-6">
                  <p className="text-base text-gray-200">{product.description}</p>
                </div>

                <form className="mt-8">
                  {product.variants?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-100">Variants</h3>
                      <fieldset aria-label="Choose a variant" className="mt-4">
                        <div className="flex items-center gap-x-3">
                          {product.variants.map((variant) => {
                            const name = variant.name ?? `Variant ${variant.id}`
                            const isColor = typeof name === 'string' && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(name.trim())
                            return isColor ? (
                              <button
                                key={variant.id}
                                type="button"
                                aria-label={name}
                                title={name}
                                className="h-8 w-8 rounded-full border-2 border-gray-200 hover:ring-2 focus:outline-none"
                                style={{ backgroundColor: name }}
                              />
                            ) : (
                              <button
                                key={variant.id}
                                type="button"
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                              >
                                {name}
                              </button>
                            )
                          })}
                        </div>
                      </fieldset>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="mt-6 w-full rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                  >
                    Add to Cart
                  </button>
                </form>

                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-100">Highlights</h3>
                  <ul role="list" className="mt-4 list-disc space-y-2 pl-4 text-sm">
                    {product.highlights.map((highlight, index) => (
                      <li key={index} className="text-gray-300">{highlight}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <h2 className="text-sm font-medium text-gray-100">Details</h2>
                  <p className="mt-2 text-sm text-gray-300">{product.details}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  )
}