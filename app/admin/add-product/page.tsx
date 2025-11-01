'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProductFormData {
  name: string
  price: string
  href: string
  description: string
  details: string
  highlights: string[]
  breadcrumbs: { name: string; href: string }[]
  variants: { name?: string; images: { src: string; alt: string }[] }[]
}

export default function AddProductPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    href: '',
    description: '',
    details: '',
    highlights: [''],
    breadcrumbs: [{ name: '', href: '' }],
    variants: [{ name: '', images: [{ src: '', alt: '' }] }]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to add product')
      }

      router.push('/shop')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addHighlight = () => {
    setFormData(prev => ({ ...prev, highlights: [...prev.highlights, ''] }))
  }

  const updateHighlight = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => i === index ? value : h)
    }))
  }

  const addBreadcrumb = () => {
    setFormData(prev => ({ ...prev, breadcrumbs: [...prev.breadcrumbs, { name: '', href: '' }] }))
  }

  const updateBreadcrumb = (index: number, field: 'name' | 'href', value: string) => {
    setFormData(prev => ({
      ...prev,
      breadcrumbs: prev.breadcrumbs.map((b, i) => i === index ? { ...b, [field]: value } : b)
    }))
  }

  const addVariant = () => {
    setFormData(prev => ({ ...prev, variants: [...prev.variants, { name: '', images: [{ src: '', alt: '' }] }] }))
  }

  const updateVariant = (index: number, field: 'name', value: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => i === index ? { ...v, [field]: value } : v)
    }))
  }

  const addImage = (variantIndex: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => i === variantIndex ? { ...v, images: [...v.images, { src: '', alt: '' }] } : v)
    }))
  }

  const updateImage = (variantIndex: number, imageIndex: number, field: 'src' | 'alt', value: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, vi) => vi === variantIndex ? {
        ...v,
        images: v.images.map((img, ii) => ii === imageIndex ? { ...img, [field]: value } : img)
      } : v)
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price</label>
          <input
            type="text"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Href</label>
          <input
            type="text"
            value={formData.href}
            onChange={(e) => setFormData(prev => ({ ...prev, href: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Details</label>
          <textarea
            value={formData.details}
            onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Highlights</label>
          {formData.highlights.map((highlight, index) => (
            <input
              key={index}
              type="text"
              value={highlight}
              onChange={(e) => updateHighlight(index, e.target.value)}
              className="w-full p-2 border rounded mb-2"
              placeholder="Highlight"
            />
          ))}
          <button type="button" onClick={addHighlight} className="text-blue-600">Add Highlight</button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Breadcrumbs</label>
          {formData.breadcrumbs.map((breadcrumb, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={breadcrumb.name}
                onChange={(e) => updateBreadcrumb(index, 'name', e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Name"
              />
              <input
                type="text"
                value={breadcrumb.href}
                onChange={(e) => updateBreadcrumb(index, 'href', e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Href"
              />
            </div>
          ))}
          <button type="button" onClick={addBreadcrumb} className="text-blue-600">Add Breadcrumb</button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Variants</label>
          {formData.variants.map((variant, variantIndex) => (
            <div key={variantIndex} className="border p-4 rounded mb-4">
              <input
                type="text"
                value={variant.name}
                onChange={(e) => updateVariant(variantIndex, 'name', e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder="Variant Name"
              />
              <label className="block text-sm font-medium mb-2">Images</label>
              {variant.images.map((image, imageIndex) => (
                <div key={imageIndex} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={image.src}
                    onChange={(e) => updateImage(variantIndex, imageIndex, 'src', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Image Src"
                  />
                  <input
                    type="text"
                    value={image.alt}
                    onChange={(e) => updateImage(variantIndex, imageIndex, 'alt', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Image Alt"
                  />
                </div>
              ))}
              <button type="button" onClick={() => addImage(variantIndex)} className="text-blue-600">Add Image</button>
            </div>
          ))}
          <button type="button" onClick={addVariant} className="text-blue-600">Add Variant</button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}
