import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import { StorageCategory, StorageFileVisibility, UploadQueueItemStatus, storageUploadValidator } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageFilePrivate, StorageFileUploadUiConfig } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageError } from '@/error/model/storage-error'

export { UploadQueueItemStatus }

/** Represents a single file in the client upload queue. */
export interface FileUploadQueueItem {
  localId: string
  file: File
  category: StorageCategory
  visibility: StorageFileVisibility
  progressPercent: number
  status: UploadQueueItemStatus
  error: AppError | null
  uploadedFile: StorageFilePrivate | null
}

/** Execution contract for uploading a file required by storage upload store. */
export interface StorageFileUploadUseCaseContract {
  execute(params: {
    file: File
    category: StorageCategory
    visibility: StorageFileVisibility
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

const MAX_CONCURRENT_UPLOADS = 3

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
  removeItem: (localId: string) => void
  /** Updates the selected category for a specific queue item. */
  setItemCategory: (localId: string, category: StorageCategory) => void
  /** Updates the selected visibility for a specific queue item. */
  setItemVisibility: (localId: string, visibility: StorageFileVisibility) => void
  /** Triggers concurrent batch file upload execution. */
  upload: () => Promise<void>
  /** Triggers navigation back to the previous screen. */
  onBackClick: () => void
}

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
          localId: crypto.randomUUID(),
          file,
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

    removeItem: (localId: string) => {
      set((state) => ({
        items: state.items.filter(
          (i) => !(i.localId === localId && i.status !== UploadQueueItemStatus.UPLOADING)
        )
      }))
    },

    setItemCategory: (localId: string, category: StorageCategory) => {
      set((state) => ({
        items: state.items.map((i) => (i.localId === localId ? { ...i, category } : i))
      }))
    },

    setItemVisibility: (localId: string, visibility: StorageFileVisibility) => {
      set((state) => ({
        items: state.items.map((i) => (i.localId === localId ? { ...i, visibility } : i))
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
              i.localId === item.localId
                ? { ...i, status: UploadQueueItemStatus.UPLOADING, error: null, progressPercent: 0 }
                : i
            )
          }))

          const uploadResult = await deps.uploadFileUseCase.execute({
            file: item.file,
            category: item.category,
            visibility: item.visibility,
            targetScope: config.targetScope ?? '',
            onProgress: (percent) => {
              set((state) => ({
                items: state.items.map((i) =>
                  i.localId === item.localId ? { ...i, progressPercent: percent } : i
                )
              }))
            }
          })

          if (isSuccess(uploadResult)) {
            set((state) => ({
              items: state.items.map((i) =>
                i.localId === item.localId
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
                i.localId === item.localId
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

const StorageFileUploadContext = createContext<StorageFileUploadStore | null>(null)

/**
 * Props for {@link StorageFileUploadProvider}.
 */
export interface StorageFileUploadProviderProps {
  /** Dependency bindings for the file upload store. */
  dependencies: StorageFileUploadStoreDependencies
  /** Configuration constraints for the upload queue. */
  config: StorageFileUploadUiConfig
  /** React child elements wrapped by provider context. */
  children: React.ReactNode
}

/**
 * React Context Provider creating and binding a {@link StorageFileUploadStore} instance.
 *
 * @param props - Component props including dependencies, config, and children.
 * @returns Context provider element.
 */
export const StorageFileUploadProvider: React.FC<StorageFileUploadProviderProps> = ({
  dependencies,
  config,
  children
}) => {
  const [store] = useState(() => createStorageFileUploadStore(dependencies, config))

  return (
    <StorageFileUploadContext.Provider value={store}>
      {children}
    </StorageFileUploadContext.Provider>
  )
}

/**
 * Custom React hook to select state slices from {@link StorageFileUploadStore}.
 *
 * @template T - Selected state slice return type.
 * @param selector - Selector function extracting values from store state.
 * @returns Selected slice of store state.
 * @throws {Error} If called outside of {@link StorageFileUploadProvider}.
 */
export const useStorageFileUploadStore = <T,>(
  selector: (state: StorageFileUploadStoreState) => T
): T => {
  const store = useContext(StorageFileUploadContext)
  if (!store) {
    throw new Error('useStorageFileUploadStore must be used within StorageFileUploadProvider')
  }
  return useStore(store, selector)
}
