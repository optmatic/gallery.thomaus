import MediaGrid from "@/app/_components/MediaGrid"
import UploadForm from "@/app/_components/UploadForm"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Media Grid</h1>
      <UploadForm />
      <MediaGrid />
    </main>
  )
}

