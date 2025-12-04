"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface Product {
  id: number
  name: string
  price: number
  stock: number
  category_id: number
  image_url: string
  description: string
}

interface FormProps {
  product: Product | null
  onSaved: () => void
  onCancel: () => void
}

export default function ProductForm({ product, onSaved, onCancel }: FormProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: 1,
    price: 0,
    image_url: "",
    stock: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error("Error fetching categories:", err)
      }
    }

    fetchCategories()

    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category_id: Number(product.category_id) || 1,
        price: Number(product.price) || 0,
        image_url: product.image_url || "",
        stock: Number(product.stock) || 0,
      })
    }
  }, [product])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log("[v0] File selected:", file.name, file.type, file.size)

    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona una imagen válida")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      setError("La imagen no puede ser mayor a 5MB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)

    setUploading(true)
    setError(null)

    try {
      const formDataBlob = new FormData()
      formDataBlob.append("file", file)

      console.log("[v0] Uploading to /api/upload...")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataBlob,
      })

      console.log("[v0] Upload response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || "Error al subir imagen")
      }

      const data = await response.json()
      console.log("[v0] Upload successful, URL:", data.url)

      setFormData({ ...formData, image_url: data.url })
      setError(null)
    } catch (err) {
      console.error("[v0] Upload error:", err)
      setError(err instanceof Error ? err.message : "Error al subir imagen")
      setPreviewImage(null)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = product ? `/api/products/${product.id}` : "/api/products"
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Error guardando producto")
      }

      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Nombre</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg bg-input"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Categoría</label>
          <select
            required
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: Number.parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-border rounded-lg bg-input"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Precio</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.price || ""}
            onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-border rounded-lg bg-input"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Stock</label>
          <input
            type="number"
            required
            value={formData.stock || ""}
            onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-border rounded-lg bg-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Descripción</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg bg-input min-h-24"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Imagen del Producto</label>
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <label className="flex-1 cursor-pointer">
              <div className="px-4 py-2 border-2 border-dashed border-border rounded-lg bg-input hover:bg-muted transition text-center">
                <span className="text-sm font-semibold">
                  {uploading ? "Subiendo..." : "Seleccionar imagen desde tu computadora"}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {(previewImage || formData.image_url) && (
            <div className="relative">
              <img
                src={previewImage || formData.image_url || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border-2 border-border"
              />
              {formData.image_url && (
                <div className="mt-2 text-xs text-muted-foreground break-all">URL: {formData.image_url}</div>
              )}
            </div>
          )}

          {uploading && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Subiendo imagen a Vercel Blob...</span>
            </div>
          )}
        </div>
      </div>

      {error && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-border rounded-lg font-semibold hover:bg-muted"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex-1 cafeito-button-primary py-2 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Guardando..." : product ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  )
}
