import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminId = request.cookies.get("auth_token")?.value
    if (!adminId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const orders: any[] = await query("SELECT * FROM orders WHERE id = ?", [params.id])

    if (orders.length === 0) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
    }

    const items = await query(
      `SELECT oi.*, p.name FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [params.id],
    )

    return NextResponse.json({ ...orders[0], items })
  } catch (error) {
    console.error("Error obteniendo orden:", error)
    return NextResponse.json({ error: "Error obteniendo orden" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminId = request.cookies.get("auth_token")?.value
    if (!adminId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { status, payment_status } = await request.json()

    await query(`UPDATE orders SET status = ?, payment_status = ? WHERE id = ?`, [status, payment_status, params.id])

    return NextResponse.json({ message: "Orden actualizada" })
  } catch (error) {
    console.error("Error actualizando orden:", error)
    return NextResponse.json({ error: "Error actualizando orden" }, { status: 500 })
  }
}
