import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import type {
  DeleteFilesBatchRequest,
  PagedResult,
  StorageFileSummary
} from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, AppResult, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/**
 * Contract for a usecase that fetches storage files.
 *
 * @template TParams - Query parameters type.
 */
export interface StorageFileListGetFilesUseCase<TParams = Record<string, unknown>> {
  /**
   * Executes storage file fetch operation.
   *
   * @param params - Optional query/filter parameters.
   * @returns AppResult containing paged storage file summaries.
   */
  execute(
    params?: (TParams & { pageNumber?: number; ownerUserId?: string }) | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>>
}

/**
 * Contract for a usecase that deletes a single storage file.
 */
export interface StorageFileListDeleteFileUseCase {
  /**
   * Executes single file deletion operation.
   *
   * @param fileId - Unique identifier of the target file.
   * @returns AppResult containing void on success.
   */
  execute(fileId: string): Promise<AppResult<void, AppError>>
}

/**
 * Contract for a usecase that deletes multiple storage files in a batch operation.
 */
export interface StorageFileListBatchDeleteUseCase {
  /**
   * Executes batch file deletion operation.
   *
   * @param request - Batch deletion payload containing file IDs.
   * @returns AppResult containing void on success.
   */
  execute(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>>
}

/**
 * Safely converts an unknown input value into a record dictionary.
 *
 * @param val - Unknown input value.
 * @returns String-keyed dictionary containing primitive values.
 */
function toRecord(val: unknown): Record<string, string | number | boolean | null | undefined> {
  if (typeof val !== 'object' || val === null) {
    return {}
  }
  const result: Record<string, string | number | boolean | null | undefined> = {}
  for (const [key, value] of Object.entries(val)) {
    if (
      value === null ||
      value === undefined ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      result[key] = value
    }
  }
  return result
}

/**
 * Status enumeration for {@link StorageFileListScreenState}.
 */
export enum StorageFileListStatus {
  /** List screen is currently loading initial data. */
  LOADING = 'loading',
  /** Initial loading resulted in an error. */
  ERROR = 'error',
  /** List content is loaded and available. */
  CONTENT = 'content'
}

/**
 * Discriminated union representing active UI state for {@link StorageFileListScreen}.
 */
export type StorageFileListScreenState =
  | {
      /** Loading state while initial file list is being fetched. */
      status: StorageFileListStatus.LOADING
    }
  | {
      /** Error state when loading initial file list failed. */
      status: StorageFileListStatus.ERROR
      /** AppError instance describing the failure. */
      error: AppError
    }
  | {
      /** Content state holding paged file items. */
      status: StorageFileListStatus.CONTENT
      /** Pagination state tracking storage file summaries. */
      paging: PaginationState<StorageFileSummary>
      /** Record map tracking selected file IDs for batch operations. */
      selectedFileIds: Record<string, boolean>
      /** Whether the filter panel is currently expanded. */
      isFilterPanelExpanded: boolean
      /** Whether an inline action (like deletion) is loading. */
      actionLoading: boolean
      /** Error instance if an inline action failed. */
      actionError: AppError | null
    }

/**
 * Dependencies required to construct and run {@link StorageFileListStore}.
 *
 * @template TParams - Query parameters type.
 * @template TGetUseCase - Fetch usecase execution contract.
 * @template TDeleteUseCase - Single delete usecase execution contract.
 * @template TBatchDeleteUseCase - Batch delete usecase execution contract.
 */
export interface StorageFileListStoreDependencies<
  TParams extends Record<string, unknown> = Record<string, unknown>,
  TGetUseCase extends StorageFileListGetFilesUseCase<TParams> = StorageFileListGetFilesUseCase<TParams>,
  TDeleteUseCase extends StorageFileListDeleteFileUseCase = StorageFileListDeleteFileUseCase,
  TBatchDeleteUseCase extends StorageFileListBatchDeleteUseCase = StorageFileListBatchDeleteUseCase
> {
  /** Optional target user ID for filtering user-specific files in management context. */
  userId?: string | null
  /** Use case execution contract for retrieving storage files. */
  getFilesUseCase: Pick<TGetUseCase, 'execute'>
  /** Optional use case execution contract for deleting a single storage file. */
  deleteFileUseCase?: Pick<TDeleteUseCase, 'execute'>
  /** Optional use case execution contract for batch deleting storage files. */
  deleteFilesBatchUseCase?: Pick<TBatchDeleteUseCase, 'execute'>
  /** Optional navigation callback to open upload file screen. */
  onNavigateToUpload?: () => void
  /** Optional navigation callback to open file detail screen. */
  onNavigateToFileDetail?: (fileId: string) => void
  /** Navigation callback invoked when user triggers back navigation. */
  onBack: () => void
  /** Optional callback invoked when search parameters are updated. */
  onSearchParamsChanged?: (params: TParams) => void
  /** Parser function converting search parameter object to query parameters. */
  parseParams?: (raw: unknown) => TParams
}

/**
 * Internal state and actions contract for {@link StorageFileListStore}.
 *
 * @template TParams - Query parameters type.
 */
export interface StorageFileListStoreState<TParams extends Record<string, unknown> = Record<string, unknown>> {
  /** Injected store dependencies. */
  dependencies: StorageFileListStoreDependencies<TParams>
  /** Current screen UI state. */
  screenState: StorageFileListScreenState
  /** Active search/filter parameters. */
  searchParams?: TParams
  /** Initializes screen data using optional search parameters. */
  initScreen: (searchParams?: TParams) => Promise<void>
  /** Re-initializes pagination with updated search parameters. */
  onSearchParamsUpdated: (searchParams?: TParams) => Promise<void>
  /** Fetches and appends the next page of storage files. */
  onLoadNextPage: () => Promise<void>
  /** Refreshes the first page of storage files. */
  onRefresh: () => Promise<void>
  /** Triggers navigation to upload screen. */
  onUploadClick: () => void
  /** Triggers navigation to detail screen for selected file. */
  onFileClick: (fileId: string) => void
  /** Deletes single file by ID and refreshes list. */
  onDeleteFileClick: (fileId: string) => Promise<void>
  /** Toggles selection status of a single file. */
  toggleSelectFile: (fileId: string) => void
  /** Selects all files in the current page. */
  selectAllFiles: () => void
  /** Clears all selected file IDs. */
  clearFileSelection: () => void
  /** Deletes all currently selected files via batch use case. */
  onDeleteSelectedFilesClick: () => Promise<void>
  /** Triggers navigation back. */
  onBackClick: () => void
  /** Toggles filter panel expansion state. */
  onToggleFilterPanel: () => void
}

/**
 * Store instance type returned by {@link createStorageFileListStore}.
 *
 * @template TParams - Query parameters type.
 */
export type StorageFileListStore<TParams extends Record<string, unknown> = Record<string, unknown>> = ReturnType<
  typeof createStorageFileListStore<TParams>
>

type SetState<TParams extends Record<string, unknown>> = StoreApi<StorageFileListStoreState<TParams>>['setState']
type GetState<TParams extends Record<string, unknown>> = StoreApi<StorageFileListStoreState<TParams>>['getState']

/**
 * Factory function creating a Zustand store instance for managing storage file list UI state.
 *
 * @template TParams - Search/query parameters type.
 * @template TGetUseCase - Fetch usecase type.
 * @template TDeleteUseCase - Single delete usecase type.
 * @template TBatchDeleteUseCase - Batch delete usecase type.
 * @param deps - Storage file list store dependencies.
 * @param initialState - Optional initial screen state override.
 * @returns Initialized Zustand store instance.
 */
export const createStorageFileListStore = <
  TParams extends Record<string, unknown> = Record<string, unknown>,
  TGetUseCase extends StorageFileListGetFilesUseCase<TParams> = StorageFileListGetFilesUseCase<TParams>,
  TDeleteUseCase extends StorageFileListDeleteFileUseCase = StorageFileListDeleteFileUseCase,
  TBatchDeleteUseCase extends StorageFileListBatchDeleteUseCase = StorageFileListBatchDeleteUseCase
>(
  deps: StorageFileListStoreDependencies<TParams, TGetUseCase, TDeleteUseCase, TBatchDeleteUseCase>,
  initialState?: StorageFileListScreenState
) => {
  let isFetching = false

  const fetchPage = async (
    set: SetState<TParams>,
    get: GetState<TParams>,
    pageNumber: number,
    overrideParams?: TParams
  ) => {
    if (isFetching) {
      return
    }
    isFetching = true

    try {
      const activeDeps = get().dependencies
      const rawParams = overrideParams ?? get().searchParams
      let queryParams: TParams | undefined = rawParams

      if (activeDeps.parseParams && rawParams !== undefined) {
        queryParams = activeDeps.parseParams(toRecord(rawParams))
      }

      const requestParams = Object.assign({}, queryParams, {
        pageNumber,
        ...(activeDeps.userId ? { ownerUserId: activeDeps.userId } : {})
      })

      const filesResult = await activeDeps.getFilesUseCase.execute(requestParams)

      if (isSuccess(filesResult)) {
        const current = get().screenState
        const currentPaging =
          current.status === StorageFileListStatus.CONTENT
            ? current.paging
            : createInitialPaginationState<StorageFileSummary>()
        const nextPaging = appendResultToPaginationState(currentPaging, filesResult.data)

        if (current.status === StorageFileListStatus.CONTENT) {
          set({
            screenState: {
              ...current,
              paging: nextPaging,
              actionLoading: false
            }
          })
        } else {
          set({
            screenState: {
              status: StorageFileListStatus.CONTENT,
              paging: nextPaging,
              selectedFileIds: {},
              isFilterPanelExpanded: false,
              actionLoading: false,
              actionError: null
            }
          })
        }
      } else {
        const current = get().screenState
        if (current.status === StorageFileListStatus.CONTENT) {
          set({
            screenState: {
              ...current,
              actionLoading: false,
              actionError: filesResult.error
            }
          })
        } else {
          set({
            screenState: {
              status: StorageFileListStatus.ERROR,
              error: filesResult.error
            }
          })
        }
      }
    } finally {
      isFetching = false
    }
  }

  return createStore<StorageFileListStoreState<TParams>>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: StorageFileListStatus.LOADING },

