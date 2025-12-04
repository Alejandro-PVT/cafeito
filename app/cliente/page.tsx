"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/client/header"
import ProductCatalog from "@/components/client/product-catalog"
import Cart from "@/components/client/cart"
import Checkout from "@/components/client/checkout"

export default function ClientePage() {
  const [view, setView] = useState<"catalog" | "checkout">("catalog")
  const [cart, setCart] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={cart.length} onCartClick={() => setShowCart(!showCart)} />

      <main className="container mx-auto px-4 py-8">
        {view === "catalog" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProductCatalog onAddToCart={addToCart} />
            </div>
            {showCart && (
              <div className="lg:col-span-1">
                <Cart
                  items={cart}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                  onCheckout={() => setView("checkout")}
                />
              </div>
            )}
          </div>
        ) : (
          <Checkout
            items={cart}
            onBackToCatalog={() => {
              setView("catalog")
              setCart([])
            }}
          />
        )}
      </main>

      <footer className="mt-12 py-6 border-t border-border text-center text-muted-foreground">
        <Link href="/" className="hover:text-primary transition">
          ← Volver al inicio
        </Link>
      </footer>
    </div>
  )
}
