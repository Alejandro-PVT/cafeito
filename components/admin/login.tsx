"use client"

import type React from "react"

import { useState } from "react"

interface LoginProps {
  onLoginSuccess: () => void
}

export default function AdminLogin({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Usuario o contraseña incorrectos")
      }

      onLoginSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
      <div className="cafeito-card w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-primary-foreground">C</span>
          </div>
          <h1 className="text-3xl font-bold text-primary">CafeITO</h1>
          <p className="text-muted-foreground mt-2">Panel de Administrador</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              required
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>

          {error && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full cafeito-button-primary py-2 rounded-lg font-bold hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Usuario: admin</p>
          <p>Contraseña: admin123</p>
        </div>
      </div>
    </div>
  )
}
