import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { ListingDefaultValues, SelfStorageFileListParamsParser } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageFileSummary } from '@mudrichenkoevgeny/shared-foundation'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GetFilesUseCase } from '@/usecase/storage/get-files-use-case'
import type { DeleteFileUseCase } from '@/usecase/storage/delete-file-use-case'

/**
 * Status enumeration for {@link SelfStorageFileListScreenState}.
 */
export enum SelfStorageFileListStatus {
  /** Screen is currently loading initial storage file list data. */
  LOADING = 'loading',
  /** Initial loading resulted in an error. */
  ERROR = 'error',
  /** Storage file list content is loaded and available. */
  CONTENT = 'content'
}

/**
 * Discriminated union representing active UI state for {@link SelfStorageFileListScreen}.
 */
export type SelfStorageFileListScreenState =
  | {
      /** Loading state while initial file list is being fetched. */
      status: SelfStorageFileListStatus.LOADING
    }
  | {
      /** Error state when loading initial file list failed. */
      status: SelfStorageFileListStatus.ERROR
      /** AppError instance describing the failure. */
      error: AppError
    }
  | {
      /** Content state holding loaded storage file items and pagination. */
      status: SelfStorageFileListStatus.CONTENT
      /** List of storage file summaries for the current user. */
      items: StorageFileSummary[]
      /** Pagination state tracking paged storage file summaries. */
      paging: PaginationState<StorageFileSummary>
      /** Whether an inline action (like deletion) is currently loading. */
      actionLoading: boolean
      /** Error instance if an inline action failed. */
      actionError: AppError | null
    }

/**
 * Dependencies required to construct and run {@link SelfStorageFileListStore}.
 */
export interface SelfStorageFileListStoreDependencies {
  /** Use case execution contract for retrieving storage files. */
  getFilesUseCase: Pick<GetFilesUseCase, 'execute'>
  /** Optional use case execution contract for deleting a storage file. */
  deleteFileUseCase?: Pick<DeleteFileUseCase, 'execute'>
  /** Navigation callback to open upload file screen. */
  onNavigateToUpload: () => void
  /** Navigation callback to open file detail screen. */
  onNavigateToFileDetail: (fileId: string) => void
  /** Navigation callback invoked when user triggers back navigation. */
  onBack: () => void
}

/**
 * Internal state and actions contract for {@link SelfStorageFileListStore}.
 */
export interface SelfStorageFileListStoreState {
  /** Injected store dependencies. */
  dependencies: SelfStorageFileListStoreDependencies
  /** Current screen UI state. */
  screenState: SelfStorageFileListScreenState
  /** Asynchronously loads initial storage file list. */
  loadFiles: () => Promise<void>
  /** Refreshes storage file list data. */
  onRefresh: () => Promise<void>
  /** Triggers navigation to detail screen for selected file. */
  onFileClick: (fileId: string) => void
  /** Deletes file by ID and refreshes list. */
  onDeleteFileClick: (fileId: string) => Promise<void>
  /** Fetches and appends next page of storage files. */
  onLoadNextPage: () => Promise<void>
  /** Triggers navigation to file upload screen. */
  onUploadClick: () => void
  /** Triggers back navigation. */
  onBackClick: () => void
}

/**
 * Store instance type returned by {@link createSelfStorageFileListStore}.
 */
export type SelfStorageFileListStore = ReturnType<typeof createSelfStorageFileListStore>

/**
 * Factory function creating a Zustand store instance for managing personal file list UI state.
 *
 * @param deps - Personal storage file list store dependencies.
 * @param initialState - Optional initial screen state override.
 * @returns Initialized Zustand store instance.
 */
