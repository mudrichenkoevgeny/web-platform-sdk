import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { ManagementGlobalSessionListParamsParser, managementGlobalSessionListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSessionListParams, UserSessionSummary, UserSessionId, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementDeleteSessionUseCase } from '@/usecase/session/management-delete-session-use-case'
import type { ManagementGetSessionsUseCase } from '@/usecase/session/management-get-sessions-use-case'
import type { GlobalSessionListSearchParams } from '@/ui/screens/management/session/global-list/globalSessionListSearchSchema'

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null
}

/** Discriminated union representing screen states for the global session list view. */
export type GlobalSessionListScreenState =
  | {
      /** Loading state while sessions list is being loaded initially. */
      status: 'loading'
    }
  | {
      /** Error state when loading sessions list failed. */
      status: 'error'
      /** Error instance describing the failure. */
      error: AppError
    }
  | {
      /** Content state containing paginated sessions. */
      status: 'content'
      /** Current pagination state for session items. */
      paging: PaginationState<UserSessionSummary>
      /** Whether the filter panel drawer is expanded. */
      isFilterPanelExpanded: boolean
      /** Whether a background session deletion action is currently loading. */
      actionLoading: boolean
      /** Action error instance if deletion action failed. */
      actionError: AppError | null
    }

/** External dependencies required by {@link createGlobalSessionListStore}. */
export interface GlobalSessionListStoreDependencies {
  /** Use case for loading paginated global user sessions. */
  managementGetSessionsUseCase: ManagementGetSessionsUseCase
  /** Use case for deleting a user session. */
  managementDeleteSessionUseCase: ManagementDeleteSessionUseCase
  /** Optional current session ID. */
  currentSessionId?: UserSessionId | null
  /** Optional current user ID. */
  currentUserId?: UserId | null
  /** Navigation callback to open session detail screen. */
  onNavigateToSessionDetail: (session: UserSessionSummary) => void
  /** Navigation callback to open user detail screen. */
  onNavigateToUserDetail: (userId: UserId) => void
  /** Navigation callback to return to previous screen. */
  onBack: () => void
  /** Optional initial search parameters. */
  searchParams?: ManagementGlobalSessionListParams | GlobalSessionListSearchParams
  /** Optional callback when search parameters change. */
  onSearchParamsChanged?: (params: ManagementGlobalSessionListParams | GlobalSessionListSearchParams) => void
}

/** Reactive store state and action interface for global session list screen. */
export interface GlobalSessionListStoreState {
  /** Dependencies injected into store. */
  dependencies: GlobalSessionListStoreDependencies
  /** Current screen UI state. */
  screenState: GlobalSessionListScreenState
  /** Initializes screen state by fetching first page of sessions. */
  initScreen: (searchParams?: ManagementGlobalSessionListParams | GlobalSessionListSearchParams) => Promise<void>
  /** Updates search parameters and reloads sessions list from first page. */
  onSearchParamsUpdated: (searchParams?: ManagementGlobalSessionListParams | GlobalSessionListSearchParams) => Promise<void>
  /** Fetches next page of sessions when scrolling. */
  onLoadNextPage: () => Promise<void>
  /** Refreshes sessions list from first page. */
  onRefresh: () => Promise<void>
  /** Toggles filter panel expansion state. */
  onToggleFilterPanel: () => void
  /** Handles click on session item. */
  onSessionClick: (session: UserSessionSummary) => void
  /** Handles click on user link inside session item. */
  onUserClick: (userId: UserId) => void
  /** Handles deletion of a user session. */
  onDeleteSessionClick: (userId: UserId, sessionId: UserSessionId) => Promise<void>
  /** Handles back navigation button click. */
  onBackClick: () => void
}

/** Type alias for Zustand store instance returned by {@link createGlobalSessionListStore}. */
export type GlobalSessionListStore = ReturnType<typeof createGlobalSessionListStore>

type SetState = StoreApi<GlobalSessionListStoreState>['setState']
type GetState = StoreApi<GlobalSessionListStoreState>['getState']

/**
 * Creates a reactive Zustand store instance for global session list screen.
 *
 * @param deps - Injected store dependencies
 * @param initialState - Optional initial screen state override
 * @returns Initialized store instance
 */
