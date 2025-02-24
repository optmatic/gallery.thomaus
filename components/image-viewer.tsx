"use client"

import { useEffect, useCallback } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import type { MediaItem } from "@/app/types"

interface ImageViewerProps {
  images: MediaItem[]
  currentImage: MediaItem | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function ImageViewer({ images, currentImage, onClose, onNavigate }: ImageViewerProps) {
  const currentIndex = currentImage ? images.findIndex((img) => img.id === currentImage.id) : -1

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1)
    }
  }, [currentIndex, onNavigate])

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1)
    }
  }, [currentIndex, images.length, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [handlePrevious, handleNext, onClose])

  if (!currentImage) return null

  return (
    <Dialog open={!!currentImage} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-7xl w-full h-[90vh] flex flex-col p-0 gap-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex-1 px-4">
            <h2 className="text-lg font-semibold">{currentImage.title}</h2>
            <p className="text-sm text-muted-foreground">{new Date(currentImage.createdAt).toLocaleDateString()}</p>
          </div>
          <Button variant="ghost" size="icon" className="opacity-70 hover:opacity-100" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative flex-1 flex items-center justify-center p-4">
          <div className="relative w-full h-full">
            <Image
              src={currentImage.path || "/placeholder.svg"}
              alt={currentImage.title}
              fill
              className="object-contain"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          </div>

          {/* Navigation buttons */}
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full bg-background/90 hover:bg-background pointer-events-auto ${
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "opacity-70 hover:opacity-100"
              }`}
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full bg-background/90 hover:bg-background pointer-events-auto ${
                currentIndex === images.length - 1 ? "opacity-50 cursor-not-allowed" : "opacity-70 hover:opacity-100"
              }`}
              onClick={handleNext}
              disabled={currentIndex === images.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/90 text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </DialogContent>
    </Dialog>
  )
}

