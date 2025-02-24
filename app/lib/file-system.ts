import { readdir, stat } from "fs/promises"
import { join } from "path"
import type { MediaItem } from "@/app/types"

const UPLOADS_DIR = join(process.cwd(), "public/uploads")

export async function getUploadedFiles(page = 1, limit = 20): Promise<{ items: MediaItem[]; total: number }> {
  try {
    // Read all files from the uploads directory
    const files = await readdir(UPLOADS_DIR)

    // Filter out .gitkeep and any other hidden files
    const imageFiles = files.filter((file) => !file.startsWith(".") && /\.(jpg|jpeg|png|gif|webp)$/i.test(file))

    // Get file stats and create MediaItems
    const filePromises = imageFiles.map(async (filename) => {
      const filePath = join(UPLOADS_DIR, filename)
      const fileStats = await stat(filePath)

      // Extract title from filename (remove timestamp and clean up)
      const title = filename
        .split("-")
        .slice(0, -2) // Remove the timestamp parts
        .join(" ")
        .replace(/\.[^/.]+$/, "") // Remove extension
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      return {
        id: filename,
        title,
        path: `/uploads/${filename}`,
        createdAt: fileStats.birthtime.toISOString(),
      }
    })

    const allItems = await Promise.all(filePromises)

    // Sort by creation date, newest first
    allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Paginate results
    const start = (page - 1) * limit
    const paginatedItems = allItems.slice(start, start + limit)

    return {
      items: paginatedItems,
      total: allItems.length,
    }
  } catch (error) {
    console.error("Error reading uploads directory:", error)
    return { items: [], total: 0 }
  }
}