    initScreen: async (searchParams?: TParams) => {
      const current = get().screenState
      if (isFetching || current.status === StorageFileListStatus.CONTENT) {
        return
      }
      set({ searchParams, screenState: { status: StorageFileListStatus.LOADING } })
      await fetchPage(set, get, 1, searchParams)
    },

    onSearchParamsUpdated: async (searchParams?: TParams) => {
      set({
        searchParams,
        screenState: {
          status: StorageFileListStatus.CONTENT,
          paging: createInitialPaginationState<StorageFileSummary>(),
          selectedFileIds: {},
          isFilterPanelExpanded: false,
          actionLoading: false,
          actionError: null
        }
      })
      await fetchPage(set, get, 1, searchParams)
    },

    onLoadNextPage: async () => {
      const current = get().screenState
      if (current.status !== StorageFileListStatus.CONTENT || !canLoadMorePages(current.paging)) {
        return
      }

      const nextPaging = createNextPageLoadingPaginationState(current.paging)
      set({ screenState: { ...current, paging: nextPaging } })

      await fetchPage(set, get, getNextPageNumber(current.paging))
    },

    onRefresh: async () => {
      set({ screenState: { status: StorageFileListStatus.LOADING } })
      await fetchPage(set, get, 1)
    },

    onUploadClick: () => {
      get().dependencies.onNavigateToUpload?.()
    },

