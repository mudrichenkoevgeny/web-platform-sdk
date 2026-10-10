import React, { createContext, useContext, useState } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
import { toUserSessionIdOrNull } from '@mudrichenkoevgeny/shared-foundation'
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

export type SelfSessionListScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'error'
      error: AppError
    }
  | {
      status: 'content'
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
  const DEFAULT_PAGE_SIZE = 20
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
    if (!isRefresh && current.status === 'content') {
      return
    }
    isFetching = true

    try {
      const storedSessionIdRaw = deps.authStorage ? await deps.authStorage.getSessionId() : null
      const currentSessionId = storedSessionIdRaw ? toUserSessionIdOrNull(storedSessionIdRaw) : null

      const result = await deps.getSessionsUseCase.execute(1, DEFAULT_PAGE_SIZE)

      if (isSuccess(result)) {
        const currentPaging = current.status === 'content' ? current.paging : createInitialPaginationState<UserSessionSummary>()
        const nextPaging = appendResultToPaginationState(currentPaging, result.data)
        set({
          screenState: {
            status: 'content',
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
            status: 'error',
            error: result.error
          }
        })
      }
    } finally {
      isFetching = false
    }
  }

  return createStore<SelfSessionListStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },

    loadSessions: async () => {
      if (get().screenState.status !== 'content') {
        set({ screenState: { status: 'loading' } })
      }
      await loadSessionsInternal(set, get, false)
    },

    onRefresh: async () => {
      const current = get().screenState
      if (current.status === 'content') {
        set({
          screenState: {
            ...current,
            actionLoading: true,
            actionError: null
          }
        })
      } else {
        set({ screenState: { status: 'loading' } })
      }

      await loadSessionsInternal(set, get, true)
    },

    onSessionClick: (session: UserSessionSummary) => {
      deps.onNavigateToSessionDetail?.(session)
    },

    onSessionRevoked: (sessionId: UserSessionId) => {
      const current = get().screenState
      if (current.status !== 'content') {
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
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const result = await deps.deleteSessionUseCase.execute(sessionId)

      if (isSuccess(result)) {
        await get().loadSessions()
      } else {
        set({
          screenState: {
            ...current,
            actionLoading: false,
            actionError: result.error
          }
        })
      }
    },

    onRevokeAllOtherSessionsClick: async () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const result = await deps.deleteAllOtherSessionsUseCase.execute()

      if (isSuccess(result)) {
        await get().loadSessions()
      } else {
        set({
          screenState: {
            ...current,
            actionLoading: false,
            actionError: result.error
          }
        })
      }
    },

    onLoadNextPage: async () => {
      const current = get().screenState
      if (current.status !== 'content' || !canLoadMorePages(current.paging)) {
        return
      }

      const nextPage = getNextPageNumber(current.paging)

      set({
        screenState: {
          ...current,
          paging: createNextPageLoadingPaginationState(current.paging)
        }
      })

      const result = await deps.getSessionsUseCase.execute(nextPage, DEFAULT_PAGE_SIZE)

      if (isSuccess(result)) {
        const nextPaging = appendResultToPaginationState(current.paging, result.data)
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
