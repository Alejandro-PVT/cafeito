"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminDashboard from "@/components/admin/dashboard"
import AdminLogin from "@/components/admin/login"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          credentials: "include",
        })
        setIsAuthenticated(response.ok)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg">Cargando...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
}
