import React, { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import { toUserSessionIdOrNull } from '@mudrichenkoevgeny/shared-foundation'
import type { UserSessionId } from "@mudrichenkoevgeny/shared-foundation";
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { UserSession } from '@mudrichenkoevgeny/shared-foundation'
import type { GetSessionsUseCase } from '@/usecase/session/GetSessionsUseCase'
import type { DeleteSessionUseCase } from '@/usecase/session/DeleteSessionUseCase'
import type { DeleteAllOtherSessionsUseCase } from '@/usecase/session/DeleteAllOtherSessionsUseCase'
import type { AuthStorage } from '@/storage/auth/AuthStorage'
/**
 * Discriminated union representing active screen state for {@link SelfSessionListScreen}.
 */
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
      items: UserSession[]
      currentSessionId: UserSessionId | null
      pageNumber: number
      hasMorePages: boolean
      isNextPageLoading: boolean
      actionLoading: boolean
      actionError: AppError | null
    }

/**
 * Dependencies required to construct and run {@link SelfSessionListStore}.
 */
export interface SelfSessionListStoreDependencies {
  getSessionsUseCase: GetSessionsUseCase
  deleteSessionUseCase: DeleteSessionUseCase
  deleteAllOtherSessionsUseCase: DeleteAllOtherSessionsUseCase
  onNavigateToSessionDetail?: (session: UserSession) => void
  onBack: () => void
  authStorage?: AuthStorage
}

/**
 * State and actions managed by {@link SelfSessionListStore}.
 */
export interface SelfSessionListStoreState {
  screenState: SelfSessionListScreenState
  loadSessions: () => Promise<void>
  onRefresh: () => Promise<void>
  onSessionClick: (session: UserSession) => void
  onSessionRevoked: (sessionId: UserSessionId) => void
  onRevokeSessionClick: (sessionId: UserSessionId) => Promise<void>
  onRevokeAllOtherSessionsClick: () => Promise<void>
  onLoadNextPage: () => Promise<void>
  onBackClick: () => void
}

export type SelfSessionListStore = ReturnType<typeof createSelfSessionListStore>

/**
 * Factory function creating a Zustand store instance for {@link SelfSessionListScreen}.
 */
export const createSelfSessionListStore = (
  deps: SelfSessionListStoreDependencies,
  initialState?: SelfSessionListScreenState
) => {
  const DEFAULT_PAGE_SIZE = 20

  const store = createStore<SelfSessionListStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },

    loadSessions: async () => {
      const storedSessionIdRaw = deps.authStorage ? await deps.authStorage.getSessionId() : null
      const currentSessionId = storedSessionIdRaw ? toUserSessionIdOrNull(storedSessionIdRaw) : null

      const result = await deps.getSessionsUseCase.execute(1, DEFAULT_PAGE_SIZE)

      if (isSuccess(result)) {
        const page = result.data
        set({
          screenState: {
            status: 'content',
            items: page.items,
            currentSessionId,
            pageNumber: 1,
            hasMorePages: page.items.length < page.totalCount,
            isNextPageLoading: false,
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

      await get().loadSessions()
    },

    onSessionClick: (session: UserSession) => {
      deps.onNavigateToSessionDetail?.(session)
    },

    onSessionRevoked: (sessionId: UserSessionId) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          items: current.items.filter((item) => item.id !== sessionId)
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
      if (current.status !== 'content' || !current.hasMorePages || current.isNextPageLoading) {
        return
      }

      const nextPage = current.pageNumber + 1

      set({
        screenState: {
          ...current,
          isNextPageLoading: true
        }
      })

      const result = await deps.getSessionsUseCase.execute(nextPage, DEFAULT_PAGE_SIZE)

      if (isSuccess(result)) {
        const page = result.data
        const combined = [...current.items, ...page.items]
        set({
          screenState: {
            ...current,
            items: combined,
            pageNumber: nextPage,
            hasMorePages: combined.length < page.totalCount,
            isNextPageLoading: false
          }
        })
      } else {
        set({
          screenState: {
            ...current,
            isNextPageLoading: false
          }
        })
      }
    },

    onBackClick: () => {
      deps.onBack()
    }
  }))

  if (!initialState) {
    store.getState().loadSessions()
  }

  return store
}

const SelfSessionListContext = createContext<SelfSessionListStore | null>(null)

/**
 * Props for {@link SelfSessionListProvider}.
 */
export interface SelfSessionListProviderProps {
  dependencies: SelfSessionListStoreDependencies
  initialState?: SelfSessionListScreenState
  children: React.ReactNode
}

/**
 * React Context Provider for {@link SelfSessionListStore}.
 */
export const SelfSessionListProvider: React.FC<SelfSessionListProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const storeRef = useRef<SelfSessionListStore | undefined>(undefined)
  if (!storeRef.current) {
    storeRef.current = createSelfSessionListStore(dependencies, initialState)
  }

  return (
    <SelfSessionListContext.Provider value={storeRef.current}>
      {children}
    </SelfSessionListContext.Provider>
  )
}

/**
 * Custom hook to select state from {@link SelfSessionListStore}.
 */
export const useSelfSessionListStore = <T,>(
  selector: (state: SelfSessionListStoreState) => T
): T => {
  const store = useContext(SelfSessionListContext)
  if (!store) {
    throw new Error('useSelfSessionListStore must be used within SelfSessionListProvider')
  }
  return useStore(store, selector)
}
