import React, { createContext, useContext, useState, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { managementUserSessionListParamsSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserSessionListParams, UserSessionSummary, UserSessionId, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementDeleteAllUserSessionsUseCase } from '@/usecase/session/management-delete-all-user-sessions-use-case'
import type { ManagementDeleteSessionUseCase } from '@/usecase/session/management-delete-session-use-case'
import type { ManagementGetSessionsUseCase } from '@/usecase/session/management-get-sessions-use-case'

/** Discriminated union representing screen states for user-specific session list view. */
export type UserSessionListScreenState =
  | {
      /** Loading state while user sessions list is being loaded initially. */
      status: 'loading'
    }
  | {
      /** Error state when loading user sessions list failed. */
      status: 'error'
      /** Error instance describing the failure. */
      error: AppError
    }
  | {
      /** Content state containing paginated user sessions. */
      status: 'content'
      /** Current pagination state for user session items. */
      paging: PaginationState<UserSessionSummary>
      /** Whether a background session deletion action is currently loading. */
      actionLoading: boolean
      /** Action error instance if deletion action failed. */
      actionError: AppError | null
    }

/** External dependencies required by {@link createUserSessionListStore}. */
export interface UserSessionListStoreDependencies {
  /** Optional target user ID whose sessions are listed. */
  userId?: UserId | null
  /** Optional current session ID. */
  currentSessionId?: UserSessionId | null
  /** Optional current user ID. */
  currentUserId?: UserId | null
  /** Use case for fetching user sessions. */
  managementGetSessionsUseCase: ManagementGetSessionsUseCase
  /** Use case for deleting a user session. */
  managementDeleteSessionUseCase: ManagementDeleteSessionUseCase
  /** Use case for deleting all user sessions. */
  managementDeleteAllUserSessionsUseCase: ManagementDeleteAllUserSessionsUseCase
  /** Navigation callback to open session detail. */
  onNavigateToSessionDetail?: (session: UserSessionSummary) => void
  /** Navigation callback to return to previous screen. */
  onBack: () => void
  /** Optional initial search parameters. */
  searchParams?: ManagementUserSessionListParams
  /** Optional callback when search parameters change. */
  onSearchParamsChanged?: (params: ManagementUserSessionListParams) => void
}

/** Reactive store state and action interface for user-specific session list screen. */
export interface UserSessionListStoreState {
  /** Dependencies injected into store. */
  dependencies: UserSessionListStoreDependencies
  /** Current screen UI state. */
  screenState: UserSessionListScreenState
  /** Initializes screen state by fetching first page of user sessions. */
  initScreen: (searchParams?: ManagementUserSessionListParams) => Promise<void>
  /** Updates search parameters and reloads user sessions list from first page. */
  onSearchParamsUpdated: (searchParams?: ManagementUserSessionListParams) => Promise<void>
  /** Fetches next page of user sessions when scrolling. */
  onLoadNextPage: () => Promise<void>
  /** Refreshes user sessions list from first page. */
  onRefresh: () => Promise<void>
  /** Handles click on session item. */
  onSessionClick: (session: UserSessionSummary) => void
  /** Handles deletion of a specific user session. */
  onDeleteSessionClick: (sessionId: string) => Promise<void>
  /** Handles deletion of all sessions for target user. */
  onDeleteAllSessionsClick: () => Promise<void>
  /** Handles external session revocation event. */
  onSessionRevoked: (sessionId: UserSessionId) => void
  /** Handles back navigation button click. */
  onBackClick: () => void
}

/** Type alias for Zustand store instance returned by {@link createUserSessionListStore}. */
export type UserSessionListStore = ReturnType<typeof createUserSessionListStore>

type SetState = StoreApi<UserSessionListStoreState>['setState']
type GetState = StoreApi<UserSessionListStoreState>['getState']

/**
 * Creates a reactive Zustand store instance for user-specific session list screen.
 *
 * @param deps - Injected store dependencies
 * @param initialState - Optional initial screen state override
 * @returns Initialized store instance
 */
export const createUserSessionListStore = (
  deps: UserSessionListStoreDependencies,
  initialState?: UserSessionListScreenState
) => {
  let isFetching = false

  const fetchPage = async (
    set: SetState,
    get: GetState,
    pageNumber: number,
    overrideParams?: ManagementUserSessionListParams
  ) => {
    if (isFetching) {
      return
    }
    isFetching = true

    try {
      const activeDeps = get().dependencies
      const searchParams = overrideParams ?? activeDeps.searchParams
      const sessionsResult = await activeDeps.managementGetSessionsUseCase.execute(
        managementUserSessionListParamsSchema.parse({
          userId: activeDeps.userId,
          ...searchParams,
          pageNumber
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
              paging: nextPaging,
              actionLoading: false
            }
          })
        } else {
          set({
            screenState: {
              status: 'content',
              paging: nextPaging,
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
              actionLoading: false,
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

  return createStore<UserSessionListStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: 'loading' },

    initScreen: async (searchParams?: ManagementUserSessionListParams) => {
      const current = get().screenState
      if (isFetching || current.status === 'content') {
        return
      }
      set({ screenState: { status: 'loading' } })
      const startPage = searchParams?.pageNumber ?? 1
      await fetchPage(set, get, startPage, searchParams)
    },

    onSearchParamsUpdated: async (searchParams?: ManagementUserSessionListParams) => {
      set({
        screenState: {
          status: 'content',
          paging: createInitialPaginationState<UserSessionSummary>(),
          actionLoading: false,
          actionError: null
        }
      })
      const startPage = searchParams?.pageNumber ?? 1
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

    onSessionClick: (session: UserSessionSummary) => {
      deps.onNavigateToSessionDetail?.(session)
    },

    onDeleteSessionClick: async (sessionId: string) => {
      const current = get().screenState
      if (current.status !== 'content' || !deps.userId || current.actionLoading) {
        return
      }

      set({ screenState: { ...current, actionLoading: true, actionError: null } })

      const deleteSessionResult = await deps.managementDeleteSessionUseCase.execute(deps.userId, sessionId)
      if (isSuccess(deleteSessionResult)) {
        await fetchPage(set, get, 1)
      } else {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({ screenState: { ...updated, actionLoading: false, actionError: deleteSessionResult.error } })
        }
      }
    },

    onDeleteAllSessionsClick: async () => {
      const current = get().screenState
      if (current.status !== 'content' || !deps.userId || current.actionLoading) {
        return
      }

      set({ screenState: { ...current, actionLoading: true, actionError: null } })

      const deleteAllSessionsResult = await deps.managementDeleteAllUserSessionsUseCase.execute(deps.userId)
      if (isSuccess(deleteAllSessionsResult)) {
        await fetchPage(set, get, 1)
      } else {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({ screenState: { ...updated, actionLoading: false, actionError: deleteAllSessionsResult.error } })
        }
      }
    },

    onSessionRevoked: (sessionId: UserSessionId) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      const filteredItems = current.paging.items.filter((item) => item.id !== sessionId)
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

const UserSessionListContext = createContext<UserSessionListStore | null>(null)

/** Props for {@link UserSessionListProvider}. */
export interface UserSessionListProviderProps {
  /** Injected dependencies. */
  dependencies: UserSessionListStoreDependencies
  /** Optional initial state override. */
  initialState?: UserSessionListScreenState
  /** React child nodes. */
  children: React.ReactNode
}

/** Context provider wrapping React components with user session list store state. */
export const UserSessionListProvider: React.FC<UserSessionListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createUserSessionListStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <UserSessionListContext.Provider value={store}>
      {children}
    </UserSessionListContext.Provider>
  )
}

/**
 * Custom React hook for selecting reactive state from {@link UserSessionListStore}.
 *
 * @param selector - Selector function transforming store state
 * @returns Selected slice of store state
 */
export const useUserSessionListStore = <T,>(
  selector: (state: UserSessionListStoreState) => T
): T => {
  const store = useContext(UserSessionListContext)
  if (!store) {
    throw new Error('useUserSessionListStore must be used within UserSessionListProvider')
  }
  return useStore(store, selector)
}
