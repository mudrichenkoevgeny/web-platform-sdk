import type React from 'react'
import { StorageCategory, StorageFileStatus } from '@mudrichenkoevgeny/shared-foundation'
import { storageIcons } from '@/assets/icons'

/**
 * Returns the appropriate SVG icon asset source for a given storage file category.
 *
 * @param category - Target file category
 * @returns React SVG icon component
 */
export const getStorageCategoryIcon = (
  category: StorageCategory
): React.FC<React.SVGProps<SVGSVGElement>> => {
  switch (category) {
    case StorageCategory.IMAGE:
      return storageIcons.fileImage
    case StorageCategory.VIDEO:
      return storageIcons.fileVideo
    case StorageCategory.AUDIO:
      return storageIcons.fileAudio
    case StorageCategory.DOCUMENT:
      return storageIcons.fileDocument
    case StorageCategory.OTHER:
      return storageIcons.fileOther
  }
}

/**
 * Returns the appropriate SVG icon asset source for a given storage file lifecycle status.
 *
 * @param status - Target file status
 * @returns React SVG icon component
 */
export const getStorageStatusIcon = (
  status: StorageFileStatus
): React.FC<React.SVGProps<SVGSVGElement>> => {
  switch (status) {
    case StorageFileStatus.PENDING_UPLOAD:
      return storageIcons.fileStatusPendingUpload
    case StorageFileStatus.PROCESSING:
      return storageIcons.fileStatusProcessing
    case StorageFileStatus.READY:
      return storageIcons.fileStatusReady
    case StorageFileStatus.DELETED:
      return storageIcons.fileStatusDeleted
  }
}
