import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { ManagementStorageFileListParamsParser } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageFileSummary, ManagementStorageFileListParams } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGetFilesUseCase } from '@/usecase/storage/management-get-files-use-case'
import type { ManagementDeleteFileUseCase } from '@/usecase/storage/management-delete-file-use-case'
import type { GlobalStorageFileListSearchParams } from './global-storage-file-list-search-schema'

function toRecord(val: unknown): Record<string, string | number | boolean | null | undefined> {
  if (typeof val === 'object' && val !== null) {
    return { ...val } as Record<string, string | number | boolean | null | undefined>
  }
  return {}
}

/**
 * Status enumeration for {@link GlobalStorageFileListScreenState}.
 */
export enum GlobalStorageFileListStatus {
  /** List screen is currently loading initial data. */
  LOADING = 'loading',
  /** Initial loading resulted in an error. */
  ERROR = 'error',
  /** List content is loaded and available. */
  CONTENT = 'content'
}

/**
 * Discriminated union representing active UI state for {@link GlobalStorageFileListScreen}.
 */
export type GlobalStorageFileListScreenState =
  | {
      /** Loading state while initial file list is being fetched. */
      status: GlobalStorageFileListStatus.LOADING
    }
  | {
      /** Error state when loading initial file list failed. */
      status: GlobalStorageFileListStatus.ERROR
      /** AppError instance describing the failure. */
      error: AppError
    }
  | {
      /** Content state holding paged file items. */
      status: GlobalStorageFileListStatus.CONTENT
      /** Pagination state tracking storage file summaries. */
      paging: PaginationState<StorageFileSummary>
      /** Whether the filter panel is currently expanded. */
      isFilterPanelExpanded: boolean
      /** Whether an inline action (like deletion) is loading. */
      actionLoading: boolean
      /** Error instance if an inline action failed. */
      actionError: AppError | null
    }

/**
 * Dependencies required to construct and run {@link GlobalStorageFileListStore}.
 */
export interface GlobalStorageFileListStoreDependencies {
  /** Management use case execution contract for retrieving storage files. */
  managementGetFilesUseCase: Pick<ManagementGetFilesUseCase, 'execute'>
  /** Optional management use case execution contract for deleting a storage file. */
  managementDeleteFileUseCase?: Pick<ManagementDeleteFileUseCase, 'execute'>
  /** Navigation callback to open upload file screen. */
  onNavigateToUpload: () => void
  /** Navigation callback to open file detail screen. */
  onNavigateToFileDetail: (fileId: string) => void
  /** Navigation callback invoked when user triggers back navigation. */
  onBack: () => void
  /** Optional initial search/filter parameters. */
  searchParams?: ManagementStorageFileListParams | GlobalStorageFileListSearchParams
  /** Optional callback invoked when search parameters are updated. */
  onSearchParamsChanged?: (params: ManagementStorageFileListParams | GlobalStorageFileListSearchParams) => void
}

/**
 * Internal state and actions contract for {@link GlobalStorageFileListStore}.
 */
export interface GlobalStorageFileListStoreState {
  /** Injected store dependencies. */
  dependencies: GlobalStorageFileListStoreDependencies
  /** Current screen UI state. */
  screenState: GlobalStorageFileListScreenState
  /** Initializes screen data using optional search parameters. */
  initScreen: (searchParams?: ManagementStorageFileListParams | GlobalStorageFileListSearchParams) => Promise<void>
  /** Re-initializes pagination with updated search parameters. */
  onSearchParamsUpdated: (searchParams?: ManagementStorageFileListParams | GlobalStorageFileListSearchParams) => Promise<void>
  /** Fetches and appends the next page of storage files. */
  onLoadNextPage: () => Promise<void>
  /** Refreshes the first page of storage files. */
  onRefresh: () => Promise<void>
  /** Triggers navigation to upload screen. */
  onUploadClick: () => void
  /** Triggers navigation to detail screen for selected file. */
  onFileClick: (fileId: string) => void
  /** Deletes file by ID and refreshes list. */
  onDeleteFileClick: (fileId: string) => Promise<void>
  /** Triggers navigation back. */
  onBackClick: () => void
  /** Toggles filter panel expansion state. */
  onToggleFilterPanel: () => void
}

/**
 * Store instance type returned by {@link createGlobalStorageFileListStore}.
 */
export type GlobalStorageFileListStore = ReturnType<typeof createGlobalStorageFileListStore>

type SetState = StoreApi<GlobalStorageFileListStoreState>['setState']
type GetState = StoreApi<GlobalStorageFileListStoreState>['getState']

/**
 * Factory function creating a Zustand store instance for managing global file list UI state.
 *
 * @param deps - Global storage file list store dependencies.
 * @param initialState - Optional initial screen state override.
 * @returns Initialized Zustand store instance.
 */
