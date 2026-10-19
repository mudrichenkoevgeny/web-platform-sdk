import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import {
  AccountLockoutType,
  AppType,
  SecurityErrorCodes,
  UserAccountStatus,
  UserErrorCodes
} from '@mudrichenkoevgeny/shared-foundation'
import {
  getAppErrorAccountLockoutType,
  getAppErrorMfaToken,
  getAppErrorTemporaryLockoutUntil,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { LoginByEmailUseCase } from '@/usecase/auth/login/login-by-email-use-case'
import { FieldValidator } from '@/validator/field-validator'

export enum LoginByEmailStatus {
  LOADING = 'loading',
  CONTENT = 'content'
}

export type LoginByEmailScreenState =
  | {
      status: LoginByEmailStatus.LOADING
    }
  | {
      status: LoginByEmailStatus.CONTENT
      email: string
      isEmailValid: boolean
      password: string
      isPasswordValid: boolean
      isPasswordVisible: boolean
      isRegistrationAvailable: boolean
      actionLoading: boolean
      actionError: AppError | null
    }

export interface LoginByEmailStoreDependencies {
  appType: AppType
  loginByEmailUseCase: Pick<LoginByEmailUseCase, 'execute'>
  onNavigateToRegistrationByEmail: () => void
  onNavigateToForgotPassword: () => void
  onNavigateToTotp: (mfaToken: string) => void
  onNavigateToPendingDeletion: () => void
  onNavigateToAccountUnlock?: (
    lockoutType?: AccountLockoutType | null,
    lockoutUntil?: number | null
  ) => void
  onBack: () => void
  onFinished: () => void
}

export interface LoginByEmailStoreState {
  screenState: LoginByEmailScreenState
  onEmailChanged: (email: string) => void
  onPasswordChanged: (password: string) => void
  onTogglePasswordVisibility: () => void
  onLoginClick: () => Promise<void>
  onForgotPasswordClick: () => void
  onRegistrationClick: () => void
  onBackClick: () => void
}

export type LoginByEmailStore = ReturnType<typeof createLoginByEmailStore>

export const createLoginByEmailStore = (
  deps: LoginByEmailStoreDependencies,
  initialState?: LoginByEmailScreenState
) => {
  const defaultContentState: LoginByEmailScreenState = {
    status: LoginByEmailStatus.CONTENT,
    email: '',
    isEmailValid: false,
    password: '',
    isPasswordValid: false,
    isPasswordVisible: false,
    isRegistrationAvailable: deps.appType === AppType.CLIENT,
    actionLoading: false,
    actionError: null
  }

  return createStore<LoginByEmailStoreState>()((set, get) => ({
    screenState: initialState ?? defaultContentState,

    onEmailChanged: (email: string) => {
      const current = get().screenState
      if (current.status !== LoginByEmailStatus.CONTENT) {
        return
      }

      set({
        screenState: {
          ...current,
          email,
          isEmailValid: FieldValidator.isValidEmail(email),
          actionError: null
        }
      })
    },

    onPasswordChanged: (password: string) => {
      const current = get().screenState
      if (current.status !== LoginByEmailStatus.CONTENT) {
        return
      }

      set({
        screenState: {
          ...current,
          password,
          isPasswordValid: password.trim().length > 0,
          actionError: null
        }
      })
    },

    onTogglePasswordVisibility: () => {
      const current = get().screenState
      if (current.status !== LoginByEmailStatus.CONTENT) {
        return
      }

      set({
        screenState: {
          ...current,
          isPasswordVisible: !current.isPasswordVisible
        }
      })
    },

    onLoginClick: async () => {
      const current = get().screenState
      if (
        current.status !== LoginByEmailStatus.CONTENT ||
        !current.isEmailValid ||
        !current.isPasswordValid ||
        current.actionLoading
      ) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const result = await deps.loginByEmailUseCase.execute(current.email, current.password)

      if (isSuccess(result)) {
        if (result.data.userPrivate.accountStatus === UserAccountStatus.PENDING_DELETION) {
          deps.onNavigateToPendingDeletion()
        } else {
          deps.onFinished()
        }
        const updated = get().screenState
        if (updated.status === LoginByEmailStatus.CONTENT) {
          set({ screenState: { ...updated, actionLoading: false } })
        }
      } else {
        const error = result.error

        if (error.code === SecurityErrorCodes.MFA_CONFIRMATION_REQUIRED) {
          const mfaToken = getAppErrorMfaToken(error)
          if (mfaToken) {
            deps.onNavigateToTotp(mfaToken)
            const updated = get().screenState
            if (updated.status === LoginByEmailStatus.CONTENT) {
              set({ screenState: { ...updated, actionLoading: false } })
            }
            return
          }
        }

        if (error.code === UserErrorCodes.USER_LOCKED) {
          const lockoutType = getAppErrorAccountLockoutType(error)
          const lockoutUntil = getAppErrorTemporaryLockoutUntil(error)

          deps.onNavigateToAccountUnlock?.(lockoutType, lockoutUntil)
          const updated = get().screenState
          if (updated.status === LoginByEmailStatus.CONTENT) {
            set({ screenState: { ...updated, actionLoading: false } })
          }
          return
        }

        const updated = get().screenState
        if (updated.status === LoginByEmailStatus.CONTENT) {
          set({
            screenState: {
              ...updated,
              actionLoading: false,
              actionError: error
            }
          })
        }
      }
    },

    onForgotPasswordClick: () => {
      deps.onNavigateToForgotPassword()
    },

    onRegistrationClick: () => {
      deps.onNavigateToRegistrationByEmail()
    },

    onBackClick: () => {
      deps.onBack()
    }
  }))
}

const LoginByEmailContext = createContext<LoginByEmailStore | null>(null)

export interface LoginByEmailProviderProps {
  dependencies: LoginByEmailStoreDependencies
  initialState?: LoginByEmailScreenState
  children: React.ReactNode
}

export const LoginByEmailProvider: React.FC<LoginByEmailProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createLoginByEmailStore(dependencies, initialState))

  return (
    <LoginByEmailContext.Provider value={store}>
      {children}
    </LoginByEmailContext.Provider>
  )
}

export const useLoginByEmailStore = <T,>(selector: (state: LoginByEmailStoreState) => T): T => {
  const store = useContext(LoginByEmailContext)
  if (!store) {
    throw new Error('useLoginByEmailStore must be used within LoginByEmailProvider')
  }
  return useStore(store, selector)
}
