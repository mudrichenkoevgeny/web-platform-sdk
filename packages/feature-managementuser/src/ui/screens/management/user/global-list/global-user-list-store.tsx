import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { ManagementUserListParamsParser } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserListParams, UserSummary, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GetUsersUseCase } from '@/usecase/user/get-users-use-case'
import type { GlobalUserListSearchParams } from './globalUserListSearchSchema'

function toRecord(val: unknown): Record<string, unknown> {
  if (typeof val === 'object' && val !== null) {
    return { ...val }
  }
  return {}
}

/** Status values for {@link GlobalUserListScreenState}. */
export enum GlobalUserListStatus {
  LOADING = 'loading',
  ERROR = 'error',
  CONTENT = 'content'
}

/** Discriminated union representing screen states for the global user list view. */
export type GlobalUserListScreenState =
  | {
      /** Loading state while user list is being loaded initially. */
      status: GlobalUserListStatus.LOADING
    }
  | {
      /** Error state when loading user list failed. */
      status: GlobalUserListStatus.ERROR
      /** Error instance describing the failure. */
      error: AppError
    }
  | {
      /** Content state containing paginated user summaries. */
      status: GlobalUserListStatus.CONTENT
      /** Current pagination state for user items. */
      paging: PaginationState<UserSummary>
      /** Whether the filter panel drawer is expanded. */
      isFilterPanelExpanded: boolean
      /** Whether a background user action is currently loading. */
      actionLoading: boolean
      /** Action error instance if action failed. */
      actionError: AppError | null
    }

/** External dependencies required by {@link createGlobalUserListStore}. */
export interface GlobalUserListStoreDependencies {
  /** Use case for loading paginated global users. */
  getUsersUseCase: Pick<GetUsersUseCase, 'execute'>
  /** Optional currently logged in user ID. */
  currentUserId?: UserId | null
  /** Navigation callback to open user detail screen. */
  onNavigateToUserDetail: (userId: UserId) => void
  /** Navigation callback to open user creation screen. */
  onNavigateToCreateUser: () => void
  /** Navigation callback to return to previous screen. */
  onBack: () => void
  /** Optional initial search parameters. */
  searchParams?: ManagementUserListParams | GlobalUserListSearchParams
  /** Optional callback when search parameters change. */
  onSearchParamsChanged?: (params: ManagementUserListParams | GlobalUserListSearchParams) => void
}

/** Reactive store state and action interface for global user list screen. */
export interface GlobalUserListStoreState {
  /** Dependencies injected into store. */
  dependencies: GlobalUserListStoreDependencies
  /** Current screen UI state. */
  screenState: GlobalUserListScreenState
  /** Initializes screen state by fetching first page of users. */
  initScreen: (searchParams?: ManagementUserListParams | GlobalUserListSearchParams) => Promise<void>
  /** Updates search parameters and reloads users list from first page. */
  onSearchParamsUpdated: (searchParams?: ManagementUserListParams | GlobalUserListSearchParams) => Promise<void>
  /** Fetches next page of users when scrolling. */
  onLoadNextPage: () => Promise<void>
  /** Refreshes users list from first page. */
  onRefresh: () => Promise<void>
  /** Toggles filter panel expansion state. */
  onToggleFilterPanel: () => void
  /** Handles click on user item. */
  onUserClick: (userId: UserId) => void
  /** Handles create user button click. */
  onCreateUserClick: () => void
  /** Handles back navigation button click. */
  onBackClick: () => void
}

/** Type alias for Zustand store instance returned by {@link createGlobalUserListStore}. */
export type GlobalUserListStore = ReturnType<typeof createGlobalUserListStore>

type SetState = StoreApi<GlobalUserListStoreState>['setState']
type GetState = StoreApi<GlobalUserListStoreState>['getState']

/**
 * Creates a reactive Zustand store instance for global user list screen.
 *
 * @param deps - Injected store dependencies
 * @param initialState - Optional initial screen state override
 * @returns Initialized store instance
 */
