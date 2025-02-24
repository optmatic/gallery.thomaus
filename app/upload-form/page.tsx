import UploadForm from "@/app/_components/UploadForm"
import MediaGrid from "@/app/_components/MediaGrid"

export default function UploadFormPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <UploadForm />
      <MediaGrid />
    </main>
  )
}
