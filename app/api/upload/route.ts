import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("[v0] Upload API called")

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log("[v0] No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] Uploading file:", file.name, "Size:", file.size)

    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`

    const blob = await put(fileName, file, {
      access: "public",
    })

    console.log("[v0] Upload successful:", blob.url)

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
