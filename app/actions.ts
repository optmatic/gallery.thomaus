"use server"

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { revalidatePath } from "next/cache"
import { addMediaItem, initStorage } from "@/app/lib/media-storage"

interface UploadResult {
  success: boolean
  path?: string
  error?: string
  title?: string
}

export async function uploadImage(data: FormData): Promise<UploadResult> {
  try {
    const file = data.get("file") as File
    const title = data.get("title") as string

    if (!file) {
      throw new Error("No file uploaded")
    }

    if (!title) {
      throw new Error("No title provided")
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public/uploads")
    try {
      await mkdir(uploadsDir, { recursive: true })
      await mkdir(join(process.cwd(), "data"), { recursive: true })
      await initStorage()
    } catch (error) {
      console.error("Error creating directories:", error)
    }

    // Create unique filename while preserving extension
    const extension = file.name.split(".").pop()
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    const filename = `${sanitizedTitle}-${uniqueSuffix}.${extension}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write file to uploads directory
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    // Create the public URL
    const publicPath = `/uploads/${filename}`

    // Store metadata
    await addMediaItem({
      title,
      path: publicPath,
    })

    // Revalidate the page to show new image
    revalidatePath("/")

    return {
      success: true,
      path: publicPath,
      title: title,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file",
    }
  }
}

