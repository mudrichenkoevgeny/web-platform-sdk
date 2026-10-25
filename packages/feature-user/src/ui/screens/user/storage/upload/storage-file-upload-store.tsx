import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import type { StorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UploadFileUseCase } from '@/usecase/storage/upload-file-use-case'

/**
 * Dependencies required to construct and run {@link StorageFileUploadStore}.
 */
export interface StorageFileUploadStoreDependencies {
  /** Use case execution contract for uploading a file. */
  uploadFileUseCase: Pick<UploadFileUseCase, 'execute'>
  /** Callback invoked when a file is successfully uploaded. */
  onUploaded: (file: StorageFilePrivate) => void
  /** Callback invoked when user triggers back navigation. */
  onBack: () => void
}

/**
 * Internal state and actions contract for {@link StorageFileUploadStore}.
 */
export interface StorageFileUploadStoreState {
  /** Selected file to upload or null if none selected. */
  file: File | null
  /** File category string (e.g. image, video, audio, document, other). */
  category: string
  /** File visibility setting (e.g. public, private). */
  visibility: string
  /** Target scope for file storage. */
  targetScope: string
  /** Upload progress percentage from 0 to 100. */
  progressPercent: number
  /** Whether the upload operation is currently in progress. */
  isUploading: boolean
  /** Error instance if file upload failed. */
  error: AppError | null
  /** Updates the currently selected file and infers its category. */
  setFile: (file: File | null) => void
  /** Updates the selected category. */
  setCategory: (category: string) => void
  /** Updates the selected file visibility. */
  setVisibility: (visibility: string) => void
  /** Updates the target storage scope. */
  setTargetScope: (scope: string) => void
  /** Triggers file upload execution. */
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
 * @returns Initialized Zustand store instance.
 */
export const createStorageFileUploadStore = (
  deps: StorageFileUploadStoreDependencies
) => {
  return createStore<StorageFileUploadStoreState>()((set, get) => ({
    file: null,
    category: 'other',
    visibility: 'public',
    targetScope: 'general',
    progressPercent: 0,
    isUploading: false,
    error: null,

    setFile: (file: File | null) => {
      let inferredCategory = 'other'
      if (file) {
        if (file.type.startsWith('image/')) inferredCategory = 'image'
        else if (file.type.startsWith('video/')) inferredCategory = 'video'
        else if (file.type.startsWith('audio/')) inferredCategory = 'audio'
        else if (file.type.includes('pdf') || file.type.includes('document')) inferredCategory = 'document'
      }
      set({ file, category: inferredCategory, error: null, progressPercent: 0 })
    },

    setCategory: (category: string) => set({ category }),
    setVisibility: (visibility: string) => set({ visibility }),
    setTargetScope: (targetScope: string) => set({ targetScope }),

    upload: async () => {
      const { file, category, visibility, targetScope, isUploading } = get()
      if (!file || isUploading) return

      set({ isUploading: true, error: null, progressPercent: 0 })

      const uploadResult = await deps.uploadFileUseCase.execute({
        file,
        category,
        visibility,
        targetScope,
        onProgress: (percent) => {
          set({ progressPercent: percent })
        }
      })

      if (isSuccess(uploadResult)) {
        set({ isUploading: false, progressPercent: 100 })
        deps.onUploaded(uploadResult.data)
      } else {
        set({ isUploading: false, error: uploadResult.error })
      }
    },

    onBackClick: () => {
      deps.onBack()
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
  /** React child elements wrapped by provider context. */
  children: React.ReactNode
}

/**
 * React Context Provider creating and binding a {@link StorageFileUploadStore} instance.
 *
 * @param props - Component props including dependencies and children.
 * @returns Context provider element.
 */
export const StorageFileUploadProvider: React.FC<StorageFileUploadProviderProps> = ({
  dependencies,
  children
}) => {
  const [store] = useState(() => createStorageFileUploadStore(dependencies))

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