export const createGlobalUserListStore = (
  deps: GlobalUserListStoreDependencies,
  initialState?: GlobalUserListScreenState
) => {
  let isFetching = false

  const fetchPage = async (
    set: SetState,
    get: GetState,
    pageNumber: number,
    overrideParams?: ManagementUserListParams | GlobalUserListSearchParams
  ) => {
    if (isFetching) {
      return
    }
    isFetching = true

    try {
      const activeDeps = get().dependencies
      const rawParams = overrideParams ?? activeDeps.searchParams
      const searchRecord = toRecord(rawParams)
      const parsedParams = ManagementUserListParamsParser.parse(searchRecord)
      const effectivePageNumber = pageNumber !== 1 ? pageNumber : (parsedParams.pageNumber ?? pageNumber)

      const usersResult = await activeDeps.getUsersUseCase.execute({
        ...parsedParams,
        pageNumber: effectivePageNumber
      })

      if (isSuccess(usersResult)) {
        const current = get().screenState
        const currentPaging = current.status === GlobalUserListStatus.CONTENT ? current.paging : createInitialPaginationState<UserSummary>()
        const nextPaging = appendResultToPaginationState(currentPaging, usersResult.data)

        if (current.status === GlobalUserListStatus.CONTENT) {
          set({
            screenState: {
              ...current,
              paging: nextPaging
            }
          })
        } else {
          set({
            screenState: {
              status: GlobalUserListStatus.CONTENT,
              paging: nextPaging,
              isFilterPanelExpanded: false,
              actionLoading: false,
              actionError: null
            }
          })
        }
      } else {
        const current = get().screenState
        if (current.status === GlobalUserListStatus.CONTENT) {
          set({
            screenState: {
              ...current,
              actionError: usersResult.error
            }
          })
        } else {
          set({
            screenState: {
              status: GlobalUserListStatus.ERROR,
              error: usersResult.error
            }
          })
        }
      }
    } finally {
      isFetching = false
    }
  }

  return createStore<GlobalUserListStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: GlobalUserListStatus.LOADING },

    initScreen: async (searchParams?: ManagementUserListParams | GlobalUserListSearchParams) => {
      const current = get().screenState
      if (isFetching || current.status === GlobalUserListStatus.CONTENT) {
        return
      }
      set({ screenState: { status: GlobalUserListStatus.LOADING } })
      const searchRecord = toRecord(searchParams)
      const parsedParams = ManagementUserListParamsParser.parse(searchRecord)
      const startPage = parsedParams.pageNumber ?? 1
      await fetchPage(set, get, startPage, searchParams)
    },

    onSearchParamsUpdated: async (searchParams?: ManagementUserListParams | GlobalUserListSearchParams) => {
      set({
        screenState: {
          status: GlobalUserListStatus.CONTENT,
          paging: createInitialPaginationState<UserSummary>(),
          isFilterPanelExpanded: false,
          actionLoading: false,
          actionError: null
        }
      })
      const searchRecord = toRecord(searchParams)
      const parsedParams = ManagementUserListParamsParser.parse(searchRecord)
      const startPage = parsedParams.pageNumber ?? 1
      await fetchPage(set, get, startPage, searchParams)
    },

    onLoadNextPage: async () => {
      const current = get().screenState
      if (current.status !== GlobalUserListStatus.CONTENT || !canLoadMorePages(current.paging)) {
        return
      }

      const nextPaging = createNextPageLoadingPaginationState(current.paging)
      set({ screenState: { ...current, paging: nextPaging } })

      await fetchPage(set, get, getNextPageNumber(current.paging))
    },

    onRefresh: async () => {
      set({ screenState: { status: GlobalUserListStatus.LOADING } })
      await fetchPage(set, get, 1)
    },

    onToggleFilterPanel: () => {
      const current = get().screenState
      if (current.status === GlobalUserListStatus.CONTENT) {
        set({
          screenState: {
            ...current,
            isFilterPanelExpanded: !current.isFilterPanelExpanded
          }
        })
      }
    },

    onUserClick: (userId: UserId) => {
      get().dependencies.onNavigateToUserDetail(userId)
    },

    onCreateUserClick: () => {
      get().dependencies.onNavigateToCreateUser()
    },

    onBackClick: () => {
      get().dependencies.onBack()
    }
  }))
}

const GlobalUserListContext = createContext<GlobalUserListStore | null>(null)

/** Props for {@link GlobalUserListProvider}. */
export interface GlobalUserListProviderProps {
  /** Injected dependencies. */
  dependencies: GlobalUserListStoreDependencies
  /** Optional initial state override. */
  initialState?: GlobalUserListScreenState
  /** React child nodes. */
  children: React.ReactNode
}

/** Context provider wrapping React components with global user list store state. */
export const GlobalUserListProvider: React.FC<GlobalUserListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createGlobalUserListStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <GlobalUserListContext.Provider value={store}>
      {children}
    </GlobalUserListContext.Provider>
  )
}

/**
 * Custom React hook for selecting reactive state from {@link GlobalUserListStore}.
 *
 * @param selector - Selector function transforming store state
 * @returns Selected slice of store state
 */
export const useGlobalUserListStore = <T,>(
  selector: (state: GlobalUserListStoreState) => T
): T => {
  const store = useContext(GlobalUserListContext)
  if (!store) {
    throw new Error('useGlobalUserListStore must be used within GlobalUserListProvider')
  }
  return useStore(store, selector)
}