export const createGlobalStorageFileListStore = (
  deps: GlobalStorageFileListStoreDependencies,
  initialState?: GlobalStorageFileListScreenState
) => {
  let isFetching = false

  const fetchPage = async (
    set: SetState,
    get: GetState,
    pageNumber: number,
    overrideParams?: ManagementStorageFileListParams | GlobalStorageFileListSearchParams
  ) => {
    if (isFetching) {
      return
    }
    isFetching = true

    try {
      const activeDeps = get().dependencies
      const rawParams = overrideParams ?? activeDeps.searchParams
      const searchRecord = toRecord(rawParams)
      const parsedParams = ManagementStorageFileListParamsParser.parse(searchRecord)
      const effectivePageNumber = pageNumber !== 1 ? pageNumber : (parsedParams.pageNumber ?? pageNumber)

      const filesResult = await activeDeps.managementGetFilesUseCase.execute({
        ...parsedParams,
        pageNumber: effectivePageNumber
      })

      if (isSuccess(filesResult)) {
        const current = get().screenState
        const currentPaging = current.status === GlobalStorageFileListStatus.CONTENT ? current.paging : createInitialPaginationState<StorageFileSummary>()
        const nextPaging = appendResultToPaginationState(currentPaging, filesResult.data)

        if (current.status === GlobalStorageFileListStatus.CONTENT) {
          set({
            screenState: {
              ...current,
              paging: nextPaging
            }
          })
        } else {
          set({
            screenState: {
              status: GlobalStorageFileListStatus.CONTENT,
              paging: nextPaging,
              isFilterPanelExpanded: false,
              actionLoading: false,
              actionError: null
            }
          })
        }
      } else {
        const current = get().screenState
        if (current.status === GlobalStorageFileListStatus.CONTENT) {
          set({
            screenState: {
              ...current,
              actionError: filesResult.error
            }
          })
        } else {
          set({
            screenState: {
              status: GlobalStorageFileListStatus.ERROR,
              error: filesResult.error
            }
          })
        }
      }
    } finally {
      isFetching = false
    }
  }

  return createStore<GlobalStorageFileListStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: GlobalStorageFileListStatus.LOADING },

    initScreen: async (searchParams?: ManagementStorageFileListParams | GlobalStorageFileListSearchParams) => {
      const current = get().screenState
      if (isFetching || current.status === GlobalStorageFileListStatus.CONTENT) {
        return
      }
      set({ screenState: { status: GlobalStorageFileListStatus.LOADING } })
      const searchRecord = toRecord(searchParams)
      const parsedParams = ManagementStorageFileListParamsParser.parse(searchRecord)
      const startPage = parsedParams.pageNumber ?? 1
      await fetchPage(set, get, startPage, searchParams)
    },

    onSearchParamsUpdated: async (searchParams?: ManagementStorageFileListParams | GlobalStorageFileListSearchParams) => {
      set({
        screenState: {
          status: GlobalStorageFileListStatus.CONTENT,
          paging: createInitialPaginationState<StorageFileSummary>(),
          isFilterPanelExpanded: false,
          actionLoading: false,
          actionError: null
        }
      })
      const searchRecord = toRecord(searchParams)
      const parsedParams = ManagementStorageFileListParamsParser.parse(searchRecord)
      const startPage = parsedParams.pageNumber ?? 1
      await fetchPage(set, get, startPage, searchParams)
    },

    onLoadNextPage: async () => {
      const current = get().screenState
      if (current.status !== GlobalStorageFileListStatus.CONTENT || !canLoadMorePages(current.paging)) {
        return
      }

      const nextPaging = createNextPageLoadingPaginationState(current.paging)
      set({ screenState: { ...current, paging: nextPaging } })

      await fetchPage(set, get, getNextPageNumber(current.paging))
    },

    onRefresh: async () => {
      set({ screenState: { status: GlobalStorageFileListStatus.LOADING } })
      await fetchPage(set, get, 1)
    },

    onUploadClick: () => {
      get().dependencies.onNavigateToUpload()
    },

    onFileClick: (fileId: string) => {
      get().dependencies.onNavigateToFileDetail(fileId)
    },

    onDeleteFileClick: async (fileId: string) => {
      const activeDeps = get().dependencies
      if (!activeDeps.managementDeleteFileUseCase) return

      const deleteResult = await activeDeps.managementDeleteFileUseCase.execute(fileId)
      if (isSuccess(deleteResult)) {
        await get().onRefresh()
      }
    },

    onBackClick: () => {
      get().dependencies.onBack()
    },

    onToggleFilterPanel: () => {
      const current = get().screenState
      if (current.status === GlobalStorageFileListStatus.CONTENT) {
        set({
          screenState: {
            ...current,
            isFilterPanelExpanded: !current.isFilterPanelExpanded
          }
        })
      }
    }
  }))
}

const GlobalStorageFileListContext = createContext<GlobalStorageFileListStore | null>(null)

/**
 * Props for {@link GlobalStorageFileListProvider}.
 */
export interface GlobalStorageFileListProviderProps {
  /** Dependency bindings for the global file list store. */
  dependencies: GlobalStorageFileListStoreDependencies
  /** Optional initial screen state. */
  initialState?: GlobalStorageFileListScreenState
  /** React child elements wrapped by provider context. */
  children: React.ReactNode
}

/**
 * React Context Provider creating and binding a {@link GlobalStorageFileListStore} instance.
 *
 * @param props - Component props including dependencies, initial state, and children.
 * @returns Context provider element.
 */
export const GlobalStorageFileListProvider: React.FC<GlobalStorageFileListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createGlobalStorageFileListStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <GlobalStorageFileListContext.Provider value={store}>
      {children}
    </GlobalStorageFileListContext.Provider>
  )
}

/**
 * Custom React hook to select state slices from {@link GlobalStorageFileListStore}.
 *
 * @template T - Selected state slice return type.
 * @param selector - Selector function extracting values from store state.
 * @returns Selected slice of store state.
 * @throws {Error} If called outside of {@link GlobalStorageFileListProvider}.
 */
export const useGlobalStorageFileListStore = <T,>(
  selector: (state: GlobalStorageFileListStoreState) => T
): T => {
  const store = useContext(GlobalStorageFileListContext)
  if (!store) {
    throw new Error('useGlobalStorageFileListStore must be used within GlobalStorageFileListProvider')
  }
  return useStore(store, selector)
}
