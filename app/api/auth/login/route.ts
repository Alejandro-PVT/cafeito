import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("[v0] Login attempt:", { username, password })

    if (!username || !password) {
      return NextResponse.json({ error: "Usuario y contraseña requeridos" }, { status: 400 })
    }

    const results: any[] = await query("SELECT * FROM users WHERE username = ? AND is_active = TRUE", [username])

    console.log("[v0] Database query results:", results.length)

    if (results.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })
    }

    if (!verifyPassword(password, results[0].password)) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    const user = results[0]
    const response = NextResponse.json({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    })

    response.cookies.set("auth_token", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