    onFileClick: (fileId: string) => {
      get().dependencies.onNavigateToFileDetail?.(fileId)
    },

    onDeleteFileClick: async (fileId: string) => {
      const current = get().screenState
      if (current.status !== StorageFileListStatus.CONTENT || current.actionLoading) {
        return
      }
      const activeDeps = get().dependencies
      if (!activeDeps.deleteFileUseCase) {
        return
      }

      set({ screenState: { ...current, actionLoading: true, actionError: null } })

      const deleteResult = await activeDeps.deleteFileUseCase.execute(fileId)
      if (isSuccess(deleteResult)) {
        const { [fileId]: _, ...remainingSelected } = current.selectedFileIds
        set({
          screenState: {
            ...current,
            selectedFileIds: remainingSelected
          }
        })
        await get().onRefresh()
      } else {
        const updated = get().screenState
        if (updated.status === StorageFileListStatus.CONTENT) {
          set({ screenState: { ...updated, actionLoading: false, actionError: deleteResult.error } })
        }
      }
    },

    toggleSelectFile: (fileId: string) => {
      const current = get().screenState
      if (current.status !== StorageFileListStatus.CONTENT) {
        return
      }
      const { [fileId]: isSelected, ...rest } = current.selectedFileIds
      const nextSelected = isSelected ? rest : { ...current.selectedFileIds, [fileId]: true }
      set({
        screenState: {
          ...current,
          selectedFileIds: nextSelected
        }
      })
    },

