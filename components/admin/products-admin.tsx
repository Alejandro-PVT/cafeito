"use client"

import { useState, useEffect } from "react"
import ProductForm from "./product-form"

interface Product {
  id: number
  name: string
  price: number
  stock: number
  category_name: string
  image_url: string
  description: string
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await fetch(`/api/products/${id}`, {
          method: "DELETE",
          credentials: "include",
        })
        fetchProducts()
      } catch (error) {
        console.error("Error deleting product:", error)
      }
    }
  }

  const handleProductSaved = () => {
    setShowForm(false)
    setEditingProduct(null)
    fetchProducts()
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Productos</h2>
        <button
          onClick={() => {
            setEditingProduct(null)
            setShowForm(true)
          }}
          className="cafeito-button-secondary px-6 py-2 rounded-lg font-bold"
        >
          + Nuevo Producto
        </button>
      </div>

      {showForm && (
        <div className="mb-6 cafeito-card p-6">
          <ProductForm
            product={editingProduct}
            onSaved={handleProductSaved}
            onCancel={() => {
              setShowForm(false)
              setEditingProduct(null)
            }}
          />
        </div>
      )}

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="cafeito-card overflow-hidden">
              <img
                src={
                  product.image_url || `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(product.name)}`
                }
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Precio</p>
                    <p className="font-bold">${product.price}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stock</p>
                    <p className={`font-bold ${product.stock === 0 ? "text-destructive" : "text-secondary"}`}>
                      {product.stock}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct(product)
                      setShowForm(true)
                    }}
                    className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded font-semibold hover:bg-secondary/90"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 px-3 py-2 bg-destructive text-destructive-foreground rounded font-semibold hover:bg-destructive/90"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
