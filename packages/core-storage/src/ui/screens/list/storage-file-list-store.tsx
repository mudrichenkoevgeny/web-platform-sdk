import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import type {
  DeleteFilesBatchRequest,
  PagedResult,
  StorageFileSummary
} from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileStatus } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, AppResult, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { searchParamsToListingStates } from './storage-file-list-search-converters'

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
 * Discriminated union representing active UI state for StorageFileListScreen.
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
      /** ID of the file pending single deletion confirmation. */
      fileIdToDelete: string | null
      /** Whether batch delete confirmation dialog is visible. */
      showBatchDeleteConfirmation: boolean
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
  /** Optional target user or owner ID for filtering user-specific files. */
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
  /** Initializes screen data using optional search parameters. */
  initScreen: (searchParams?: TParams) => Promise<void>
  /** Re-initializes pagination with updated search parameters. */
  onSearchParamsUpdated: (searchParams?: TParams) => Promise<void>
  /** Fetches and appends the next page of storage files. */
  onLoadNextPage: (searchParams?: TParams) => Promise<void>
  /** Refreshes the first page of storage files. */
  onRefresh: (searchParams?: TParams) => Promise<void>
  /** Triggers navigation to upload screen. */
  onUploadClick: () => void
  /** Triggers navigation to detail screen for selected file. */
  onFileClick: (fileId: string) => void
  /** Opens confirmation dialog for single file deletion. */
  onDeleteFileClick: (fileId: string) => void
  /** Dismisses delete confirmation dialogs. */
  onDismissDeleteDialog: () => void
  /** Confirms and executes single file deletion. */
  onConfirmDeleteFile: (searchParams?: TParams) => Promise<void>
  /** Toggles selection status of a single file. */
  toggleSelectFile: (fileId: string) => void
  /** Selects all selectable files in the current page. */
  selectAllFiles: () => void
  /** Clears all selected file IDs. */
  clearFileSelection: () => void
  /** Opens confirmation dialog for batch file deletion. */
  onDeleteSelectedFilesClick: () => void
  /** Confirms and executes batch file deletion. */
  onConfirmBatchDeleteFiles: (searchParams?: TParams) => Promise<void>
  /** Triggers navigation back. */
  onBackClick: () => void
  /** Toggles filter panel expansion state. */
  onToggleFilterPanel: () => void
}

function applyLocalDeletion<TParams extends Record<string, unknown>>(
  current: StorageFileListScreenState & { status: StorageFileListStatus.CONTENT },
  deletedIds: string[],
  searchParams?: TParams
): StorageFileListScreenState {
  const { filterStates } = searchParamsToListingStates(searchParams)

  const isDeletedStatusIncluded = Boolean(
    filterStates.status &&
      filterStates.status.type === 'choice' &&
      filterStates.status.selectedIds.has(StorageFileStatus.DELETED)
  )

  const deletedSet = new Set(deletedIds)

  const remainingSelected = { ...current.selectedFileIds }
  deletedIds.forEach((id) => {
    delete remainingSelected[id]
  })

  if (isDeletedStatusIncluded) {
    const updatedItems = current.paging.items.map((item) => {
      if (deletedSet.has(item.id)) {
        return { ...item, status: StorageFileStatus.DELETED }
      }
      return item
    })

    return {
      ...current,
      actionLoading: false,
      actionError: null,
      fileIdToDelete: null,
      showBatchDeleteConfirmation: false,
      selectedFileIds: remainingSelected,
      paging: {
        ...current.paging,
        items: updatedItems
      }
    }
  }

  const filteredItems = current.paging.items.filter((item) => !deletedSet.has(item.id))
  const removedCount = current.paging.items.length - filteredItems.length

  return {
    ...current,
    actionLoading: false,
    actionError: null,
    fileIdToDelete: null,
    showBatchDeleteConfirmation: false,
    selectedFileIds: remainingSelected,
    paging: {
      ...current.paging,
      items: filteredItems,
      totalCount: Math.max(0, current.paging.totalCount - removedCount)
    }
  }
}

/**
 * Store instance type returned by {@link createStorageFileListStore}.
 *
 * @template TParams - Query parameters type.
 */
export type StorageFileListStore<TParams extends Record<string, unknown> = Record<string, unknown>> = StoreApi<
  StorageFileListStoreState<TParams>
>

type SetState<TParams extends Record<string, unknown>> = StoreApi<StorageFileListStoreState<TParams>>['setState']
type GetState<TParams extends Record<string, unknown>> = StoreApi<StorageFileListStoreState<TParams>>['getState']

