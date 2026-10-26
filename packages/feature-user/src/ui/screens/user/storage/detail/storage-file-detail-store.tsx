import React, { createContext, useContext, useState, useEffect } from 'react'
import { createStore, useStore } from 'zustand'
import { toUserIdOrNull } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageFilePrivate, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GetFileDetailUseCase } from '@/usecase/storage/get-file-detail-use-case'
import type { DeleteFileUseCase } from '@/usecase/storage/delete-file-use-case'

/**
 * Status enumeration for {@link StorageFileDetailScreenState}.
 */
export enum StorageFileDetailStatus {
  /** Screen is currently fetching file detail data. */
  LOADING = 'loading',
  /** Fetching file detail data resulted in an error. */
  ERROR = 'error',
  /** File detail data loaded successfully and content is visible. */
  CONTENT = 'content'
}

/**
 * Discriminated union representing active UI state for {@link StorageFileDetailScreen}.
 */
export type StorageFileDetailScreenState =
  | {
      /** Loading state while file details are being loaded. */
      status: StorageFileDetailStatus.LOADING
    }
  | {
      /** Error state when loading file details failed. */
      status: StorageFileDetailStatus.ERROR
      /** AppError instance describing the failure. */
      error: AppError
    }
  | {
      /** Content state displaying the loaded storage file. */
      status: StorageFileDetailStatus.CONTENT
      /** Storage file details domain object. */
      file: StorageFilePrivate
      /** Whether the file URL was copied to the clipboard. */
      copiedUrl: boolean
      /** Whether file deletion operation is currently in progress. */
      isDeleting: boolean
      /** Error instance if deleting the file failed. */
      deleteError: AppError | null
    }

/**
 * External dependencies required by {@link StorageFileDetailStore}.
 */
export interface StorageFileDetailStoreDependencies {
  /** Unique identifier of the target storage file. */
  fileId: string
  /** Optional currently authenticated user ID. */
  currentUserId?: UserId | null
  /** Use case execution contract for retrieving storage file details. */
  getFileDetailUseCase: Pick<GetFileDetailUseCase, 'execute'>
  /** Optional use case execution contract for deleting a storage file. */
  deleteFileUseCase?: Pick<DeleteFileUseCase, 'execute'>
  /** Optional callback to navigate to user detail screen. */
  onNavigateToUserDetail?: (userId: UserId) => void
  /** Optional callback to navigate to current user main screen. */
  onNavigateToUserMain?: () => void
  /** Callback invoked when user triggers back navigation. */
  onBack: () => void
}

/**
 * Internal state and actions contract for {@link StorageFileDetailStore}.
 */
export interface StorageFileDetailStoreState {
  /** Injected store dependencies. */
  dependencies: StorageFileDetailStoreDependencies
  /** Current screen UI state. */
  screenState: StorageFileDetailScreenState
  /** Asynchronously fetches file details and updates state. */
  initScreen: () => Promise<void>
  /** Copies file URL to clipboard and temporarily updates copy status. */
  onCopyUrlClick: () => void
  /** Triggers deletion of the storage file via `deleteFileUseCase`. */
  onDeleteClick: () => Promise<void>
  /** Handles click on file owner user ID. */
  onUserClick: () => void
  /** Triggers navigation back to the previous screen. */
  onBackClick: () => void
}

/**
 * Store instance type returned by {@link createStorageFileDetailStore}.
 */
export type StorageFileDetailStore = ReturnType<typeof createStorageFileDetailStore>

/**
 * Factory function creating a Zustand store instance for managing file detail UI state.
 *
 * @param deps - Storage file detail store dependencies.
 * @param initialState - Optional initial screen state override.
 * @returns Initialized Zustand store instance.
 */