    selectAllFiles: () => {
      const current = get().screenState
      if (current.status !== StorageFileListStatus.CONTENT) {
        return
      }
      const allSelected = current.paging.items.reduce<Record<string, boolean>>((acc, item) => {
        acc[item.id] = true
        return acc
      }, {})
      set({
        screenState: {
          ...current,
          selectedFileIds: allSelected
        }
      })
    },

    clearFileSelection: () => {
      const current = get().screenState
      if (current.status !== StorageFileListStatus.CONTENT) {
        return
      }
      set({
        screenState: {
          ...current,
          selectedFileIds: {}
        }
      })
    },

    onDeleteSelectedFilesClick: async () => {
      const current = get().screenState
      if (current.status !== StorageFileListStatus.CONTENT || current.actionLoading) {
        return
      }
      const activeDeps = get().dependencies
      if (!activeDeps.deleteFilesBatchUseCase) {
        return
      }

      const fileIds = Object.keys(current.selectedFileIds).filter((id) => Boolean(current.selectedFileIds[id]))
      if (fileIds.length === 0) {
        return
      }

      set({ screenState: { ...current, actionLoading: true, actionError: null } })

      const deleteResult = await activeDeps.deleteFilesBatchUseCase.execute({ fileIds })
      if (isSuccess(deleteResult)) {
        set({
          screenState: {
            ...current,
            selectedFileIds: {}
          }
        })
        await get().onRefresh()
      } else {
        const updated = get().screenState
        if (updated.status === StorageFileListStatus.CONTENT) {
          set({ screenState: { ...updated, actionLoading: false, actionError: deleteResult.error } })
        }
      }
    },

    onBackClick: () => {
      get().dependencies.onBack()
    },

    onToggleFilterPanel: () => {
      const current = get().screenState
      if (current.status === StorageFileListStatus.CONTENT) {
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

/**
 * Props for {@link StorageFileListProvider}.
 *
 * @template TParams - Query parameters type.
 */
export interface StorageFileListProviderProps<TParams extends Record<string, unknown> = Record<string, unknown>> {
  /** Dependency bindings for the storage file list store. */
  dependencies: StorageFileListStoreDependencies<TParams>
  /** Optional initial screen state. */
  initialState?: StorageFileListScreenState
  /** React child elements wrapped by provider context. */
  children: React.ReactNode
}

/**
 * Generic Context Factory creating a strictly typed React Context, Provider, and Store Hook
 * for a specific search parameters type.
 *
 * @template TParams - Specific search/query parameters type.
 * @returns Object containing strictly typed Context, Provider component, and useStore hook.
 */
export function createStorageFileListContext<
  TParams extends Record<string, unknown> = Record<string, unknown>
>() {
  const Context = createContext<StoreApi<StorageFileListStoreState<TParams>> | null>(null)

  const Provider: React.FC<StorageFileListProviderProps<TParams>> = ({
    dependencies,
    initialState,
    children
  }) => {
    const [store] = useState(() => createStorageFileListStore(dependencies, initialState))

    useEffect(() => {
      store.setState((state) => ({ ...state, dependencies }))
    }, [store, dependencies])

    return <Context.Provider value={store}>{children}</Context.Provider>
  }

  const useStorageFileListStoreHook = <T,>(
    selector: (state: StorageFileListStoreState<TParams>) => T
  ): T => {
    const store = useContext(Context)
    if (!store) {
      throw new Error('useStorageFileListStore must be used within StorageFileListProvider')
    }
    return useStore(store, selector)
  }

  return {
    StorageFileListContext: Context,
    StorageFileListProvider: Provider,
    useStorageFileListStore: useStorageFileListStoreHook
  }
}

const defaultContext = createStorageFileListContext<Record<string, unknown>>()

/**
 * Default React Context for {@link StorageFileListStore}.
 */
export const StorageFileListContext = defaultContext.StorageFileListContext

/**
 * Default React Context Provider for {@link StorageFileListStore}.
 */
export const StorageFileListProvider = defaultContext.StorageFileListProvider

/**
 * Custom React hook to select state slices from {@link StorageFileListStore}.
 *
 * @template T - Selected state slice return type.
 * @param selector - Selector function extracting values from store state.
 * @returns Selected slice of store state.
 * @throws {Error} If called outside of {@link StorageFileListProvider}.
 */
export const useStorageFileListStore = defaultContext.useStorageFileListStore
