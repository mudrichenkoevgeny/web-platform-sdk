import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'

import type {
  ManagementUserIdentifierListParams,
  UserIdentifierSummary,
  UserIdentifierId,
  UserId
} from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGetIdentifiersUseCase } from '@/usecase/identifier/management-get-identifiers-use-case'

/** Status values for {@link UserIdentifierListScreenState}. */
export enum UserIdentifierListStatus {
  LOADING = 'loading',
  ERROR = 'error',
  CONTENT = 'content'
}

/** Discriminated union representing active screen state for {@link UserIdentifierListScreen}. */
export type UserIdentifierListScreenState =
  | {
      /** Loading state while user identifiers list is initially fetched. */
      status: UserIdentifierListStatus.LOADING
    }
  | {
      /** Error state when loading user identifiers list failed. */
      status: UserIdentifierListStatus.ERROR
      /** Error instance describing the failure. */
      error: AppError
    }
  | {
      /** Content state containing paginated user identifier items. */
      status: UserIdentifierListStatus.CONTENT
      /** Pagination state wrapping loaded user identifier summaries. */
      paging: PaginationState<UserIdentifierSummary>
      /** Indicates whether a background action is currently loading. */
      actionLoading: boolean
      /** Action error instance if a background operation failed. */
      actionError: AppError | null
    }

/** External dependencies required by {@link createUserIdentifierListStore}. */
export interface UserIdentifierListStoreDependencies {
  /** Target user ID whose identifiers are displayed. */
  userId: UserId
  /** Optional active session identifier ID. */
  currentIdentifierId?: UserIdentifierId | null
  /** Optional currently authenticated user ID. */
  currentUserId?: UserId | null
  /** Administrative use case for fetching user identifiers. */
  managementGetIdentifiersUseCase: Pick<ManagementGetIdentifiersUseCase, 'execute'>
  /** Optional navigation callback when an identifier item is selected. */
  onIdentifierSelect?: (identifierId: string) => void
  /** Navigation callback to return to previous screen. */
  onBack: () => void
  /** Optional initial search parameters. */
  searchParams?: ManagementUserIdentifierListParams
  /** Optional callback when search parameters change. */
  onSearchParamsChanged?: (params: ManagementUserIdentifierListParams) => void
}

/** State and actions managed by {@link UserIdentifierListStore}. */
export interface UserIdentifierListStoreState {
  /** Dependencies injected into store. */
  dependencies: UserIdentifierListStoreDependencies
  /** Current screen UI state. */
  screenState: UserIdentifierListScreenState
  /** Initializes screen state by loading first page of identifiers. */
  initScreen: (searchParams?: ManagementUserIdentifierListParams) => Promise<void>
  /** Updates search parameters and reloads list from first page. */
  onSearchParamsUpdated: (searchParams?: ManagementUserIdentifierListParams) => Promise<void>
  /** Fetches next page of user identifiers when infinite scrolling. */
  onLoadNextPage: () => Promise<void>
  /** Refreshes user identifiers list from first page. */
  onRefresh: () => Promise<void>
  /** Callback triggered when an identifier card is clicked. */
  onIdentifierClick: (identifierId: string) => void
  /** Callback triggered when an identifier item is deleted. */
  onIdentifierDeleted: (identifierId: UserIdentifierId) => void
  /** Callback triggered when back button is clicked. */
  onBackClick: () => void
}

/** Type alias for Zustand store instance returned by {@link createUserIdentifierListStore}. */
export type UserIdentifierListStore = ReturnType<typeof createUserIdentifierListStore>

type SetState = StoreApi<UserIdentifierListStoreState>['setState']
type GetState = StoreApi<UserIdentifierListStoreState>['getState']

/**
 * Creates a reactive Zustand store instance for user identifier list screen.
 *
 * @param deps - Injected store dependencies
 * @param initialState - Optional initial screen state override
 * @returns Initialized store instance
 */
