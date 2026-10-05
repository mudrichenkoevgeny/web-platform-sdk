import React, { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { LogoutUseCase } from '@/usecase/session/LogoutUseCase'
import type { RestoreUserUseCase } from '@/usecase/user/RestoreUserUseCase'
/**
 * State contract for {@link PendingDeletionScreen}.
 */
export interface PendingDeletionScreenState {
  /**
   * Shows overlay loading spinner while async action runs.
   */
  actionLoading: boolean
  /**
   * Action error from restore or logout attempt.
   */
  actionError: AppError | null
}

/**
 * Dependencies required for initializing {@link PendingDeletionStore}.
 */
export interface PendingDeletionStoreDependencies {
  /**
   * Use case for restoring account from pending deletion status.
   */
  restoreUserUseCase: RestoreUserUseCase
  /**
   * Use case for ending session and signing out.
   */
  logoutUseCase: LogoutUseCase
  /**
   * Callback invoked when account restoration succeeds.
   */
  onRestoreSuccess: () => void
  /**
   * Callback invoked when user chooses to sign out.
   */
  onSignOut: () => void
}

/**
 * State and action contract for {@link PendingDeletionStore}.
 */
export interface PendingDeletionStoreState {
  /**
   * Active reactive screen state.
   */
  screenState: PendingDeletionScreenState
  /**
   * Restores user account and proceeds into the app.
   */
  onRestoreAccountClick: () => Promise<void>
  /**
   * Signs out current user and returns to login entry point.
   */
  onSignOutClick: () => Promise<void>
}

/**
 * Type alias for the per-instance Zustand store.
 */
export type PendingDeletionStore = ReturnType<typeof createPendingDeletionStore>

/**
 * Instantiates a new isolated {@link PendingDeletionStore} for a screen instance.
 *
 * @param deps - Screen dependencies
 * @param initialState - Optional initial state override
 * @returns Vanilla Zustand store instance
 */
export const createPendingDeletionStore = (
  deps: PendingDeletionStoreDependencies,
  initialState?: PendingDeletionScreenState
) => {
  const defaultState: PendingDeletionScreenState = {
    actionLoading: false,
    actionError: null
  }

  return createStore<PendingDeletionStoreState>()((set, get) => ({
    screenState: initialState ?? defaultState,

    onRestoreAccountClick: async () => {
      const current = get().screenState
      if (current.actionLoading) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const result = await deps.restoreUserUseCase.execute()
      if (isSuccess(result)) {
        deps.onRestoreSuccess()
        set({
          screenState: {
            ...get().screenState,
            actionLoading: false
          }
        })
      } else {
        set({
          screenState: {
            ...get().screenState,
            actionLoading: false,
            actionError: result.error
          }
        })
      }
    },

    onSignOutClick: async () => {
      const current = get().screenState
      if (current.actionLoading) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      await deps.logoutUseCase.execute()
      deps.onSignOut()
      set({
        screenState: {
          ...get().screenState,
          actionLoading: false
        }
      })
    }
  }))
}

const PendingDeletionContext = createContext<PendingDeletionStore | null>(null)

/**
 * Props for {@link PendingDeletionProvider}.
 */
export interface PendingDeletionProviderProps {
  /** Dependencies for initializing the store. */
  dependencies: PendingDeletionStoreDependencies
  /** Optional initial state override. */
  initialState?: PendingDeletionScreenState
  /** React children. */
  children: React.ReactNode
}

/**
 * Context provider isolating {@link PendingDeletionStore} per component mount.
 */
export const PendingDeletionProvider: React.FC<PendingDeletionProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const storeRef = useRef<PendingDeletionStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = createPendingDeletionStore(dependencies, initialState)
  }

  return (
    <PendingDeletionContext.Provider value={storeRef.current}>
      {children}
    </PendingDeletionContext.Provider>
  )
}

/**
 * Custom hook to consume isolated {@link PendingDeletionStore} state.
 *
 * @param selector - State selector function
 * @returns Selected state slice
 */
export const usePendingDeletionStore = <T,>(
  selector: (state: PendingDeletionStoreState) => T
): T => {
  const store = useContext(PendingDeletionContext)
  if (!store) {
    throw new Error('usePendingDeletionStore must be used within PendingDeletionProvider')
  }
  return useStore(store, selector)
}
