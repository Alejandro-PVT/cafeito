"use client"

import { useState, useEffect } from "react"
import ProductCard from "./product-card"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  category_name: string
  stock: number
}

interface CatalogProps {
  onAddToCart: (product: Product) => void
}

export default function ProductCatalog({ onAddToCart }: CatalogProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsRes, categoriesRes] = await Promise.all([fetch("/api/products"), fetch("/api/categories")])

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error("Error cargando datos")
        }

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        setProducts(productsData)
        setCategories(categoriesData)
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].name)
        }
      } catch (err) {
        setError("Error cargando productos")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = selectedCategory ? products.filter((p) => p.category_name === selectedCategory) : products

  if (loading) {
    return <div className="text-center py-8">Cargando productos...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Nuestros Productos</h2>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedCategory === cat.name
                  ? "cafeito-button-primary"
                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={() => onAddToCart(product)} />
        ))}
      </div>
    </div>
  )
}
