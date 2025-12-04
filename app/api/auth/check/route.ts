import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true })
}
