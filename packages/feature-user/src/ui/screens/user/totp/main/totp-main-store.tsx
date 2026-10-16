import React, { createContext, useContext, useEffect, useState } from 'react'
import { createStore, useStore } from 'zustand'
import { CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { TotpSetup } from '@mudrichenkoevgeny/shared-foundation'
import type { UserRepository } from '@/repository/user/user-repository'
import type { SetupTotpUseCase } from '@/usecase/user/security/setup-totp-use-case'
import type { EnableTotpUseCase } from '@/usecase/user/security/enable-totp-use-case'
import type { DisableTotpUseCase } from '@/usecase/user/security/disable-totp-use-case'
import { TotpMainMode } from '@/ui/screens/user/totp/main/TotpMainSearchSchema'

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

export interface TotpMainStoreDependencies {
  userRepository: UserRepository
  setupTotpUseCase: SetupTotpUseCase
  enableTotpUseCase: EnableTotpUseCase
  disableTotpUseCase: DisableTotpUseCase
  onNavigateToRecoveryCodes: () => void
  onBack: () => void
  totpMode?: TotpMainMode
  onTotpModeChange?: (totpMode: TotpMainMode) => void
}

export interface TotpMainStoreState {
  screenState: TotpMainScreenState
  loadTotpStatus: () => Promise<void>
  initSetup: () => Promise<void>
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

export const createTotpMainStore = (
  deps: TotpMainStoreDependencies,
  initialState?: TotpMainScreenState
) => {
  const store = createStore<TotpMainStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },

    loadTotpStatus: async () => {
      const result = await deps.userRepository.refreshCurrentUser()
      if (!isSuccess(result)) {
        set({
          screenState: {
            status: 'error',
            error: result.error
          }
        })
      }
    },

    initSetup: async () => {
      const current = get().screenState
      if (current.status === 'setupInProgress') {
        return
      }

      set({
        screenState: {
          status: 'disabled',
          actionLoading: true,
          actionError: null
        }
      })

      const result = await deps.setupTotpUseCase.execute()

      if (isSuccess(result)) {
        deps.onTotpModeChange?.(TotpMainMode.SETUP_IN_PROGRESS)
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

    onSetupClick: async () => {
      await get().initSetup()
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
        deps.onTotpModeChange?.(TotpMainMode.ENABLED)
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
        deps.onTotpModeChange?.(TotpMainMode.DISABLED)
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

export interface TotpMainProviderProps {
  dependencies: TotpMainStoreDependencies
  initialState?: TotpMainScreenState
  children: React.ReactNode
}

export const TotpMainProvider: React.FC<TotpMainProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createTotpMainStore(dependencies, initialState))

  useEffect(() => {
    const unsubscribe = dependencies.userRepository.observeCurrentUser((user) => {
      if (!user) {
        store.setState({
          screenState: {
            status: 'error',
            error: CommonError.unknown()
          }
        })
      } else if (user.isTotpEnabled) {
        store.setState({
          screenState: {
            status: 'enabled',
            showDisableConfirmation: false,
            actionLoading: false,
            actionError: null
          }
        })
      } else {
        const currentStatus = store.getState().screenState.status
        if (
          dependencies.totpMode === TotpMainMode.SETUP_IN_PROGRESS &&
          currentStatus !== 'setupInProgress'
        ) {
          void store.getState().initSetup()
        } else if (
          dependencies.totpMode !== TotpMainMode.SETUP_IN_PROGRESS &&
          currentStatus === 'setupInProgress'
        ) {
          store.setState({
            screenState: {
              status: 'disabled',
              actionLoading: false,
              actionError: null
            }
          })
        } else if (
          currentStatus !== 'setupInProgress' &&
          currentStatus !== 'disabled'
        ) {
          store.setState({
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
  }, [dependencies, store])

  return (
    <TotpMainContext.Provider value={store}>
      {children}
    </TotpMainContext.Provider>
  )
}

export const useTotpMainStore = <T,>(selector: (state: TotpMainStoreState) => T): T => {
  const store = useContext(TotpMainContext)
  if (!store) {
    throw new Error('useTotpMainStore must be used within TotpMainProvider')
  }
  return useStore(store, selector)
}
