"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { useInView } from "react-intersection-observer"

type MediaItem = {
  id: string
  url: string
}

export default function MediaGrid() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [page, setPage] = useState(1)
  const [ref, inView] = useInView()

  const loadMoreItems = useCallback(async () => {
    // In a real application, you would fetch data from an API
    const newItems = Array.from({ length: 10 }, (_, i) => ({
      id: `${page}-${i}`,
      url: `/placeholder.svg?height=300&width=300&text=Image ${page}-${i}`,
    }))
    setItems((prevItems) => [...prevItems, ...newItems])
    setPage((prevPage) => prevPage + 1)
  }, [page])

  useEffect(() => {
    if (inView) {
      loadMoreItems()
    }
  }, [inView, loadMoreItems])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <div key={item.id} className="aspect-square relative overflow-hidden rounded-lg">
          <Image
            src={item.url || "/placeholder.svg"}
            alt={`Media item ${item.id}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover"
          />
        </div>
      ))}
      <div ref={ref} className="col-span-full h-10" />
    </div>
  )
}