export const createGlobalSessionListStore = (
  deps: GlobalSessionListStoreDependencies,
  initialState?: GlobalSessionListScreenState
) => {
  let isFetching = false

  const fetchPage = async (
    set: SetState,
    get: GetState,
    pageNumber: number,
    overrideParams?: ManagementGlobalSessionListParams | GlobalSessionListSearchParams
  ) => {
    if (isFetching) {
      return
    }
    isFetching = true

    try {
      const activeDeps = get().dependencies
      const rawParams = overrideParams ?? activeDeps.searchParams
      const searchRecord = isRecord(rawParams) ? rawParams : {}
      const parsedParams = ManagementGlobalSessionListParamsParser.parse(searchRecord)
      const effectivePageNumber = pageNumber !== 1 ? pageNumber : (parsedParams.pageNumber ?? pageNumber)

      const sessionsResult = await activeDeps.managementGetSessionsUseCase.execute(
        managementGlobalSessionListParamsSchema.parse({
          ...parsedParams,
          pageNumber: effectivePageNumber
        })
      )

      if (isSuccess(sessionsResult)) {
        const current = get().screenState
        const currentPaging = current.status === 'content' ? current.paging : createInitialPaginationState<UserSessionSummary>()
        const nextPaging = appendResultToPaginationState(currentPaging, sessionsResult.data)

        if (current.status === 'content') {
          set({
            screenState: {
              ...current,
              paging: nextPaging
            }
          })
        } else {
          set({
            screenState: {
              status: 'content',
              paging: nextPaging,
              isFilterPanelExpanded: false,
              actionLoading: false,
              actionError: null
            }
          })
        }
      } else {
        const current = get().screenState
        if (current.status === 'content') {
          set({
            screenState: {
              ...current,
              actionError: sessionsResult.error
            }
          })
        } else {
          set({
            screenState: {
              status: 'error',
              error: sessionsResult.error
            }
          })
        }
      }
    } finally {
      isFetching = false
    }
  }

  return createStore<GlobalSessionListStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: 'loading' },

    initScreen: async (searchParams?: ManagementGlobalSessionListParams | GlobalSessionListSearchParams) => {
      const current = get().screenState
      if (isFetching || current.status === 'content') {
        return
      }
      set({ screenState: { status: 'loading' } })
      const parsedParams = isRecord(searchParams) ? ManagementGlobalSessionListParamsParser.parse(searchParams) : undefined
      const startPage = parsedParams?.pageNumber ?? 1
      await fetchPage(set, get, startPage, searchParams)
    },

    onSearchParamsUpdated: async (searchParams?: ManagementGlobalSessionListParams | GlobalSessionListSearchParams) => {
      set({
        screenState: {
          status: 'content',
          paging: createInitialPaginationState<UserSessionSummary>(),
          isFilterPanelExpanded: false,
          actionLoading: false,
          actionError: null
        }
      })
      const parsedParams = isRecord(searchParams) ? ManagementGlobalSessionListParamsParser.parse(searchParams) : undefined
      const startPage = parsedParams?.pageNumber ?? 1
      await fetchPage(set, get, startPage, searchParams)
    },

    onLoadNextPage: async () => {
      const current = get().screenState
      if (current.status !== 'content' || !canLoadMorePages(current.paging)) {
        return
      }

      const nextPaging = createNextPageLoadingPaginationState(current.paging)
      set({ screenState: { ...current, paging: nextPaging } })

      await fetchPage(set, get, getNextPageNumber(current.paging))
    },

    onRefresh: async () => {
      set({ screenState: { status: 'loading' } })
      await fetchPage(set, get, 1)
    },

    onToggleFilterPanel: () => {
      const current = get().screenState
      if (current.status === 'content') {
        set({
          screenState: {
            ...current,
            isFilterPanelExpanded: !current.isFilterPanelExpanded
          }
        })
      }
    },

    onSessionClick: (session: UserSessionSummary) => {
      deps.onNavigateToSessionDetail(session)
    },

    onUserClick: (userId: UserId) => {
      deps.onNavigateToUserDetail(userId)
    },

    onDeleteSessionClick: async (userId: UserId, sessionId: UserSessionId) => {
      const current = get().screenState
      if (current.status !== 'content' || current.actionLoading) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const deleteSessionResult = await deps.managementDeleteSessionUseCase.execute(userId, sessionId)

      if (isSuccess(deleteSessionResult)) {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({
            screenState: {
              ...updated,
              paging: {
                ...updated.paging,
                items: updated.paging.items.filter((item) => item.id !== sessionId),
                totalCount: Math.max(0, updated.paging.totalCount - 1)
              },
              actionLoading: false
            }
          })
        }
      } else {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({
            screenState: {
              ...updated,
              actionLoading: false,
              actionError: deleteSessionResult.error
            }
          })
        }
      }
    },

    onBackClick: () => {
      deps.onBack()
    }
  }))
}

const GlobalSessionListContext = createContext<GlobalSessionListStore | null>(null)

/** Props for {@link GlobalSessionListProvider}. */
export interface GlobalSessionListProviderProps {
  /** Injected dependencies. */
  dependencies: GlobalSessionListStoreDependencies
  /** Optional initial state override. */
  initialState?: GlobalSessionListScreenState
  /** React child nodes. */
  children: React.ReactNode
}

/** Context provider wrapping React components with global session list store state. */
export const GlobalSessionListProvider: React.FC<GlobalSessionListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createGlobalSessionListStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <GlobalSessionListContext.Provider value={store}>
      {children}
    </GlobalSessionListContext.Provider>
  )
}

/**
 * Custom React hook for selecting reactive state from {@link GlobalSessionListStore}.
 *
 * @param selector - Selector function transforming store state
 * @returns Selected slice of store state
 */
export const useGlobalSessionListStore = <T,>(
  selector: (state: GlobalSessionListStoreState) => T
): T => {
  const store = useContext(GlobalSessionListContext)
  if (!store) {
    throw new Error('useGlobalSessionListStore must be used within GlobalSessionListProvider')
  }
  return useStore(store, selector)
}
