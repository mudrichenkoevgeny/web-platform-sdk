import React, { useEffect, useState } from 'react'
import { StorageCategory } from '@mudrichenkoevgeny/shared-foundation'
import { CoreIcon } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { getStorageCategoryIcon } from '@/ui/utils/storage-icon-mapper'

/**
 * Props for {@link StorageFilePreview}.
 */
export interface StorageFilePreviewProps {
  /** Target File object. */
  file: File
  /** Storage category of the file. */
  category: StorageCategory
}

/**
 * Universal component rendering image/video thumbnail preview or fallback category icon for a local {@link File}.
 *
 * @param props - Component properties including file handle and storage category.
 * @returns React element rendering thumbnail preview or fallback icon.
 */
export const StorageFilePreview: React.FC<StorageFilePreviewProps> = ({ file, category }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (category !== StorageCategory.IMAGE && category !== StorageCategory.VIDEO) {
      return
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file, category])

  if (previewUrl && category === StorageCategory.IMAGE) {
    return (
      <div className="w-12 h-12 rounded-md bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
        <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
      </div>
    )
  }

  if (previewUrl && category === StorageCategory.VIDEO) {
    return (
      <div className="w-12 h-12 rounded-md bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
        <video src={previewUrl} preload="metadata" muted playsInline className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div className="w-12 h-12 rounded-md bg-muted border border-border flex items-center justify-center shrink-0">
      <CoreIcon src={getStorageCategoryIcon(category)} size={24} className="text-muted-foreground" />
    </div>
  )
}