export const createStorageFileDetailStore = (
  deps: StorageFileDetailStoreDependencies,
  initialState?: StorageFileDetailScreenState
) => {
  return createStore<StorageFileDetailStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: StorageFileDetailStatus.LOADING },

    initScreen: async () => {
      set({ screenState: { status: StorageFileDetailStatus.LOADING } })
      const fileDetailResult = await deps.getFileDetailUseCase.execute(deps.fileId)

      if (isSuccess(fileDetailResult)) {
        set({
          screenState: {
            status: StorageFileDetailStatus.CONTENT,
            file: fileDetailResult.data,
            copiedUrl: false,
            isDeleting: false,
            deleteError: null
          }
        })
      } else {
        set({
          screenState: {
            status: StorageFileDetailStatus.ERROR,
            error: fileDetailResult.error
          }
        })
      }
    },

    onCopyUrlClick: () => {
      const current = get().screenState
      if (current.status === StorageFileDetailStatus.CONTENT) {
        navigator.clipboard.writeText(current.file.fileUrl)
        set({
          screenState: {
            ...current,
            copiedUrl: true
          }
        })
        setTimeout(() => {
          const latest = get().screenState
          if (latest.status === StorageFileDetailStatus.CONTENT) {
            set({ screenState: { ...latest, copiedUrl: false } })
          }
        }, 2000)
      }
    },

    onDeleteClick: async () => {
      const current = get().screenState
      if (current.status !== StorageFileDetailStatus.CONTENT || current.isDeleting) {
        return
      }

      const activeDeps = get().dependencies
      if (!activeDeps.deleteFileUseCase) {
        return
      }

      set({ screenState: { ...current, isDeleting: true, deleteError: null } })
      const deleteResult = await activeDeps.deleteFileUseCase.execute(activeDeps.fileId)

      if (isSuccess(deleteResult)) {
        activeDeps.onBack()
      } else {
        const latest = get().screenState
        if (latest.status === StorageFileDetailStatus.CONTENT) {
          set({ screenState: { ...latest, isDeleting: false, deleteError: deleteResult.error } })
        }
      }
    },

    onUserClick: () => {
      const current = get().screenState
      if (current.status !== StorageFileDetailStatus.CONTENT || !current.file.ownerUserId) {
        return
      }
      const activeDeps = get().dependencies
      const ownerUserId = toUserIdOrNull(current.file.ownerUserId)
      if (!ownerUserId) {
        return
      }

      if (activeDeps.currentUserId != null && ownerUserId === activeDeps.currentUserId) {
        activeDeps.onNavigateToUserMain?.()
      } else if (activeDeps.onNavigateToUserDetail) {
        activeDeps.onNavigateToUserDetail(ownerUserId)
      } else {
        activeDeps.onNavigateToUserMain?.()
      }
    },

    onBackClick: () => {
      get().dependencies.onBack()
    }
  }))
}

const StorageFileDetailContext = createContext<StorageFileDetailStore | null>(null)

/**
 * Props for {@link StorageFileDetailProvider}.
 */
export interface StorageFileDetailProviderProps {
  /** Dependency bindings for the file detail store. */
  dependencies: StorageFileDetailStoreDependencies
  /** Optional initial screen state. */
  initialState?: StorageFileDetailScreenState
  /** React child elements wrapped by provider context. */
  children: React.ReactNode
}

/**
 * React Context Provider creating and binding a {@link StorageFileDetailStore} instance.
 *
 * @param props - Component props including dependencies, initial state, and children.
 * @returns Context provider element.
 */
export const StorageFileDetailProvider: React.FC<StorageFileDetailProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createStorageFileDetailStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <StorageFileDetailContext.Provider value={store}>
      {children}
    </StorageFileDetailContext.Provider>
  )
}

/**
 * Custom React hook to select state slices from {@link StorageFileDetailStore}.
 *
 * @template T - Selected state slice return type.
 * @param selector - Selector function extracting values from store state.
 * @returns Selected slice of store state.
 * @throws {Error} If called outside of {@link StorageFileDetailProvider}.
 */
export const useStorageFileDetailStore = <T,>(
  selector: (state: StorageFileDetailStoreState) => T
): T => {
  const store = useContext(StorageFileDetailContext)
  if (!store) {
    throw new Error('useStorageFileDetailStore must be used within StorageFileDetailProvider')
  }
  return useStore(store, selector)
}
