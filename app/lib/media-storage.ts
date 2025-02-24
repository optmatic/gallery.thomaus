import { writeFile, readFile } from "fs/promises"
import { join } from "path"
import type { MediaItem } from "@/app/types"

const STORAGE_PATH = join(process.cwd(), "data")
const MEDIA_FILE = join(STORAGE_PATH, "media.json")

export async function initStorage() {
  try {
    await readFile(MEDIA_FILE)
  } catch {
    await writeFile(MEDIA_FILE, JSON.stringify({ items: [] }), "utf-8")
  }
}

export async function getAllMedia(page = 1, limit = 20): Promise<{ items: MediaItem[]; total: number }> {
  try {
    const data = await readFile(MEDIA_FILE, "utf-8")
    const { items } = JSON.parse(data)
    const start = (page - 1) * limit
    const paginatedItems = items.slice(start, start + limit)
    return {
      items: paginatedItems,
      total: items.length,
    }
  } catch (error) {
    console.error("Error reading media data:", error)
    return { items: [], total: 0 }
  }
}

export async function addMediaItem(item: Omit<MediaItem, "id" | "createdAt">) {
  try {
    const data = await readFile(MEDIA_FILE, "utf-8")
    const { items } = JSON.parse(data)
    const newItem: MediaItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    items.unshift(newItem) // Add new items at the beginning
    await writeFile(MEDIA_FILE, JSON.stringify({ items }, null, 2), "utf-8")
    return newItem
  } catch (error) {
    console.error("Error adding media item:", error)
    throw error
  }
}

