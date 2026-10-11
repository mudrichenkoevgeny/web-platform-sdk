import React, { createContext, useContext, useState, useEffect } from 'react'
import { createStore, useStore } from 'zustand'
import { UserAccountStatus } from '@mudrichenkoevgeny/shared-foundation'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { LoginByTotpRecoveryCodeUseCase } from '@/usecase/auth/login/login-by-totp-recovery-code-use-case'
import type { LoginByTotpUseCase } from '@/usecase/auth/login/login-by-totp-use-case'
import { FieldValidator } from '@/validator/field-validator'

export enum LoginByTotpMode {
  TOTP = 'TOTP',
  RECOVERY_CODE = 'RECOVERY_CODE'
}

export type LoginByTotpScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'content'
      mfaToken: string
      code: string
      actionLoading: boolean
      actionError: AppError | null
    }

export interface LoginByTotpStoreDependencies {
  mfaToken: string
  loginByTotpUseCase: LoginByTotpUseCase
  loginByTotpRecoveryCodeUseCase: LoginByTotpRecoveryCodeUseCase
  onNavigateToPendingDeletion: () => void
  onBack: () => void
  onFinished: () => void
  loginTotpMode?: LoginByTotpMode
  onModeChange?: (mode: LoginByTotpMode) => void
}

export interface LoginByTotpStoreState {
  dependencies: LoginByTotpStoreDependencies
  screenState: LoginByTotpScreenState
  onCodeChanged: (code: string) => void
  onToggleModeClick: () => void
  onSubmitClick: () => Promise<void>
  onBackClick: () => void
}

export type LoginByTotpStore = ReturnType<typeof createLoginByTotpStore>

export const createLoginByTotpStore = (
  deps: LoginByTotpStoreDependencies,
  initialState?: LoginByTotpScreenState
) => {
  const defaultContentState: LoginByTotpScreenState = {
    status: 'content',
    mfaToken: deps.mfaToken,
    code: '',
    actionLoading: false,
    actionError: null
  }

  return createStore<LoginByTotpStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? defaultContentState,

    onCodeChanged: (code: string) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({
        screenState: {
          ...current,
          code,
          actionError: null
        }
      })
    },

    onToggleModeClick: () => {
      const activeDeps = get().dependencies
      const currentMode = activeDeps.loginTotpMode ?? LoginByTotpMode.TOTP
      const nextMode =
        currentMode === LoginByTotpMode.TOTP
          ? LoginByTotpMode.RECOVERY_CODE
          : LoginByTotpMode.TOTP

      activeDeps.onModeChange?.(nextMode)

      const current = get().screenState
      if (current.status === 'content') {
        set({
          screenState: {
            ...current,
            code: '',
            actionError: null
          }
        })
      }
    },

    onSubmitClick: async () => {
      const current = get().screenState
      if (current.status !== 'content' || current.actionLoading) {
        return
      }

      const activeDeps = get().dependencies
      const currentMode = activeDeps.loginTotpMode ?? LoginByTotpMode.TOTP
      const isCodeValid =
        currentMode === LoginByTotpMode.TOTP
          ? FieldValidator.isValidTotp(current.code)
          : current.code.trim().length > 0

      if (!isCodeValid) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const mfaTokenToUse = current.mfaToken || activeDeps.mfaToken

      const result =
        currentMode === LoginByTotpMode.TOTP
          ? await activeDeps.loginByTotpUseCase.execute(mfaTokenToUse, current.code)
          : await activeDeps.loginByTotpRecoveryCodeUseCase.execute(mfaTokenToUse, current.code)

      if (isSuccess(result)) {
        if (result.data.userPrivate.accountStatus === UserAccountStatus.PENDING_DELETION) {
          activeDeps.onNavigateToPendingDeletion()
        } else {
          activeDeps.onFinished()
        }
        const updated = get().screenState
        if (updated.status === 'content') {
          set({ screenState: { ...updated, actionLoading: false } })
        }
      } else {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({
            screenState: {
              ...updated,
              actionLoading: false,
              actionError: result.error
            }
          })
        }
      }
    },

    onBackClick: () => {
      get().dependencies.onBack()
    }
  }))
}

const LoginByTotpContext = createContext<LoginByTotpStore | null>(null)

export interface LoginByTotpProviderProps {
  dependencies: LoginByTotpStoreDependencies
  initialState?: LoginByTotpScreenState
  children: React.ReactNode
}

export const LoginByTotpProvider: React.FC<LoginByTotpProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createLoginByTotpStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <LoginByTotpContext.Provider value={store}>
      {children}
    </LoginByTotpContext.Provider>
  )
}

export const useLoginByTotpStore = <T,>(
  selector: (state: LoginByTotpStoreState) => T
): T => {
  const store = useContext(LoginByTotpContext)
  if (!store) {
    throw new Error('useLoginByTotpStore must be used within LoginByTotpProvider')
  }
  return useStore(store, selector)
}
