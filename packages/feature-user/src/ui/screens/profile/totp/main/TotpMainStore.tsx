import React, { createContext, useContext, useEffect, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import { CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { TotpSetup } from '@mudrichenkoevgeny/shared-foundation'
import type { UserRepository } from '@/repository/user/UserRepository'
import type { SetupTotpUseCase } from '@/usecase/user/security/SetupTotpUseCase'
import type { EnableTotpUseCase } from '@/usecase/user/security/EnableTotpUseCase'
import type { DisableTotpUseCase } from '@/usecase/user/security/DisableTotpUseCase'
/**
 * Discriminated union representing active screen state for {@link TotpMainScreen}.
 */
export type TotpMainScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'disabled'
      actionLoading: boolean
      actionError: AppError | null
    }
  | {
      status: 'setupInProgress'
      setup: TotpSetup
      code: string
      canConfirm: boolean
      actionLoading: boolean
      actionError: AppError | null
    }
  | {
      status: 'enabled'
      showDisableConfirmation: boolean
      actionLoading: boolean
      actionError: AppError | null
    }
  | {
      status: 'error'
      error: AppError
    }

/**
 * Dependencies required to construct and run {@link TotpMainStore}.
 */
export interface TotpMainStoreDependencies {
  userRepository: UserRepository
  setupTotpUseCase: SetupTotpUseCase
  enableTotpUseCase: EnableTotpUseCase
  disableTotpUseCase: DisableTotpUseCase
  onNavigateToRecoveryCodes: () => void
  onBack: () => void
}

/**
 * State and actions managed by {@link TotpMainStore}.
 */
export interface TotpMainStoreState {
  screenState: TotpMainScreenState
  onSetupClick: () => Promise<void>
  onCodeChanged: (code: string) => void
  onConfirmSetupClick: () => Promise<void>
  onRecoveryCodesClick: () => void
  onDisableClick: () => void
  onConfirmDisable: () => Promise<void>
  onDismissDialogs: () => void
  onBackClick: () => void
}

export type TotpMainStore = ReturnType<typeof createTotpMainStore>

/**
 * Factory function creating a Zustand store instance for {@link TotpMainScreen}.
 */
export const createTotpMainStore = (
  deps: TotpMainStoreDependencies,
  initialState?: TotpMainScreenState
) => {
  const store = createStore<TotpMainStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },

    onSetupClick: async () => {
      const current = get().screenState
      if (current.status !== 'disabled') {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const result = await deps.setupTotpUseCase.execute()

      if (isSuccess(result)) {
        set({
          screenState: {
            status: 'setupInProgress',
            setup: result.data,
            code: '',
            canConfirm: false,
            actionLoading: false,
            actionError: null
          }
        })
      } else {
        set({
          screenState: {
            status: 'disabled',
            actionLoading: false,
            actionError: result.error
          }
        })
      }
    },

    onCodeChanged: (code: string) => {
      const current = get().screenState
      if (current.status !== 'setupInProgress') {
        return
      }

      const isValidCode = code.length === 6 && /^\d+$/.test(code)

      set({
        screenState: {
          ...current,
          code,
          canConfirm: isValidCode && !current.actionLoading,
          actionError: null
        }
      })
    },

    onConfirmSetupClick: async () => {
      const current = get().screenState
      if (current.status !== 'setupInProgress' || !current.canConfirm) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null,
          canConfirm: false
        }
      })

      const result = await deps.enableTotpUseCase.execute(current.setup.mfaToken, current.code)

      if (isSuccess(result)) {
        await deps.userRepository.refreshCurrentUser()
        deps.onNavigateToRecoveryCodes()
      } else {
        const isValidCode = current.code.length === 6 && /^\d+$/.test(current.code)
        set({
          screenState: {
            ...current,
            actionLoading: false,
            actionError: result.error,
            canConfirm: isValidCode
          }
        })
      }
    },

    onRecoveryCodesClick: () => {
      deps.onNavigateToRecoveryCodes()
    },

    onDisableClick: () => {
      const current = get().screenState
      if (current.status !== 'enabled') {
        return
      }
      set({
        screenState: {
          ...current,
          showDisableConfirmation: true
        }
      })
    },

    onConfirmDisable: async () => {
      const current = get().screenState
      if (current.status !== 'enabled') {
        return
      }

      set({
        screenState: {
          ...current,
          showDisableConfirmation: false,
          actionLoading: true,
          actionError: null
        }
      })

      const result = await deps.disableTotpUseCase.execute()

      if (isSuccess(result)) {
        await deps.userRepository.refreshCurrentUser()
        set({
          screenState: {
            status: 'disabled',
            actionLoading: false,
            actionError: null
          }
        })
      } else {
        set({
          screenState: {
            status: 'enabled',
            showDisableConfirmation: false,
            actionLoading: false,
            actionError: result.error
          }
        })
      }
    },

    onDismissDialogs: () => {
      const current = get().screenState
      if (current.status !== 'enabled') {
        return
      }
      set({
        screenState: {
          ...current,
          showDisableConfirmation: false
        }
      })
    },

    onBackClick: () => {
      deps.onBack()
    }
  }))

  return store
}

const TotpMainContext = createContext<TotpMainStore | null>(null)

/**
 * Props for {@link TotpMainProvider}.
 */
export interface TotpMainProviderProps {
  dependencies: TotpMainStoreDependencies
  initialState?: TotpMainScreenState
  children: React.ReactNode
}

/**
 * React Context Provider for {@link TotpMainStore}.
 */
export const TotpMainProvider: React.FC<TotpMainProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const storeRef = useRef<TotpMainStore | undefined>(undefined)
  if (!storeRef.current) {
    storeRef.current = createTotpMainStore(dependencies, initialState)
  }

  useEffect(() => {
    if (initialState) {
      return
    }
    const unsubscribe = dependencies.userRepository.observeCurrentUser((user) => {
      if (!user) {
        storeRef.current?.setState({
          screenState: {
            status: 'error',
            error: CommonError.unknown()
          }
        })
      } else if (user.isTotpEnabled) {
        storeRef.current?.setState({
          screenState: {
            status: 'enabled',
            showDisableConfirmation: false,
            actionLoading: false,
            actionError: null
          }
        })
      } else {
        const current = storeRef.current?.getState().screenState
        if (current?.status !== 'setupInProgress') {
          storeRef.current?.setState({
            screenState: {
              status: 'disabled',
              actionLoading: false,
              actionError: null
            }
          })
        }
      }
    })
    return () => unsubscribe()
  }, [dependencies, initialState])

  return (
    <TotpMainContext.Provider value={storeRef.current}>
      {children}
    </TotpMainContext.Provider>
  )
}

/**
 * Custom hook to select state from {@link TotpMainStore}.
 */
export const useTotpMainStore = <T,>(selector: (state: TotpMainStoreState) => T): T => {
  const store = useContext(TotpMainContext)
  if (!store) {
    throw new Error('useTotpMainStore must be used within TotpMainProvider')
  }
  return useStore(store, selector)
}
