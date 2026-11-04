import React, { createContext, useContext, useState } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { toUserSessionIdOrNull } from '@mudrichenkoevgeny/shared-foundation'
import type { UserSessionId, UserSessionSummary } from '@mudrichenkoevgeny/shared-foundation'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AuthStorage } from '@/storage/auth/auth-storage'
import type { GetSessionsUseCase } from '@/usecase/session/get-sessions-use-case'
import type { DeleteSessionUseCase } from '@/usecase/session/delete-session-use-case'
import type { DeleteAllOtherSessionsUseCase } from '@/usecase/session/delete-all-other-sessions-use-case'
import type { SessionListDataSource } from './session-list-data-source'
import { createSelfSessionListDataSource } from './session-list-data-source'

/** Status values for {@link SessionListScreenState}. */
export enum SessionListStatus {
  LOADING = 'loading',
  ERROR = 'error',
  CONTENT = 'content'
}

/** Discriminated union representing active screen state for session list screen. */
export type SessionListScreenState =
  | {
      status: SessionListStatus.LOADING
    }
  | {
      status: SessionListStatus.ERROR
      error: AppError
    }
  | {
      status: SessionListStatus.CONTENT
      items: UserSessionSummary[]
      currentSessionId: UserSessionId | null
      paging: PaginationState<UserSessionSummary>
      isFilterPanelExpanded: boolean
      actionLoading: boolean
      actionError: AppError | null
    }

/** Dependencies required to construct and run {@link SessionListStore}. */
export interface SessionListStoreDependencies {
  /** Target user ID if viewing user-specific sessions in management context. */
  userId?: string | null
  /** Data source wrapper handling use case execution. */
  dataSource?: SessionListDataSource
  /** Legacy use case to get paginated user sessions. */
  getSessionsUseCase?: GetSessionsUseCase
  /** Legacy use case to revoke a specific session. */
  deleteSessionUseCase?: DeleteSessionUseCase
  /** Legacy use case to revoke all sessions except the current one. */
  deleteAllOtherSessionsUseCase?: DeleteAllOtherSessionsUseCase
  /** Optional callback to navigate to a session detail screen. */
  onNavigateToSessionDetail?: (session: UserSessionSummary) => void
  /** Callback to navigate back to the previous screen. */
  onBack: () => void
  /** Optional auth storage instance to identify current session ID. */
  authStorage?: AuthStorage
  /** Initial parsed URL search parameters for fetching sessions. */
  searchParams?: Record<string, unknown>
  /**
   * Callback invoked when search parameters change requiring URL update.
   * Host application navigation should apply `replace: true` when navigating to prevent polluting browser history.
   */
  onSearchParamsChanged?: (params: Record<string, unknown>) => void
}

/** State and actions contract managed by {@link SessionListStore}. */
export interface SessionListStoreState {
  /** Current screen UI state. */
  screenState: SessionListScreenState
  /** Injected store dependencies. */
  dependencies: SessionListStoreDependencies
  /** Resolved data source instance. */
  dataSource: SessionListDataSource
  /** Initializes screen state by fetching first page of user sessions. */
  loadSessions: (searchParams?: Record<string, unknown>) => Promise<void>
  /** Re-initializes pagination with updated search parameters. */
  onSearchParamsUpdated: (searchParams?: Record<string, unknown>) => Promise<void>
  /** Triggers manual data refresh. */
  onRefresh: (searchParams?: Record<string, unknown>) => Promise<void>
  /** Handles click on a session item. */
  onSessionClick: (session: UserSessionSummary) => void
  /** Optimistically updates state to remove a revoked session. */
  onSessionRevoked: (sessionId: UserSessionId) => void
  /** Submits a request to revoke a specific session. */
  onRevokeSessionClick: (sessionId: UserSessionId) => Promise<void>
  /** Submits a request to revoke all other sessions. */
  onRevokeAllOtherSessionsClick: () => Promise<void>
  /** Loads next page of sessions if available. */
  onLoadNextPage: () => Promise<void>
  /** Handles click on the back button. */
  onBackClick: () => void
  /** Toggles filter panel expansion state. */
  onToggleFilterPanel: () => void
}

export type SessionListStore = ReturnType<typeof createSessionListStore>

/**
 * Factory function creating a Zustand store instance for the session list screen.
 *
 * @param deps - Injected store dependencies
 * @param initialState - Optional initial screen state override
 * @returns Initialized store instance
 */