/**
 * Factory function creating a Zustand store instance for managing storage file list UI state.
 *
 * @template TParams - Query parameters type.
 * @template TGetUseCase - Fetch usecase execution contract.
 * @template TDeleteUseCase - Single delete usecase execution contract.
 * @template TBatchDeleteUseCase - Batch delete usecase execution contract.
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
    searchParams?: TParams
  ) => {
    if (isFetching) {
      return
    }
    isFetching = true

    try {
      const activeDeps = get().dependencies
      let queryParams: TParams | undefined = searchParams

      if (activeDeps.parseParams && searchParams !== undefined) {
        queryParams = activeDeps.parseParams(toRecord(searchParams))
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
              actionError: null,
              fileIdToDelete: null,
              showBatchDeleteConfirmation: false
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
      set({ screenState: { status: StorageFileListStatus.LOADING } })
      await fetchPage(set, get, 1, searchParams)
    },

    onSearchParamsUpdated: async (searchParams?: TParams) => {
      set({ screenState: { status: StorageFileListStatus.LOADING } })
      await fetchPage(set, get, 1, searchParams)
    },

    onLoadNextPage: async (searchParams?: TParams) => {
      const current = get().screenState
      if (current.status !== StorageFileListStatus.CONTENT || !canLoadMorePages(current.paging)) {
        return
      }
      const nextLoadingPaging = createNextPageLoadingPaginationState(current.paging)
      set({ screenState: { ...current, paging: nextLoadingPaging } })

      await fetchPage(set, get, getNextPageNumber(current.paging), searchParams)
    },

    onRefresh: async (searchParams?: TParams) => {
      set({ screenState: { status: StorageFileListStatus.LOADING } })
      await fetchPage(set, get, 1, searchParams)
    },

    onUploadClick: () => {
      get().dependencies.onNavigateToUpload?.()
    },

    onFileClick: (fileId: string) => {
      get().dependencies.onNavigateToFileDetail?.(fileId)
    },

    onDeleteFileClick: (fileId: string) => {
      const current = get().screenState
      if (current.status !== StorageFileListStatus.CONTENT || current.actionLoading) {
        return
      }
      set({ screenState: { ...current, fileIdToDelete: fileId } })
    },

    onDismissDeleteDialog: () => {
      const current = get().screenState
      if (current.status !== StorageFileListStatus.CONTENT) {
        return
      }
      set({ screenState: { ...current, fileIdToDelete: null, showBatchDeleteConfirmation: false } })
    },

    onConfirmDeleteFile: async (searchParams?: TParams) => {
      const current = get().screenState
      if (current.status !== StorageFileListStatus.CONTENT || current.fileIdToDelete === null) {
        return
      }
      const fileId = current.fileIdToDelete
      const activeDeps = get().dependencies
      if (!activeDeps.deleteFileUseCase) {
        return
      }

      set({ screenState: { ...current, actionLoading: true, actionError: null } })

      const deleteResult = await activeDeps.deleteFileUseCase.execute(fileId)
      if (isSuccess(deleteResult)) {
        const updatedState = applyLocalDeletion(current, [fileId], searchParams)
        set({ screenState: updatedState })
      } else {
        const updated = get().screenState
        if (updated.status === StorageFileListStatus.CONTENT) {
          set({
            screenState: {
              ...updated,
              fileIdToDelete: null,
              actionLoading: false,
              actionError: deleteResult.error
            }
          })
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
        if (item.status !== StorageFileStatus.DELETED) {
          acc[item.id] = true
        }
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

    onDeleteSelectedFilesClick: () => {
      const current = get().screenState
      if (current.status !== StorageFileListStatus.CONTENT || current.actionLoading) {
        return
      }
      const fileIds = Object.keys(current.selectedFileIds).filter((id) => Boolean(current.selectedFileIds[id]))
      if (fileIds.length === 0) {
        return
      }
      set({ screenState: { ...current, showBatchDeleteConfirmation: true } })
    },

    onConfirmBatchDeleteFiles: async (searchParams?: TParams) => {
      const current = get().screenState
      if (current.status !== StorageFileListStatus.CONTENT) {
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
        const updatedState = applyLocalDeletion(current, fileIds, searchParams)
        set({ screenState: updatedState })
      } else {
        const updated = get().screenState
        if (updated.status === StorageFileListStatus.CONTENT) {
          set({
            screenState: {
              ...updated,
              showBatchDeleteConfirmation: false,
              actionLoading: false,
              actionError: deleteResult.error
            }
          })
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

const StorageFileListContext = createContext<StoreApi<StorageFileListStoreState<Record<string, unknown>>> | null>(null)

/**
 * Props for {@link StorageFileListProvider}.
 *
 * @template TParams - Query parameters type.
 */
export interface StorageFileListProviderProps<TParams extends Record<string, unknown> = Record<string, unknown>> {
  /** External dependencies injected into the storage file list store. */
  dependencies: StorageFileListStoreDependencies<TParams>
  /** Optional initial screen state override. */
  initialState?: StorageFileListScreenState
  /** React child elements wrapped by provider context. */
  children: React.ReactNode
}

/**
 * React Context Provider creating and binding a {@link StorageFileListStore} instance.
 *
 * @template TParams - Query parameters type.
 * @param props - Component props including dependencies, initial state, and children.
 * @returns Context provider element wrapping child components.
 */
export const StorageFileListProvider = <TParams extends Record<string, unknown> = Record<string, unknown>>({
  dependencies,
  initialState,
  children
}: StorageFileListProviderProps<TParams>) => {
  const [store] = useState<StoreApi<StorageFileListStoreState<Record<string, unknown>>>>(
    () => createStorageFileListStore<Record<string, unknown>>(dependencies, initialState)
  )

  useEffect(() => {
    store.setState({ dependencies })
  }, [store, dependencies])

  return (
    <StorageFileListContext.Provider value={store}>
      {children}
    </StorageFileListContext.Provider>
  )
}

/**
 * Custom React hook to select state slices from {@link StorageFileListStore}.
 *
 * @template T - Selected state slice return type.
 * @param selector - Selector function extracting values from store state.
 * @returns Selected slice of store state.
 * @throws {Error} If called outside of {@link StorageFileListProvider}.
 */
export const useStorageFileListStore = <T,>(
  selector: (state: StorageFileListStoreState<Record<string, unknown>>) => T
): T => {
  const store = useContext(StorageFileListContext)
  if (!store) {
    throw new Error('useStorageFileListStore must be used within StorageFileListProvider')
  }
  return useStore(store, selector)
}
