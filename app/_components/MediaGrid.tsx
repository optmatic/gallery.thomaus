"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { useInView } from "react-intersection-observer"
import { Loader2 } from "lucide-react"
import type { MediaItem } from "@/app/types"

export default function MediaGrid() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ref, inView] = useInView()

  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/media?page=${page}&limit=20`)
      if (!response.ok) throw new Error("Failed to fetch images")

      const data = await response.json()

      setItems((prevItems) => [...prevItems, ...data.items])
      setHasMore(data.hasMore)
      setPage((prev) => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images")
      console.error("Error loading items:", err)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore])

  useEffect(() => {
    if (inView && hasMore) {
      loadMoreItems()
    }
  }, [inView, loadMoreItems, hasMore])

  if (error) {
    return <div className="text-center text-red-500 py-4">Error: {error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.id} className="group aspect-square relative overflow-hidden rounded-lg bg-muted/30">
            <Image
              src={item.path || "/placeholder.svg"}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-all duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-4 text-white w-full">
                <h3 className="text-sm font-medium truncate">{item.title}</h3>
                <p className="text-xs text-gray-300">{new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div ref={ref} className="flex justify-center py-4">
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading more images...
          </div>
        )}
        {!hasMore && items.length > 0 && <div className="text-muted-foreground text-sm">No more images to load</div>}
        {!loading && items.length === 0 && <div className="text-muted-foreground text-sm">No images uploaded yet</div>}
      </div>
    </div>
  )
}

