"use client"

import { useState, useEffect } from "react"

interface Order {
  id: number
  order_number: string
  customer_name: string
  total: number | string
  status: string
  payment_status: string
  created_at: string
}

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/orders", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      })

      if (response.ok) {
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null)
        }
      }
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  const filteredOrders = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    preparing: "bg-blue-100 text-blue-800",
    ready: "bg-green-100 text-green-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <div>
      <div className="mb-6 flex gap-2 flex-wrap">
        {["pending", "preparing", "ready", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? null : status)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              statusFilter === status
                ? "cafeito-button-primary"
                : "bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Cargando órdenes...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const total = typeof order.total === "string" ? Number.parseFloat(order.total) : order.total
                const displayTotal = isNaN(total) ? 0 : total
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`cafeito-card p-4 cursor-pointer transition ${
                      selectedOrder?.id === order.id ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_name || "Cliente"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-primary">${displayTotal.toFixed(2)}</p>
                        <p
                          className={`text-sm font-semibold rounded px-2 py-1 ${statusColors[order.status as keyof typeof statusColors]}`}
                        >
                          {order.status}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {selectedOrder && (
            <div className="cafeito-card p-6 h-fit sticky top-24">
              <h3 className="font-bold text-lg mb-4">Detalles de Orden</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Número</p>
                  <p className="font-semibold">{selectedOrder.order_number}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cliente</p>
                  <p className="font-semibold">{selectedOrder.customer_name || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-bold text-lg text-primary">
                    $
                    {(typeof selectedOrder.total === "string"
                      ? Number.parseFloat(selectedOrder.total)
                      : selectedOrder.total
                    ).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">Estado</p>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded bg-input"
                  >
                    {["pending", "preparing", "ready", "completed", "cancelled"].map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
