import React, { createContext, useContext, useState, useEffect } from 'react'
import { createStore, useStore } from 'zustand'
import { toUserSessionIdOrNull } from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifierId, UserId, UserSessionId, UserSessionPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AuthStorage } from '@/storage/auth/auth-storage'

/** Discriminated union representing active screen state for {@link SessionDetailScreen}. */
export type SessionDetailScreenState =
  | {
      /** Loading state while user session details are being fetched. */
      status: 'loading'
    }
  | {
      /** Error state when loading user session details failed. */
      status: 'error'
      /** Error instance describing the failure. */
      error: AppError
    }
  | {
      /** Content state containing user session private details. */
      status: 'content'
      /** User session private details model. */
      session: UserSessionPrivate
      /** Whether this session is the active session. */
      isCurrentSession: boolean
      /** Whether a background revocation action is currently loading. */
      actionLoading: boolean
      /** Action error instance if revocation failed. */
      actionError: AppError | null
    }

/** Dependencies required to construct and run {@link SessionDetailStore}. */
export interface SessionDetailStoreDependencies {
  /** Optional preloaded session private details. */
  session?: UserSessionPrivate
  /** Optional target session ID to fetch. */
  sessionId?: UserSessionId
  /** Use case for loading user session details. */
  getSessionUseCase?: { execute: (sessionId: UserSessionId) => Promise<AppResult<UserSessionPrivate, AppError>> }
  /** Use case for deleting/revoking a user session. */
  deleteSessionUseCase?: { execute: (sessionId: UserSessionId) => Promise<AppResult<void, AppError>> }
  /** Explicit override flag indicating if this is the active session. */
  isCurrentSession?: boolean
  /** Currently authenticated user ID. */
  currentUserId?: UserId | null
  /** Auth storage instance for inspecting active session ID. */
  authStorage?: AuthStorage
  /** Callback when session is revoked successfully. */
  onSessionRevoked?: (sessionId: UserSessionId) => void
  /** Navigation callback to identifier detail screen. */
  onNavigateToIdentifierDetail?: (identifierId: UserIdentifierId) => void
  /** Navigation callback to user detail screen. */
  onNavigateToUserDetail?: (userId: UserId) => void
  /** Navigation callback to user profile screen. */
  onNavigateToProfile?: () => void
  /** Navigation callback to return to previous screen. */
  onBack: () => void
}

/** State and actions managed by {@link SessionDetailStore}. */
export interface SessionDetailStoreState {
  /** Injected store dependencies. */
  dependencies: SessionDetailStoreDependencies
  /** Current screen UI state. */
  screenState: SessionDetailScreenState
  /** Initializes session details. */
  initializeSession: () => Promise<void>
  /** Confirms and executes session revocation. */
  onRevokeSessionClick: () => Promise<void>
  /** Retries loading session details after failure. */
  onRetry: () => void
  /** Handles back navigation button click. */
  onBackClick: () => void
  /** Handles click on associated identifier. */
  onIdentifierClick: () => void
  /** Handles click on associated user. */
  onUserClick: () => void
}

/** Type alias for Zustand store instance returned by {@link createSessionDetailStore}. */
export type SessionDetailStore = ReturnType<typeof createSessionDetailStore>

/**
 * Factory function creating a Zustand store instance for {@link SessionDetailScreen}.
 *
 * @param deps - Injected store dependencies
 * @param initialState - Optional initial screen state override
 * @returns Initialized store instance
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

        if (activeDeps.session) {
          const isSelfActiveSession =
            activeDeps.isCurrentSession ?? (activeSessionId != null && activeDeps.session.id === activeSessionId)

          set({
            screenState: {
              status: 'content',
              session: activeDeps.session,
              isCurrentSession: isSelfActiveSession,
              actionLoading: false,
              actionError: null
            }
          })
          return
        }

        if (targetId && activeDeps.getSessionUseCase) {
          set({ screenState: { status: 'loading' } })
          const sessionResult = await activeDeps.getSessionUseCase.execute(targetId)

          if (isSuccess(sessionResult)) {
            const loadedSession = sessionResult.data
            const isSelfActiveSession =
              activeDeps.isCurrentSession ?? (activeSessionId != null && loadedSession.id === activeSessionId)

            set({
              screenState: {
                status: 'content',
                session: loadedSession,
                isCurrentSession: isSelfActiveSession,
                actionLoading: false,
                actionError: null
              }
            })
          } else {
            set({
              screenState: {
                status: 'error',
                error: sessionResult.error
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
        const deleteSessionResult = await activeDeps.deleteSessionUseCase.execute(targetSessionId)
        if (isSuccess(deleteSessionResult)) {
          activeDeps.onSessionRevoked?.(targetSessionId)
          activeDeps.onBack()
        } else {
          set({
            screenState: {
              ...current,
              actionLoading: false,
              actionError: deleteSessionResult.error
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
      if (activeDeps.onNavigateToUserDetail) {
        activeDeps.onNavigateToUserDetail(current.session.userId)
      } else {
        activeDeps.onNavigateToProfile?.()
      }
    }
  }))

  return store
}

const SessionDetailContext = createContext<SessionDetailStore | null>(null)

/** Props for {@link SessionDetailProvider}. */
export interface SessionDetailProviderProps {
  /** Injected dependencies. */
  dependencies: SessionDetailStoreDependencies
  /** Optional initial state override. */
  initialState?: SessionDetailScreenState
  /** React child nodes. */
  children: React.ReactNode
}

/** React Context Provider for {@link SessionDetailStore}. */
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

/** Custom hook to select state from {@link SessionDetailStore}. */
export const useSessionDetailStore = <T,>(
  selector: (state: SessionDetailStoreState) => T
): T => {
  const store = useContext(SessionDetailContext)
  if (!store) {
    throw new Error('useSessionDetailStore must be used within SessionDetailProvider')
  }
  return useStore(store, selector)
}