export const createUserIdentifierListStore = (
  deps: UserIdentifierListStoreDependencies,
  initialState?: UserIdentifierListScreenState
) => {
  let isFetching = false

  const fetchPage = async (
    set: SetState,
    get: GetState,
    pageNumber: number,
    overrideParams?: ManagementUserIdentifierListParams
  ) => {
    if (isFetching) {
      return
    }
    isFetching = true

    try {
      const activeDeps = get().dependencies
      const rawParams = overrideParams ?? activeDeps.searchParams
      const effectivePageNumber = pageNumber !== 1 ? pageNumber : (rawParams?.pageNumber ?? pageNumber)

      const userIdentifiersResult = await activeDeps.managementGetIdentifiersUseCase.execute({
        userId: activeDeps.userId,
        ...rawParams,
        pageNumber: effectivePageNumber
      })

      if (isSuccess(userIdentifiersResult)) {
        const current = get().screenState
        const currentPaging = current.status === UserIdentifierListStatus.CONTENT ? current.paging : createInitialPaginationState<UserIdentifierSummary>()
        const nextPaging = appendResultToPaginationState(currentPaging, userIdentifiersResult.data)

        if (current.status === UserIdentifierListStatus.CONTENT) {
          set({
            screenState: {
              ...current,
              paging: nextPaging
            }
          })
        } else {
          set({
            screenState: {
              status: UserIdentifierListStatus.CONTENT,
              paging: nextPaging,
              actionLoading: false,
              actionError: null
            }
          })
        }
      } else {
        const current = get().screenState
        if (current.status === UserIdentifierListStatus.CONTENT) {
          set({
            screenState: {
              ...current,
              actionError: userIdentifiersResult.error
            }
          })
        } else {
          set({
            screenState: {
              status: UserIdentifierListStatus.ERROR,
              error: userIdentifiersResult.error
            }
          })
        }
      }
    } finally {
      isFetching = false
    }
  }

  return createStore<UserIdentifierListStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: UserIdentifierListStatus.LOADING },

    initScreen: async (searchParams?: ManagementUserIdentifierListParams) => {
      const current = get().screenState
      if (isFetching || current.status === UserIdentifierListStatus.CONTENT) {
        return
      }
      set({ screenState: { status: UserIdentifierListStatus.LOADING } })
      const startPage = searchParams?.pageNumber ?? 1
      await fetchPage(set, get, startPage, searchParams)
    },

    onSearchParamsUpdated: async (searchParams?: ManagementUserIdentifierListParams) => {
      set({
        screenState: {
          status: UserIdentifierListStatus.CONTENT,
          paging: createInitialPaginationState<UserIdentifierSummary>(),
          actionLoading: false,
          actionError: null
        }
      })
      const startPage = searchParams?.pageNumber ?? 1
      await fetchPage(set, get, startPage, searchParams)
    },

    onLoadNextPage: async () => {
      const current = get().screenState
      if (current.status !== UserIdentifierListStatus.CONTENT || !canLoadMorePages(current.paging)) {
        return
      }

      const nextPaging = createNextPageLoadingPaginationState(current.paging)
      set({ screenState: { ...current, paging: nextPaging } })

      await fetchPage(set, get, getNextPageNumber(current.paging))
    },

    onRefresh: async () => {
      set({ screenState: { status: UserIdentifierListStatus.LOADING } })
      await fetchPage(set, get, 1)
    },

    onIdentifierClick: (identifierId: string) => {
      deps.onIdentifierSelect?.(identifierId)
    },

    onIdentifierDeleted: (identifierId: UserIdentifierId) => {
      const current = get().screenState
      if (current.status !== UserIdentifierListStatus.CONTENT) {
        return
      }

      const filteredItems = current.paging.items.filter((item) => item.id !== identifierId)
      set({
        screenState: {
          ...current,
          paging: {
            ...current.paging,
            items: filteredItems,
            totalCount: Math.max(0, current.paging.totalCount - 1)
          }
        }
      })
    },

    onBackClick: () => {
      deps.onBack()
    }
  }))
}

const UserIdentifierListContext = createContext<UserIdentifierListStore | null>(null)

/** Props for {@link UserIdentifierListProvider}. */
export interface UserIdentifierListProviderProps {
  /** Injected dependencies. */
  dependencies: UserIdentifierListStoreDependencies
  /** Optional initial state override. */
  initialState?: UserIdentifierListScreenState
  /** React child nodes. */
  children: React.ReactNode
}

/** Context provider wrapping React components with user identifier list store state. */
export const UserIdentifierListProvider: React.FC<UserIdentifierListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createUserIdentifierListStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <UserIdentifierListContext.Provider value={store}>
      {children}
    </UserIdentifierListContext.Provider>
  )
}

/**
 * Custom React hook for selecting reactive state from {@link UserIdentifierListStore}.
 *
 * @param selector - Selector function transforming store state
 * @returns Selected slice of store state
 */
export const useUserIdentifierListStore = <T,>(
  selector: (state: UserIdentifierListStoreState) => T
): T => {
  const store = useContext(UserIdentifierListContext)
  if (!store) {
    throw new Error('useUserIdentifierListStore must be used within UserIdentifierListProvider')
  }
  return useStore(store, selector)
}
