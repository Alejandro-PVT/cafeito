import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const results = await query(
      `SELECT p.*, c.name as category_name FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = TRUE
       ORDER BY c.name, p.name`,
    )
    return NextResponse.json(results)
  } catch (error) {
    console.error("Error obteniendo productos:", error)
    return NextResponse.json({ error: "Error obteniendo productos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminId = request.cookies.get("auth_token")?.value
    if (!adminId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { name, description, category_id, price, image_url, stock } = await request.json()

    if (!name || !category_id || !price) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 })
    }

    await query(
      `INSERT INTO products (name, description, category_id, price, image_url, stock)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, category_id, price, image_url, stock || 0],
    )

    return NextResponse.json({ message: "Producto creado exitosamente" }, { status: 201 })
  } catch (error) {
    console.error("Error creando producto:", error)
    return NextResponse.json({ error: "Error creando producto" }, { status: 500 })
  }
}
