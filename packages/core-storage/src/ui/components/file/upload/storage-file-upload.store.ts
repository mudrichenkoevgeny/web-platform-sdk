import { createStore } from 'zustand'
import {
  StorageCategory,
  StorageFileVisibility,
  UploadQueueItemStatus,
  toUploadQueueItemIdOrThrow,
  storageUploadValidator,
  type UploadQueueItemId,
  type StorageFilePrivate,
  type StorageFileUploadUiConfig
} from '@mudrichenkoevgeny/shared-foundation'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess, generateUuid } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageError } from '@/error/model/storage-error'
import type {
  FileUploadQueueItem,
  StorageFileUploadStoreDependencies,
  StorageFileUploadStoreState
} from './storage-file-upload.types'

const MAX_CONCURRENT_UPLOADS = 3

/**
 * Store instance type returned by {@link createStorageFileUploadStore}.
 */
export type StorageFileUploadStore = ReturnType<typeof createStorageFileUploadStore>

/**
 * Factory function creating a Zustand store instance for managing file upload UI state.
 *
 * @param deps - Storage file upload store dependencies.
 * @param config - Configuration options for the upload area.
 * @returns Initialized Zustand store instance.
 */
export const createStorageFileUploadStore = (
  deps: StorageFileUploadStoreDependencies,
  config: StorageFileUploadUiConfig
) => {
  return createStore<StorageFileUploadStoreState>()((set, get) => ({
    items: [],
    config,
    isUploading: false,

    addFiles: (files: FileList | File[]) => {
      const { items, config } = get()
      const newItems: FileUploadQueueItem[] = []

      Array.from(files).forEach((file) => {
        if (
          items.some((i) => i.file.name === file.name && i.file.size === file.size) ||
          newItems.some((i) => i.file.name === file.name && i.file.size === file.size)
        ) {
          return
        }

        let inferredCategory: StorageCategory = StorageCategory.OTHER
        if (file.type.startsWith('image/')) {
          inferredCategory = StorageCategory.IMAGE
        } else if (file.type.startsWith('video/')) {
          inferredCategory = StorageCategory.VIDEO
        } else if (file.type.startsWith('audio/')) {
          inferredCategory = StorageCategory.AUDIO
        } else if (file.type.includes('pdf') || file.type.includes('document')) {
          inferredCategory = StorageCategory.DOCUMENT
        }

        let status: UploadQueueItemStatus = UploadQueueItemStatus.IDLE
        let error: AppError | null = null

        const currentTotal = items.length + newItems.length + 1
        if (config.maxFiles && !storageUploadValidator.isBatchSizeValid(config.maxFiles, currentTotal)) {
          status = UploadQueueItemStatus.FAILED
          error = StorageError.maxBatchUploadCountExceeded(config.maxFiles)
        } else if (!storageUploadValidator.isFileSizeValid(config.maxFileSizeBytes, file.size)) {
          status = UploadQueueItemStatus.FAILED
          error = StorageError.fileSizeExceedsLimit(config.maxFileSizeBytes ?? undefined, file.size, inferredCategory, file.name)
        } else if (config.acceptedFileTypes && config.acceptedFileTypes.length > 0 && !storageUploadValidator.isFileTypeAccepted(config.acceptedFileTypes, file.name, file.type)) {
          status = UploadQueueItemStatus.FAILED
          error = StorageError.unsupportedMimeType(file.type, inferredCategory, file.name)
        }

        newItems.push({
          id: toUploadQueueItemIdOrThrow(generateUuid()),
          file,
          fileName: file.name,
          fileSizeBytes: file.size,
          mimeType: file.type || null,
          category: config.category ?? inferredCategory,
          visibility: config.visibility ?? StorageFileVisibility.PRIVATE,
          progressPercent: 0,
          status,
          error,
          uploadedFile: null
        })
      })

      if (newItems.length > 0) {
        set((state) => ({ items: [...state.items, ...newItems] }))
        if (config.autoSubmit) {
          get().upload()
        }
      }
    },

    removeItem: (id: UploadQueueItemId) => {
      set((state) => ({
        items: state.items.filter(
          (i) => !(i.id === id && i.status !== UploadQueueItemStatus.UPLOADING)
        )
      }))
    },

    setItemCategory: (id: UploadQueueItemId, category: StorageCategory) => {
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, category } : i))
      }))
    },

    setItemVisibility: (id: UploadQueueItemId, visibility: StorageFileVisibility) => {
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, visibility } : i))
      }))
    },

    upload: async () => {
      const { items, config, isUploading } = get()
      if (isUploading) {
        return
      }

      const pendingItems = items.filter(
        (i) => i.status === UploadQueueItemStatus.IDLE || i.status === UploadQueueItemStatus.FAILED
      )
      if (pendingItems.length === 0) {
        return
      }

      set({ isUploading: true })

      const queue = [...pendingItems]

      const worker = async () => {
        while (queue.length > 0) {
          const item = queue.shift()
          if (!item) {
            continue
          }

          set((state) => ({
            items: state.items.map((i) =>
              i.id === item.id
                ? { ...i, status: UploadQueueItemStatus.UPLOADING, error: null, progressPercent: 0 }
                : i
            )
          }))

          const uploadResult = await deps.uploadFileUseCase.execute({
            file: item.file,
            category: item.category,
            visibility: item.visibility ?? StorageFileVisibility.PRIVATE,
            targetScope: config.targetScope ?? '',
            onProgress: (percent) => {
              set((state) => ({
                items: state.items.map((i) =>
                  i.id === item.id ? { ...i, progressPercent: percent } : i
                )
              }))
            }
          })

          if (isSuccess(uploadResult)) {
            set((state) => ({
              items: state.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      status: UploadQueueItemStatus.COMPLETED,
                      progressPercent: 100,
                      uploadedFile: uploadResult.data
                    }
                  : i
              )
            }))
          } else {
            set((state) => ({
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, status: UploadQueueItemStatus.FAILED, error: uploadResult.error }
                  : i
              )
            }))
          }
        }
      }

      const workers = Array(Math.min(MAX_CONCURRENT_UPLOADS, queue.length)).fill(null).map(() => worker())
      await Promise.all(workers)

      set({ isUploading: false })

      const finalItems = get().items
      if (finalItems.every((i) => i.status === UploadQueueItemStatus.COMPLETED)) {
        const completedFiles = finalItems.map((i) => i.uploadedFile).filter((f): f is StorageFilePrivate => f !== null)
        deps.onUploaded(completedFiles)
      }
    },

    onBackClick: () => {
      deps.onBack?.()
    }
  }))
}