export const createSelfStorageFileListStore = (
  deps: SelfStorageFileListStoreDependencies,
  initialState?: SelfStorageFileListScreenState
) => {
  const DEFAULT_PAGE_SIZE = ListingDefaultValues.PAGE_SIZE
  let isFetching = false

  const loadFilesInternal = async (
    set: StoreApi<SelfStorageFileListStoreState>['setState'],
    get: StoreApi<SelfStorageFileListStoreState>['getState'],
    isRefresh = false
  ) => {
    if (isFetching) {
      return
    }
    const current = get().screenState
    if (!isRefresh && current.status === SelfStorageFileListStatus.CONTENT) {
      return
    }
    isFetching = true

    try {
      const activeDeps = get().dependencies
      const filesResult = await activeDeps.getFilesUseCase.execute(
        SelfStorageFileListParamsParser.parse({
          pageNumber: 1,
          pageSize: DEFAULT_PAGE_SIZE
        })
      )

      if (isSuccess(filesResult)) {
        const currentPaging = current.status === SelfStorageFileListStatus.CONTENT ? current.paging : createInitialPaginationState<StorageFileSummary>()
        const nextPaging = appendResultToPaginationState(currentPaging, filesResult.data)

        set({
          screenState: {
            status: SelfStorageFileListStatus.CONTENT,
            items: nextPaging.items,
            paging: nextPaging,
            actionLoading: false,
            actionError: null
          }
        })
      } else {
        set({
          screenState: {
            status: SelfStorageFileListStatus.ERROR,
            error: filesResult.error
          }
        })
      }
    } finally {
      isFetching = false
    }
  }

  return createStore<SelfStorageFileListStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: SelfStorageFileListStatus.LOADING },

    loadFiles: async () => {
      if (get().screenState.status !== SelfStorageFileListStatus.CONTENT) {
        set({ screenState: { status: SelfStorageFileListStatus.LOADING } })
      }
      await loadFilesInternal(set, get, false)
    },

    onRefresh: async () => {
      const current = get().screenState
      if (current.status === SelfStorageFileListStatus.CONTENT) {
        set({
          screenState: {
            ...current,
            actionLoading: true,
            actionError: null
          }
        })
      } else {
        set({ screenState: { status: SelfStorageFileListStatus.LOADING } })
      }

      await loadFilesInternal(set, get, true)
    },

    onFileClick: (fileId: string) => {
      get().dependencies.onNavigateToFileDetail(fileId)
    },

    onDeleteFileClick: async (fileId: string) => {
      const current = get().screenState
      if (current.status !== SelfStorageFileListStatus.CONTENT) {
        return
      }

      const activeDeps = get().dependencies
      if (!activeDeps.deleteFileUseCase) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const deleteResult = await activeDeps.deleteFileUseCase.execute(fileId)

      if (isSuccess(deleteResult)) {
        await get().onRefresh()
      } else {
        set({
          screenState: {
            ...current,
            actionLoading: false,
            actionError: deleteResult.error
          }
        })
      }
    },

    onLoadNextPage: async () => {
      const current = get().screenState
      if (current.status !== SelfStorageFileListStatus.CONTENT || !canLoadMorePages(current.paging)) {
        return
      }

      const nextPage = getNextPageNumber(current.paging)

      set({
        screenState: {
          ...current,
          paging: createNextPageLoadingPaginationState(current.paging)
        }
      })

      const filesResult = await get().dependencies.getFilesUseCase.execute(
        SelfStorageFileListParamsParser.parse({
          pageNumber: nextPage,
          pageSize: DEFAULT_PAGE_SIZE
        })
      )

      if (isSuccess(filesResult)) {
        const nextPaging = appendResultToPaginationState(current.paging, filesResult.data)
        set({
          screenState: {
            ...current,
            items: nextPaging.items,
            paging: nextPaging
          }
        })
      } else {
        set({
          screenState: {
            ...current,
            paging: {
              ...current.paging,
              isNextPageLoading: false
            }
          }
        })
      }
    },

    onUploadClick: () => {
      get().dependencies.onNavigateToUpload()
    },

    onBackClick: () => {
      get().dependencies.onBack()
    }
  }))
}

const SelfStorageFileListContext = createContext<SelfStorageFileListStore | null>(null)

/**
 * Props for {@link SelfStorageFileListProvider}.
 */
export interface SelfStorageFileListProviderProps {
  /** Dependency bindings for personal file list store. */
  dependencies: SelfStorageFileListStoreDependencies
  /** Optional initial screen state. */
  initialState?: SelfStorageFileListScreenState
  /** React child elements wrapped by provider context. */
  children: React.ReactNode
}

/**
 * React Context Provider creating and binding a {@link SelfStorageFileListStore} instance.
 *
 * @param props - Component props including dependencies, initial state, and children.
 * @returns Context provider element.
 */
export const SelfStorageFileListProvider: React.FC<SelfStorageFileListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createSelfStorageFileListStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <SelfStorageFileListContext.Provider value={store}>
      {children}
    </SelfStorageFileListContext.Provider>
  )
}

/**
 * Custom React hook to select state slices from {@link SelfStorageFileListStore}.
 *
 * @template T - Selected state slice return type.
 * @param selector - Selector function extracting values from store state.
 * @returns Selected slice of store state.
 * @throws {Error} If called outside of {@link SelfStorageFileListProvider}.
 */
export const useSelfStorageFileListStore = <T,>(
  selector: (state: SelfStorageFileListStoreState) => T
): T => {
  const store = useContext(SelfStorageFileListContext)
  if (!store) {
    throw new Error('useSelfStorageFileListStore must be used within SelfStorageFileListProvider')
  }
  return useStore(store, selector)
}