export const createSessionListStore = (
  deps: SessionListStoreDependencies,
  initialState?: SessionListScreenState
) => {
  let isFetching = false

  const resolvedDataSource =
    deps.dataSource ??
    createSelfSessionListDataSource({
      getSessionsUseCase: deps.getSessionsUseCase!,
      deleteSessionUseCase: deps.deleteSessionUseCase,
      deleteAllOtherSessionsUseCase: deps.deleteAllOtherSessionsUseCase
    })

  const loadSessionsInternal = async (
    set: StoreApi<SessionListStoreState>['setState'],
    get: StoreApi<SessionListStoreState>['getState'],
    isRefresh = false,
    searchParams?: Record<string, unknown>
  ) => {
    if (isFetching) {
      return
    }
    const current = get().screenState
    if (!isRefresh && current.status === SessionListStatus.CONTENT) {
      return
    }
    isFetching = true

    try {
      const storedSessionIdRaw = deps.authStorage ? await deps.authStorage.getSessionId() : null
      const currentSessionId = storedSessionIdRaw ? toUserSessionIdOrNull(storedSessionIdRaw) : null

      const activeParams = searchParams ?? deps.searchParams
      const pageNumber = activeParams?.pageNumber ? Number(activeParams.pageNumber) : 1

      const sessionsResult = await resolvedDataSource.getSessions({
        pageNumber,
        userId: deps.userId
      })

      if (isSuccess(sessionsResult)) {
        const currentPaging =
          current.status === SessionListStatus.CONTENT
            ? current.paging
            : createInitialPaginationState<UserSessionSummary>()
        const nextPaging = appendResultToPaginationState(currentPaging, sessionsResult.data)
        set({
          screenState: {
            status: SessionListStatus.CONTENT,
            items: nextPaging.items,
            currentSessionId,
            paging: nextPaging,
            isFilterPanelExpanded: current.status === SessionListStatus.CONTENT ? current.isFilterPanelExpanded : false,
            actionLoading: false,
            actionError: null
          }
        })
      } else {
        set({
          screenState: {
            status: SessionListStatus.ERROR,
            error: sessionsResult.error
          }
        })
      }
    } finally {
      isFetching = false
    }
  }

  return createStore<SessionListStoreState>()((set, get) => ({
    dependencies: deps,
    dataSource: resolvedDataSource,
    screenState: initialState ?? { status: SessionListStatus.LOADING },

    loadSessions: async (searchParams) => {
      if (get().screenState.status !== SessionListStatus.CONTENT) {
        set({ screenState: { status: SessionListStatus.LOADING } })
      }
      await loadSessionsInternal(set, get, false, searchParams)
    },

    onSearchParamsUpdated: async (searchParams) => {
      set({ screenState: { status: SessionListStatus.LOADING } })
      await loadSessionsInternal(set, get, true, searchParams)
    },

    onRefresh: async (searchParams) => {
      const current = get().screenState
      if (current.status === SessionListStatus.CONTENT) {
        set({
          screenState: {
            ...current,
            actionLoading: true,
            actionError: null
          }
        })
      } else {
        set({ screenState: { status: SessionListStatus.LOADING } })
      }

      await loadSessionsInternal(set, get, true, searchParams)
    },

    onToggleFilterPanel: () => {
      const current = get().screenState
      if (current.status !== SessionListStatus.CONTENT) {
        return
      }

      set({
        screenState: {
          ...current,
          isFilterPanelExpanded: !current.isFilterPanelExpanded
        }
      })
    },

    onSessionClick: (session: UserSessionSummary) => {
      deps.onNavigateToSessionDetail?.(session)
    },

    onSessionRevoked: (sessionId: UserSessionId) => {
      const current = get().screenState
      if (current.status !== SessionListStatus.CONTENT) {
        return
      }

      const nextItems = current.items.filter((item) => item.id !== sessionId)
      set({
        screenState: {
          ...current,
          items: nextItems,
          paging: {
            ...current.paging,
            items: nextItems
          }
        }
      })
    },

    onRevokeSessionClick: async (sessionId: UserSessionId) => {
      const current = get().screenState
      if (current.status !== SessionListStatus.CONTENT || !resolvedDataSource.revokeSession) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const deleteSessionResult = await resolvedDataSource.revokeSession(sessionId)

      if (isSuccess(deleteSessionResult)) {
        await get().loadSessions()
      } else {
        set({
          screenState: {
            ...current,
            actionLoading: false,
            actionError: deleteSessionResult.error
          }
        })
      }
    },

    onRevokeAllOtherSessionsClick: async () => {
      const current = get().screenState
      if (current.status !== SessionListStatus.CONTENT || !resolvedDataSource.revokeAllOtherSessions) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const deleteAllSessionsResult = await resolvedDataSource.revokeAllOtherSessions()

      if (isSuccess(deleteAllSessionsResult)) {
        await get().loadSessions()
      } else {
        set({
          screenState: {
            ...current,
            actionLoading: false,
            actionError: deleteAllSessionsResult.error
          }
        })
      }
    },

    onLoadNextPage: async () => {
      const current = get().screenState
      if (current.status !== SessionListStatus.CONTENT || !canLoadMorePages(current.paging)) {
        return
      }

      const nextPage = getNextPageNumber(current.paging)

      set({
        screenState: {
          ...current,
          paging: createNextPageLoadingPaginationState(current.paging)
        }
      })

      deps.onSearchParamsChanged?.({ ...(deps.searchParams ?? {}), pageNumber: nextPage })

      const sessionsResult = await resolvedDataSource.getSessions({
        pageNumber: nextPage,
        userId: deps.userId
      })

      if (isSuccess(sessionsResult)) {
        const nextPaging = appendResultToPaginationState(current.paging, sessionsResult.data)
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

    onBackClick: () => {
      deps.onBack()
    }
  }))
}

const SessionListContext = createContext<SessionListStore | null>(null)

export interface SessionListProviderProps {
  dependencies: SessionListStoreDependencies
  initialState?: SessionListScreenState
  children: React.ReactNode
}

export const SessionListProvider: React.FC<SessionListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createSessionListStore(dependencies, initialState))

  return (
    <SessionListContext.Provider value={store}>
      {children}
    </SessionListContext.Provider>
  )
}

export const useSessionListStore = <T,>(
  selector: (state: SessionListStoreState) => T
): T => {
  const store = useContext(SessionListContext)
  if (!store) {
    throw new Error('useSessionListStore must be used within SessionListProvider')
  }
  return useStore(store, selector)
}
