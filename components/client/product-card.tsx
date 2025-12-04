"use client"

import { useState } from "react"

interface Product {
  id: number
  name: string
  description: string
  price: number | string
  image_url: string
  stock: number
  category_name?: string
}

interface ProductCardProps {
  product: Product
  onAddToCart: () => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const isOutOfStock = product.stock === 0
  const price = typeof product.price === "string" ? Number.parseFloat(product.price) : product.price
  const displayPrice = isNaN(price) ? 0 : price

  const getProductImageUrl = () => {
    const productName = product.name.toLowerCase()

    // Mapeo específico por nombre de producto
    const imageMap: Record<string, string> = {
      // Cafés
      espresso: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop",
      americano: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop",
      cappuccino: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop",
      latte: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=300&fit=crop",
      mocha: "https://images.unsplash.com/photo-1607260550778-aa4d10b3e1e8?w=400&h=300&fit=crop",

      // Panes
      croissant: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop",
      "pan dulce": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
      concha: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&h=300&fit=crop",
      dona: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
      muffin: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop",

      // Productos de café
      "café molido": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
      "café en grano": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop",
      "taza cerámica": "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop",
      "taza térmica": "https://images.unsplash.com/photo-1606662168929-2d78da441c6f?w=400&h=300&fit=crop",
      "french press": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop",
    }

    // Buscar coincidencia exacta o parcial
    for (const [key, url] of Object.entries(imageMap)) {
      if (productName.includes(key)) {
        return url
      }
    }

    // Fallback basado en categoría
    const category = product.category_name?.toLowerCase() || ""
    if (category.includes("café") && !category.includes("producto")) {
      return "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop"
    } else if (category.includes("pan")) {
      return "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop"
    } else if (category.includes("taza") || category.includes("accesorio")) {
      return "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop"
    } else if (category.includes("molido") || category.includes("grano")) {
      return "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop"
    }

    // Default general
    return "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop"
  }

  const imageUrl = imageError || !product.image_url ? getProductImageUrl() : product.image_url

  return (
    <div className="cafeito-card overflow-hidden hover:shadow-lg transition">
      <div className="relative h-48 bg-muted overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          crossOrigin="anonymous"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Agotado</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">${displayPrice.toFixed(2)}</span>
          <button
            onClick={onAddToCart}
            disabled={isOutOfStock}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              isOutOfStock
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "cafeito-button-secondary hover:bg-secondary/90"
            }`}
          >
            {isOutOfStock ? "Sin stock" : "Añadir"}
          </button>
        </div>
      </div>
    </div>
  )
}
