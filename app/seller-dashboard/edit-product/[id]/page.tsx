'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/app/_components/App-sidebar'
import Header from '@/app/_components/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Trash2 } from 'lucide-react'
import { isAdmin } from "@/app/extras/isAdmis"
import { useUser } from "@clerk/nextjs";
import { notFound } from "next/navigation"

interface ProductFormData {
  name: string
  price: string
  description: string
  categoryId: string
  variants: { name?: string; images: { src: string; alt: string }[] }[]
}

export default function EditProductPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    variants: [{ name: '', images: [{ src: '', alt: '' }] }]
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchProduct()
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }
      const product = await response.json()

      // Transform the data to match form structure
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        categoryId: product.categoryId,
        variants: product.variants.map((variant: any) => ({
          name: variant.name || '',
          images: variant.images.length > 0 ? variant.images : [{ src: '', alt: '' }]
        }))
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      router.push('/seller-dashboard/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName }),
      })

      if (response.ok) {
        const newCategory = await response.json()
        setCategories(prev => [...prev, newCategory])
        setFormData(prev => ({ ...prev, categoryId: newCategory.id }))
        setNewCategoryName('')
        setIsDialogOpen(false)
      } else {
        throw new Error('Failed to create category')
      }
    } catch (error) {
      console.error('Error creating category:', error)
    }
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

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }))
  }

  const addImageToVariant = (variantIndex: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => i === variantIndex ? { ...v, images: [...v.images, { src: '', alt: '' }] } : v)
    }))
  }

  const updateVariantImage = (variantIndex: number, imageIndex: number, field: 'src' | 'alt', value: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, vi) => vi === variantIndex ? {
        ...v,
        images: v.images.map((img, ii) => ii === imageIndex ? { ...img, [field]: value } : img)
      } : v)
    }))
  }

  const removeImageFromVariant = (variantIndex: number, imageIndex: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, vi) => vi === variantIndex ? {
        ...v,
        images: v.images.filter((_, ii) => ii !== imageIndex)
      } : v)
    }))
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <Header />
          <div className="p-6">
            <div className="text-center">Please sign in with the admin account to access the Seller Dashboard.</div>
          </div>
        </main>
      </SidebarProvider>
    )
  }

  if (!isAdmin(user)) {
    notFound()
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <Header />
          <div className="p-6">
            <div className="text-center">Loading product...</div>
          </div>
        </main>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <Header />
        <div className="container mx-auto p-6 max-w-4xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Edit Product</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">Product Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-semibold">Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <Input
                        id="price"
                        type="text"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="Enter price"
                        className="pl-8"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter product description"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline">
                            Create New
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              placeholder="Enter category name"
                            />
                            <Button onClick={handleCreateCategory} className="w-full">
                              Create Category
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                <div className="space-y-6">
                  <Label className="text-lg font-semibold">Variants</Label>
                  {formData.variants.map((variant, variantIndex) => (
                    <Card key={variantIndex} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-md font-medium">Variant {variantIndex + 1}</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeVariant(variantIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <Input
                          type="text"
                          value={variant.name}
                          onChange={(e) => updateVariant(variantIndex, 'name', e.target.value)}
                          placeholder="Variant name"
                        />
                        <Label className="text-sm font-medium">Images</Label>
                        {variant.images.map((image, imageIndex) => (
                          <div key={imageIndex} className="flex items-center space-x-2">
                            <Input
                              type="text"
                              value={image.src}
                              onChange={(e) => updateVariantImage(variantIndex, imageIndex, 'src', e.target.value)}
                              placeholder="Image URL"
                              className="flex-1"
                            />
                            <Input
                              type="text"
                              value={image.alt}
                              onChange={(e) => updateVariantImage(variantIndex, imageIndex, 'alt', e.target.value)}
                              placeholder="Alt text"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeImageFromVariant(variantIndex, imageIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addImageToVariant(variantIndex)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Image
                        </Button>
                      </div>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addVariant}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variant
                  </Button>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {saving ? 'Updating Product...' : 'Update Product'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/seller-dashboard/products')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarProvider>
  )
}
