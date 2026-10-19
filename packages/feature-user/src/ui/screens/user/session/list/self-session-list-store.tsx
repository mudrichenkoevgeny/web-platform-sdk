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
import type { UserSessionSummary } from '@mudrichenkoevgeny/shared-foundation'
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

export interface SelfSessionListStoreDependencies {
  getSessionsUseCase: GetSessionsUseCase
  deleteSessionUseCase: DeleteSessionUseCase
  deleteAllOtherSessionsUseCase: DeleteAllOtherSessionsUseCase
  onNavigateToSessionDetail?: (session: UserSessionSummary) => void
  onBack: () => void
  authStorage?: AuthStorage
}

export interface SelfSessionListStoreState {
  screenState: SelfSessionListScreenState
  loadSessions: () => Promise<void>
  onRefresh: () => Promise<void>
  onSessionClick: (session: UserSessionSummary) => void
  onSessionRevoked: (sessionId: UserSessionId) => void
  onRevokeSessionClick: (sessionId: UserSessionId) => Promise<void>
  onRevokeAllOtherSessionsClick: () => Promise<void>
  onLoadNextPage: () => Promise<void>
  onBackClick: () => void
}

export type SelfSessionListStore = ReturnType<typeof createSelfSessionListStore>

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

      const sessionsResult = await deps.getSessionsUseCase.execute(
        selfSessionListParamsSchema.parse({
          pageNumber: 1,
          pageSize: DEFAULT_PAGE_SIZE,
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

      const sessionsResult = await deps.getSessionsUseCase.execute(
        selfSessionListParamsSchema.parse({
          pageNumber: nextPage,
          pageSize: DEFAULT_PAGE_SIZE,
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
