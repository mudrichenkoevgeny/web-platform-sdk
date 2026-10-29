import {
  StorageCategory,
  StorageFileVisibility,
  UploadQueueItemStatus,
  type UploadQueueItemId,
  type UploadQueueItem,
  type StorageFilePrivate,
  type StorageFileUploadUiConfig
} from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

export { UploadQueueItemStatus }

/** Represents a single file in the client upload queue. */
export interface FileUploadQueueItem extends Omit<UploadQueueItem, 'error'> {
  id: UploadQueueItemId
  file: File
  error: AppError | null
}

/** Execution contract for uploading a file required by storage upload store. */
export interface StorageFileUploadUseCaseContract {
  execute(params: {
    file: File
    category: string
    visibility: string
    targetScope: string
    onProgress?: (percent: number) => void
  }): Promise<AppResult<StorageFilePrivate, AppError>>
}

/**
 * Dependencies required to construct and run {@link StorageFileUploadStore}.
 */
export interface StorageFileUploadStoreDependencies {
  /** Use case or service execution contract for uploading a file. */
  uploadFileUseCase: StorageFileUploadUseCaseContract
  /** Callback invoked when all queued files are successfully uploaded. */
  onUploaded: (files: StorageFilePrivate[]) => void
  /** Callback invoked when user triggers back navigation. */
  onBack?: () => void
}

/**
 * Internal state and actions contract for {@link StorageFileUploadStore}.
 */
export interface StorageFileUploadStoreState {
  /** The queue of files to be uploaded. */
  items: FileUploadQueueItem[]
  /** Component configuration constraints. */
  config: StorageFileUploadUiConfig
  /** Whether the queue upload operation is currently in progress. */
  isUploading: boolean

  /** Appends files to the upload queue and validates them. */
  addFiles: (files: FileList | File[]) => void
  /** Removes a specific item from the queue (unless currently uploading). */
  removeItem: (id: UploadQueueItemId) => void
  /** Updates the selected category for a specific queue item. */
  setItemCategory: (id: UploadQueueItemId, category: StorageCategory) => void
  /** Updates the selected visibility for a specific queue item. */
  setItemVisibility: (id: UploadQueueItemId, visibility: StorageFileVisibility) => void
  /** Triggers concurrent batch file upload execution. */
  upload: () => Promise<void>
  /** Triggers navigation back to the previous screen. */
  onBackClick: () => void
}
