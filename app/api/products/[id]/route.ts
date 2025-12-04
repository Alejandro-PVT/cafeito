import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log("[v0] GET producto ID:", id)

    const results: any[] = await query("SELECT * FROM products WHERE id = ? AND is_active = TRUE", [id])

    if (results.length === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(results[0])
  } catch (error) {
    console.error("[v0] Error obteniendo producto:", error)
    return NextResponse.json({ error: "Error obteniendo producto" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log("[v0] PUT producto ID:", id)

    const adminId = request.cookies.get("auth_token")?.value
    if (!adminId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Body recibido:", body)

    const { name, description, category_id, price, image_url, stock, is_active } = body

    const stockValue = stock !== undefined ? Number(stock) : 0
    const isActiveValue = is_active !== undefined ? (is_active ? 1 : 0) : 1
    const priceValue = Number(price)

    console.log("[v0] Valores a actualizar:", {
      name,
      description,
      category_id,
      priceValue,
      image_url,
      stockValue,
      isActiveValue,
      id,
    })

    await query(
      `UPDATE products SET name = ?, description = ?, category_id = ?, 
       price = ?, image_url = ?, stock = ?, is_active = ? WHERE id = ?`,
      [name, description, category_id, priceValue, image_url, stockValue, isActiveValue, id],
    )

    console.log("[v0] Producto actualizado exitosamente")
    return NextResponse.json({ message: "Producto actualizado" })
  } catch (error) {
    console.error("[v0] Error actualizando producto:", error)
    return NextResponse.json({ error: "Error actualizando producto" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log("[v0] DELETE producto ID:", id)

    const adminId = request.cookies.get("auth_token")?.value
    if (!adminId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    await query("UPDATE products SET is_active = FALSE WHERE id = ?", [id])

    console.log("[v0] Producto eliminado exitosamente")
    return NextResponse.json({ message: "Producto eliminado" })
  } catch (error) {
    console.error("[v0] Error eliminando producto:", error)
    return NextResponse.json({ error: "Error eliminando producto" }, { status: 500 })
  }
}
