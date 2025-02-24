export interface UploadFormProps {
    onFileUpload: (file: File[]) => void;
}

export interface MediaGridProps {
    files: File[];
}

export interface MediaItemProps {
    file: File;
}
export interface MediaItem {
    id: string
    title: string
    path: string
    createdAt: string
  }
  
  export interface MediaResponse {
    items: MediaItem[]
    hasMore: boolean
    total: number
  }
  
  