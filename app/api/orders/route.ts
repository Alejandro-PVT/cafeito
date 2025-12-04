import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const adminId = request.cookies.get("auth_token")?.value
    if (!adminId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const results = await query(`SELECT * FROM orders ORDER BY created_at DESC LIMIT 100`)
    return NextResponse.json(results)
  } catch (error) {
    console.error("Error obteniendo órdenes:", error)
    return NextResponse.json({ error: "Error obteniendo órdenes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customer_name, customer_email, customer_phone, items, payment_method, notes } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Orden sin items" }, { status: 400 })
    }

    const orderNumber = `ORD-${Date.now()}`
    let total = 0

    // Calculate total
    for (const item of items) {
      const products: any[] = await query("SELECT price FROM products WHERE id = ?", [item.product_id])
      if (products.length > 0) {
        total += products[0].price * item.quantity
      }
    }

    const orderResults: any[] = await query(
      `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, total, payment_method, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderNumber, customer_name, customer_email, customer_phone, total, payment_method, notes],
    )

    const orderId = orderResults.insertId || orderResults[0]?.id

    // Insert order items
    for (const item of items) {
      const products: any[] = await query("SELECT price FROM products WHERE id = ?", [item.product_id])
      const unitPrice = products[0]?.price || 0
      const subtotal = unitPrice * item.quantity

      await query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, unitPrice, subtotal],
      )

      // Update inventory
      await query(
        `INSERT INTO inventory_logs (product_id, quantity_change, reason)
         VALUES (?, ?, ?)`,
        [item.product_id, -item.quantity, "Venta"],
      )
    }

    return NextResponse.json({ id: orderId, order_number: orderNumber, total }, { status: 201 })
  } catch (error) {
    console.error("Error creando orden:", error)
    return NextResponse.json({ error: "Error creando orden" }, { status: 500 })
  }
}
