import { type NextRequest, NextResponse } from "next/server"
import { getUploadedFiles } from "@/app/lib/file-system"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  try {
    const { items, total } = await getUploadedFiles(page, limit)
    const hasMore = total > page * limit

    return NextResponse.json({
      items,
      hasMore,
      total,
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch media items" }, { status: 500 })
  }
}

