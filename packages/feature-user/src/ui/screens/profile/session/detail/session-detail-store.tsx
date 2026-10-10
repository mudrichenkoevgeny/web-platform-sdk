import React, { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import { toUserSessionIdOrNull } from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifierId, UserId, UserSessionId } from "@mudrichenkoevgeny/shared-foundation";
import { CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { UserSessionPrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { GetSessionUseCase } from '@/usecase/session/get-session-use-case'
import type { DeleteSessionUseCase } from '@/usecase/session/delete-session-use-case'
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
  getSessionUseCase?: GetSessionUseCase
  deleteSessionUseCase?: DeleteSessionUseCase
  isCurrentSession?: boolean
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
    screenState: initialState ?? { status: 'loading' },

    initializeSession: async () => {
      const current = get().screenState
      if (isFetching || current.status === 'content') {
        return
      }
      isFetching = true

      try {
        const targetId = deps.sessionId ?? deps.session?.id
        const storedSessionIdRaw = deps.authStorage ? await deps.authStorage.getSessionId() : null
        const activeSessionId = storedSessionIdRaw ? toUserSessionIdOrNull(storedSessionIdRaw) : null
        const resolvedIsCurrentSession = deps.isCurrentSession ?? (targetId != null && targetId === activeSessionId)

        if (deps.session) {
          set({
            screenState: {
              status: 'content',
              session: deps.session,
              isCurrentSession: resolvedIsCurrentSession,
              actionLoading: false,
              actionError: null
            }
          })
          return
        }

        if (targetId && deps.getSessionUseCase) {
          set({ screenState: { status: 'loading' } })
          const result = await deps.getSessionUseCase.execute(targetId)

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

      const targetSessionId = current.session.id
      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      if (deps.deleteSessionUseCase) {
        const result = await deps.deleteSessionUseCase.execute(targetSessionId)
        if (isSuccess(result)) {
          deps.onSessionRevoked?.(targetSessionId)
          deps.onBack()
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
        deps.onSessionRevoked?.(targetSessionId)
        deps.onBack()
      }
    },

    onRetry: () => {
      get().initializeSession()
    },

    onBackClick: () => {
      deps.onBack()
    },

    onIdentifierClick: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }
      deps.onNavigateToIdentifierDetail?.(current.session.identifierId)
    },

    onUserClick: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }
      if (current.isCurrentSession) {
        deps.onNavigateToProfile?.()
      } else {
        deps.onNavigateToUserDetail?.(current.session.userId)
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
  const storeRef = useRef<SessionDetailStore | undefined>(undefined)
  if (!storeRef.current) {
    storeRef.current = createSessionDetailStore(dependencies, initialState)
  }

  return (
    <SessionDetailContext.Provider value={storeRef.current}>
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
