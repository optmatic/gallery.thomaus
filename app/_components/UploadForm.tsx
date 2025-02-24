"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Upload } from "lucide-react"
import { uploadImage } from "@/app/actions"
import UploadDialog from "./upload-dialog"

export default function UploadForm() {
  const [dragActive, setDragActive] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleUpload = async (title: string) => {
    if (!selectedFile) return

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("title", title)

      startTransition(async () => {
        const result = await uploadImage(formData)
        if (!result.success) {
          setError(result.error || "Failed to upload file")
        } else {
          setSelectedFile(null)
          setIsDialogOpen(false)
        }
      })
    } catch (err) {
      setError("Failed to upload file")
      console.error("Upload error:", err)
    }
  }

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }
    setSelectedFile(file)
    setIsDialogOpen(true)
    setError(null)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  return (
    <div className="mb-8">
      <form
        className={`p-8 border-2 border-dashed rounded-lg text-center relative ${
          dragActive ? "border-primary bg-primary/10" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <span className="mt-2 block text-sm font-semibold text-gray-900">Drop image here or click to upload</span>
          <span className="mt-1 block text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
          disabled={isPending}
        />
      </form>
      {error && <div className="mt-2 text-sm text-red-500 text-center">{error}</div>}

      <UploadDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setSelectedFile(null)
        }}
        onConfirm={handleUpload}
        filename={selectedFile?.name || ""}
        isUploading={isPending}
      />
    </div>
  )
}

