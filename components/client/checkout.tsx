"use client"

import type React from "react"

import { useState } from "react"

interface CheckoutProps {
  items: any[]
  onBackToCatalog: () => void
}

export default function Checkout({ items, onBackToCatalog }: CheckoutProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = items.reduce((sum: number, item: any) => {
    const price = typeof item.price === "string" ? Number.parseFloat(item.price) : item.price
    return sum + (isNaN(price) ? 0 : price) * item.quantity
  }, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          items: items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
          payment_method: paymentMethod,
          notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Error creando orden")
      }

      const order = await response.json()
      setSuccess(true)

      setTimeout(() => {
        onBackToCatalog()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="cafeito-card p-8 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold text-secondary mb-4">¡Orden Confirmada!</h2>
        <p className="text-lg mb-4">Gracias por su compra. Su orden ha sido registrada.</p>
        <p className="text-sm text-muted-foreground">Redirigiendo al catálogo...</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="cafeito-card p-6">
            <h2 className="text-xl font-bold mb-4">Información de Contacto</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                required
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input"
              />
              <input
                type="email"
                placeholder="Email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input"
              />
            </div>
          </div>

          <div className="cafeito-card p-6">
            <h2 className="text-xl font-bold mb-4">Método de Pago</h2>
            <div className="space-y-2">
              {["cash", "card", "transfer"].map((method) => (
                <label key={method} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="capitalize">
                    {method === "cash" ? "Efectivo" : method === "card" ? "Tarjeta" : "Transferencia"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="cafeito-card p-6">
            <h2 className="text-xl font-bold mb-4">Notas Especiales</h2>
            <textarea
              placeholder="Ej: Sin azúcar en el café..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input min-h-24"
            />
          </div>

          {error && <div className="text-destructive font-semibold">{error}</div>}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBackToCatalog}
              className="flex-1 px-4 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 cafeito-button-primary py-3 rounded-lg font-bold hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? "Procesando..." : "Confirmar Orden"}
            </button>
          </div>
        </form>
      </div>

      <div className="cafeito-card p-6 h-fit sticky top-24">
        <h2 className="text-xl font-bold mb-4">Resumen</h2>
        <div className="space-y-3 mb-4">
          {items.map((item) => {
            const price = typeof item.price === "string" ? Number.parseFloat(item.price) : item.price
            const displayPrice = isNaN(price) ? 0 : price
            return (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span className="font-semibold">${(displayPrice * item.quantity).toFixed(2)}</span>
              </div>
            )
          })}
        </div>
        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Total:</span>
            <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
