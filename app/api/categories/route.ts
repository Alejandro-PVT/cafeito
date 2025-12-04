import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const results = await query("SELECT * FROM categories WHERE is_active = TRUE")
    return NextResponse.json(results)
  } catch (error) {
    console.error("Error obteniendo categorías:", error)
    return NextResponse.json({ error: "Error obteniendo categorías" }, { status: 500 })
  }
}
