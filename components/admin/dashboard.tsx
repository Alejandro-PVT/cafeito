"use client"

import { useState } from "react"
import AdminSidebar from "./sidebar"
import ProductsAdmin from "./products-admin"
import OrdersAdmin from "./orders-admin"

interface DashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<"products" | "orders">("products")

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    onLogout()
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar currentView={currentView} onViewChange={setCurrentView} onLogout={handleLogout} />

      <main className="flex-1 overflow-auto">
        <div className="cafeito-header sticky top-0 z-40 shadow-md">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {currentView === "products" ? "Gestión de Productos" : "Gestión de Órdenes"}
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-primary-foreground text-primary rounded-lg font-semibold hover:bg-opacity-90"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="p-6">
          {currentView === "products" && <ProductsAdmin />}
          {currentView === "orders" && <OrdersAdmin />}
        </div>
      </main>
    </div>
  )
}
