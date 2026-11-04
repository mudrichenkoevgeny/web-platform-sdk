import React, { createContext, useContext, useState } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { ListingDefaultValues, selfSessionListParamsSchema, SortOrder, toUserSessionIdOrNull } from '@mudrichenkoevgeny/shared-foundation'
import type { UserSessionId } from '@mudrichenkoevgeny/shared-foundation'
import {
  appendResultToPaginationState,
  canLoadMorePages,
  createInitialPaginationState,
  createNextPageLoadingPaginationState,
  getNextPageNumber,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, PaginationState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { SelfSessionListParams, UserSessionSummary } from '@mudrichenkoevgeny/shared-foundation'
import type { GetSessionsUseCase } from '@/usecase/session/get-sessions-use-case'
import type { DeleteSessionUseCase } from '@/usecase/session/delete-session-use-case'
import type { DeleteAllOtherSessionsUseCase } from '@/usecase/session/delete-all-other-sessions-use-case'
import type { AuthStorage } from '@/storage/auth/auth-storage'

/** Status values for {@link SelfSessionListScreenState}. */
export enum SelfSessionListStatus {
  LOADING = 'loading',
  ERROR = 'error',
  CONTENT = 'content'
}

/** Discriminated union representing active screen state for self session list screen. */
export type SelfSessionListScreenState =
  | {
      status: SelfSessionListStatus.LOADING
    }
  | {
      status: SelfSessionListStatus.ERROR
      error: AppError
    }
  | {
      status: SelfSessionListStatus.CONTENT
      items: UserSessionSummary[]
      currentSessionId: UserSessionId | null
      paging: PaginationState<UserSessionSummary>
      actionLoading: boolean
      actionError: AppError | null
    }

/** Dependencies required to construct and run {@link SelfSessionListStore}. */
/** Dependencies required to construct and run {@link SelfSessionListStore}. */
export interface SelfSessionListStoreDependencies {
  /** Use case to get paginated user sessions. */
  getSessionsUseCase: GetSessionsUseCase
  /** Use case to revoke a specific session. */
  deleteSessionUseCase: DeleteSessionUseCase
  /** Use case to revoke all sessions except the current one. */
  deleteAllOtherSessionsUseCase: DeleteAllOtherSessionsUseCase
  /** Optional callback to navigate to a session detail screen. */
  onNavigateToSessionDetail?: (session: UserSessionSummary) => void
  /** Callback to navigate back to the previous screen. */
  onBack: () => void
  /** Optional auth storage instance to identify current session ID. */
  authStorage?: AuthStorage
  /** Initial parsed URL search parameters for fetching sessions. */
  searchParams?: SelfSessionListParams
  /** Callback invoked when search parameters change requiring URL update. */
  onSearchParamsChanged?: (params: SelfSessionListParams) => void
}

/** State and actions contract managed by {@link SelfSessionListStore}. */
export interface SelfSessionListStoreState {
  /** Current screen UI state. */
  screenState: SelfSessionListScreenState
  /** Initializes screen state by fetching first page of user sessions. */
  loadSessions: () => Promise<void>
  /** Triggers manual data refresh. */
  onRefresh: () => Promise<void>
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
}

export type SelfSessionListStore = ReturnType<typeof createSelfSessionListStore>

/**
 * Factory function creating a Zustand store instance for the self session list screen.
 *
 * @param deps - Injected store dependencies
 * @param initialState - Optional initial screen state override
 * @returns Initialized store instance
 */
export const createSelfSessionListStore = (
  deps: SelfSessionListStoreDependencies,
  initialState?: SelfSessionListScreenState
) => {
  const DEFAULT_PAGE_SIZE = ListingDefaultValues.PAGE_SIZE
  let isFetching = false

  const loadSessionsInternal = async (
    set: StoreApi<SelfSessionListStoreState>['setState'],
    get: StoreApi<SelfSessionListStoreState>['getState'],
    isRefresh = false
  ) => {
    if (isFetching) {
      return
    }
    const current = get().screenState
    if (!isRefresh && current.status === SelfSessionListStatus.CONTENT) {
      return
    }
    isFetching = true

    try {
      const storedSessionIdRaw = deps.authStorage ? await deps.authStorage.getSessionId() : null
      const currentSessionId = storedSessionIdRaw ? toUserSessionIdOrNull(storedSessionIdRaw) : null

      const pageNumber = deps.searchParams?.pageNumber ?? 1
      const sessionsResult = await deps.getSessionsUseCase.execute(
        selfSessionListParamsSchema.parse({
          pageNumber,
          pageSize: deps.searchParams?.pageSize ?? DEFAULT_PAGE_SIZE,
          sortBy: 'created_at',
          sortOrder: SortOrder.DESC,
          identifiers: [],
          identifierIds: [],
          userAuthProviders: [],
          clientTypes: [],
          userAgents: [],
          ipAddresses: [],
          languages: [],
          deviceIds: [],
          deviceNames: [],
          appVersions: [],
          osVersions: []
        })
      )

      if (isSuccess(sessionsResult)) {
        const currentPaging = current.status === SelfSessionListStatus.CONTENT ? current.paging : createInitialPaginationState<UserSessionSummary>()
        const nextPaging = appendResultToPaginationState(currentPaging, sessionsResult.data)
        set({
          screenState: {
            status: SelfSessionListStatus.CONTENT,
            items: nextPaging.items,
            currentSessionId,
            paging: nextPaging,
            actionLoading: false,
            actionError: null
          }
        })
      } else {
        set({
          screenState: {
            status: SelfSessionListStatus.ERROR,
            error: sessionsResult.error
          }
        })
      }
    } finally {
      isFetching = false
    }
  }

  return createStore<SelfSessionListStoreState>()((set, get) => ({
    screenState: initialState ?? { status: SelfSessionListStatus.LOADING },

    loadSessions: async () => {
      if (get().screenState.status !== SelfSessionListStatus.CONTENT) {
        set({ screenState: { status: SelfSessionListStatus.LOADING } })
      }
      await loadSessionsInternal(set, get, false)
    },

    onRefresh: async () => {
      const current = get().screenState
      if (current.status === SelfSessionListStatus.CONTENT) {
        set({
          screenState: {
            ...current,
            actionLoading: true,
            actionError: null
          }
        })
      } else {
        set({ screenState: { status: SelfSessionListStatus.LOADING } })
      }

      await loadSessionsInternal(set, get, true)
    },

    onSessionClick: (session: UserSessionSummary) => {
      deps.onNavigateToSessionDetail?.(session)
    },

    onSessionRevoked: (sessionId: UserSessionId) => {
      const current = get().screenState
      if (current.status !== SelfSessionListStatus.CONTENT) {
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
      if (current.status !== SelfSessionListStatus.CONTENT) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const deleteSessionResult = await deps.deleteSessionUseCase.execute(sessionId)

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
      if (current.status !== SelfSessionListStatus.CONTENT) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const deleteAllSessionsResult = await deps.deleteAllOtherSessionsUseCase.execute()

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
      if (current.status !== SelfSessionListStatus.CONTENT || !canLoadMorePages(current.paging)) {
        return
      }

      const nextPage = getNextPageNumber(current.paging)

      set({
        screenState: {
          ...current,
          paging: createNextPageLoadingPaginationState(current.paging)
        }
      })

      deps.onSearchParamsChanged?.({ pageNumber: nextPage, pageSize: deps.searchParams?.pageSize ?? DEFAULT_PAGE_SIZE })

      const sessionsResult = await deps.getSessionsUseCase.execute(
        selfSessionListParamsSchema.parse({
          pageNumber: nextPage,
          pageSize: deps.searchParams?.pageSize ?? DEFAULT_PAGE_SIZE,
          sortBy: 'created_at',
          sortOrder: SortOrder.DESC,
          identifiers: [],
          identifierIds: [],
          userAuthProviders: [],
          clientTypes: [],
          userAgents: [],
          ipAddresses: [],
          languages: [],
          deviceIds: [],
          deviceNames: [],
          appVersions: [],
          osVersions: []
        })
      )

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

const SelfSessionListContext = createContext<SelfSessionListStore | null>(null)

export interface SelfSessionListProviderProps {
  dependencies: SelfSessionListStoreDependencies
  initialState?: SelfSessionListScreenState
  children: React.ReactNode
}

export const SelfSessionListProvider: React.FC<SelfSessionListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createSelfSessionListStore(dependencies, initialState))

  return (
    <SelfSessionListContext.Provider value={store}>
      {children}
    </SelfSessionListContext.Provider>
  )
}

export const useSelfSessionListStore = <T,>(
  selector: (state: SelfSessionListStoreState) => T
): T => {
  const store = useContext(SelfSessionListContext)
  if (!store) {
    throw new Error('useSelfSessionListStore must be used within SelfSessionListProvider')
  }
  return useStore(store, selector)
}
