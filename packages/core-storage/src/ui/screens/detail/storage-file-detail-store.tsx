import React, { createContext, useContext, useState, useEffect } from 'react'
import { createStore, useStore } from 'zustand'
import { toUserIdOrNull } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/** Contract for retrieving storage file details. */
export interface StorageFileDetailGetUseCaseContract {
  execute(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>>
}

/** Contract for deleting a storage file. */
export interface StorageFileDetailDeleteUseCaseContract {
  execute(fileId: string): Promise<AppResult<void, AppError>>
}

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
 * Discriminated union representing active UI state for StorageFileDetailScreen.
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
      /** Whether delete confirmation dialog is visible. */
      showDeleteConfirmation: boolean
    }

/**
 * External dependencies required by {@link StorageFileDetailStore}.
 */
export interface StorageFileDetailStoreDependencies {
  /** Unique identifier of the target storage file. */
  fileId: string
  /** Optional currently authenticated user or owner ID. */
  currentUserId?: string | null
  /** Use case execution contract for retrieving storage file details. */
  getFileDetailUseCase: StorageFileDetailGetUseCaseContract
  /** Optional use case execution contract for deleting a storage file. */
  deleteFileUseCase?: StorageFileDetailDeleteUseCaseContract
  /** Optional callback to navigate to user detail screen. */
  onNavigateToUserDetail?: (userId: string) => void
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
  /** Opens delete confirmation dialog. */
  onDeleteClick: () => void
  /** Dismisses delete confirmation dialog. */
  onDismissDeleteDialog: () => void
  /** Confirms and executes deletion of the storage file via `deleteFileUseCase`. */
  onConfirmDelete: () => Promise<void>
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
  let isFetching = false

  return createStore<StorageFileDetailStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: StorageFileDetailStatus.LOADING },

    initScreen: async () => {
      const current = get().screenState
      if (isFetching || current.status === StorageFileDetailStatus.CONTENT) {
        return
      }
      isFetching = true
      set({ screenState: { status: StorageFileDetailStatus.LOADING } })

      try {
        const activeDeps = get().dependencies
        const fileDetailResult = await activeDeps.getFileDetailUseCase.execute(activeDeps.fileId)

        if (isSuccess(fileDetailResult)) {
          set({
            screenState: {
              status: StorageFileDetailStatus.CONTENT,
              file: fileDetailResult.data,
              copiedUrl: false,
              isDeleting: false,
              deleteError: null,
              showDeleteConfirmation: false
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
      } finally {
        isFetching = false
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

    onDeleteClick: () => {
      const current = get().screenState
      if (current.status !== StorageFileDetailStatus.CONTENT || current.isDeleting) {
        return
      }
      set({ screenState: { ...current, showDeleteConfirmation: true } })
    },

    onDismissDeleteDialog: () => {
      const current = get().screenState
      if (current.status !== StorageFileDetailStatus.CONTENT) {
        return
      }
      set({ screenState: { ...current, showDeleteConfirmation: false } })
    },

    onConfirmDelete: async () => {
      const current = get().screenState
      if (current.status !== StorageFileDetailStatus.CONTENT || current.isDeleting) {
        return
      }

      const activeDeps = get().dependencies
      if (!activeDeps.deleteFileUseCase) {
        return
      }

      set({ screenState: { ...current, showDeleteConfirmation: false, isDeleting: true, deleteError: null } })
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

      if (activeDeps.onNavigateToUserDetail) {
        activeDeps.onNavigateToUserDetail(ownerUserId)
      } else if (activeDeps.onNavigateToUserMain) {
        activeDeps.onNavigateToUserMain()
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
