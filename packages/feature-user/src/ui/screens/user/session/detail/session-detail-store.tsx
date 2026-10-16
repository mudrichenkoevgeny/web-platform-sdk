import React, { createContext, useContext, useState, useEffect } from 'react'
import { createStore, useStore } from 'zustand'
import { toUserSessionIdOrNull } from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifierId, UserId, UserSessionId, UserSessionPrivate } from "@mudrichenkoevgeny/shared-foundation"
import { CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common"
import type { AuthStorage } from '@/storage/auth/auth-storage'
/**
 * Discriminated union representing active screen state for {@link SessionDetailScreen}.
 */
export type SessionDetailScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'error'
      error: AppError
    }
  | {
      status: 'content'
      session: UserSessionPrivate
      isCurrentSession: boolean
      actionLoading: boolean
      actionError: AppError | null
    }

/**
 * Dependencies required to construct and run {@link SessionDetailStore}.
 */
export interface SessionDetailStoreDependencies {
  session?: UserSessionPrivate
  sessionId?: UserSessionId
  getSessionUseCase?: { execute: (sessionId: UserSessionId) => Promise<AppResult<UserSessionPrivate, AppError>> }
  deleteSessionUseCase?: { execute: (sessionId: UserSessionId) => Promise<AppResult<void, AppError>> }
  isCurrentSession?: boolean
  currentUserId?: UserId | null
  authStorage?: AuthStorage
  onSessionRevoked?: (sessionId: UserSessionId) => void
  onNavigateToIdentifierDetail?: (identifierId: UserIdentifierId) => void
  onNavigateToUserDetail?: (userId: UserId) => void
  onNavigateToProfile?: () => void
  onBack: () => void
}

/**
 * State and actions managed by {@link SessionDetailStore}.
 */
export interface SessionDetailStoreState {
  dependencies: SessionDetailStoreDependencies
  screenState: SessionDetailScreenState
  initializeSession: () => Promise<void>
  onRevokeSessionClick: () => Promise<void>
  onRetry: () => void
  onBackClick: () => void
  onIdentifierClick: () => void
  onUserClick: () => void
}

export type SessionDetailStore = ReturnType<typeof createSessionDetailStore>

/**
 * Factory function creating a Zustand store instance for {@link SessionDetailScreen}.
 */
export const createSessionDetailStore = (
  deps: SessionDetailStoreDependencies,
  initialState?: SessionDetailScreenState
) => {
  let isFetching = false

  const store = createStore<SessionDetailStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: 'loading' },

    initializeSession: async () => {
      const current = get().screenState
      if (isFetching || current.status === 'content') {
        return
      }
      isFetching = true

      try {
        const activeDeps = get().dependencies
        const targetId = activeDeps.sessionId ?? activeDeps.session?.id
        const storedSessionIdRaw = activeDeps.authStorage ? await activeDeps.authStorage.getSessionId() : null
        const activeSessionId = storedSessionIdRaw ? toUserSessionIdOrNull(storedSessionIdRaw) : null
        const resolvedIsCurrentSession = activeDeps.isCurrentSession ?? (targetId != null && targetId === activeSessionId)

        if (activeDeps.session) {
          set({
            screenState: {
              status: 'content',
              session: activeDeps.session,
              isCurrentSession: resolvedIsCurrentSession,
              actionLoading: false,
              actionError: null
            }
          })
          return
        }

        if (targetId && activeDeps.getSessionUseCase) {
          set({ screenState: { status: 'loading' } })
          const result = await activeDeps.getSessionUseCase.execute(targetId)

          if (isSuccess(result)) {
            set({
              screenState: {
                status: 'content',
                session: result.data,
                isCurrentSession: resolvedIsCurrentSession,
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
        } else {
          set({
            screenState: {
              status: 'error',
              error: CommonError.unknown()
            }
          })
        }
      } finally {
        isFetching = false
      }
    },

    onRevokeSessionClick: async () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      const activeDeps = get().dependencies
      const targetSessionId = current.session.id
      if (!targetSessionId) {
        return
      }
      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      if (activeDeps.deleteSessionUseCase) {
        const result = await activeDeps.deleteSessionUseCase.execute(targetSessionId)
        if (isSuccess(result)) {
          activeDeps.onSessionRevoked?.(targetSessionId)
          activeDeps.onBack()
        } else {
          set({
            screenState: {
              ...current,
              actionLoading: false,
              actionError: result.error
            }
          })
        }
      } else {
        activeDeps.onSessionRevoked?.(targetSessionId)
        activeDeps.onBack()
      }
    },

    onRetry: () => {
      get().initializeSession()
    },

    onBackClick: () => {
      get().dependencies.onBack()
    },

    onIdentifierClick: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }
      get().dependencies.onNavigateToIdentifierDetail?.(current.session.identifierId)
    },

    onUserClick: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }
      const activeDeps = get().dependencies
      if (current.isCurrentSession || (activeDeps.currentUserId != null && current.session.userId === activeDeps.currentUserId)) {
        activeDeps.onNavigateToProfile?.()
      } else {
        activeDeps.onNavigateToUserDetail?.(current.session.userId)
      }
    }
  }))

  return store
}

const SessionDetailContext = createContext<SessionDetailStore | null>(null)

/**
 * Props for {@link SessionDetailProvider}.
 */
export interface SessionDetailProviderProps {
  dependencies: SessionDetailStoreDependencies
  initialState?: SessionDetailScreenState
  children: React.ReactNode
}

/**
 * React Context Provider for {@link SessionDetailStore}.
 */
export const SessionDetailProvider: React.FC<SessionDetailProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createSessionDetailStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <SessionDetailContext.Provider value={store}>
      {children}
    </SessionDetailContext.Provider>
  )
}

/**
 * Custom hook to select state from {@link SessionDetailStore}.
 */
export const useSessionDetailStore = <T,>(
  selector: (state: SessionDetailStoreState) => T
): T => {
  const store = useContext(SessionDetailContext)
  if (!store) {
    throw new Error('useSessionDetailStore must be used within SessionDetailProvider')
  }
  return useStore(store, selector)
}
