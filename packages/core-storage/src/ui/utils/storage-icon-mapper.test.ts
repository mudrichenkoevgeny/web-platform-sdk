import { describe, it, expect } from 'vitest'
import { StorageCategory, StorageFileStatus } from '@mudrichenkoevgeny/shared-foundation'
import { storageIcons } from '@/assets/icons'
import { getStorageCategoryIcon, getStorageStatusIcon } from './storage-icon-mapper'

describe('storage-icon-mapper', () => {
  it('returns correct icon for each StorageCategory', () => {
    expect(getStorageCategoryIcon(StorageCategory.IMAGE)).toBe(storageIcons.fileImage)
    expect(getStorageCategoryIcon(StorageCategory.VIDEO)).toBe(storageIcons.fileVideo)
    expect(getStorageCategoryIcon(StorageCategory.AUDIO)).toBe(storageIcons.fileAudio)
    expect(getStorageCategoryIcon(StorageCategory.DOCUMENT)).toBe(storageIcons.fileDocument)
    expect(getStorageCategoryIcon(StorageCategory.OTHER)).toBe(storageIcons.fileOther)
  })

  it('returns correct icon for each StorageFileStatus', () => {
    expect(getStorageStatusIcon(StorageFileStatus.PENDING_UPLOAD)).toBe(storageIcons.fileStatusPendingUpload)
    expect(getStorageStatusIcon(StorageFileStatus.PROCESSING)).toBe(storageIcons.fileStatusProcessing)
    expect(getStorageStatusIcon(StorageFileStatus.READY)).toBe(storageIcons.fileStatusReady)
    expect(getStorageStatusIcon(StorageFileStatus.DELETED)).toBe(storageIcons.fileStatusDeleted)
  })
})
