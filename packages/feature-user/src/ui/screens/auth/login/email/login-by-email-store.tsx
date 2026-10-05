import React, { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import {
  AccountLockoutType,
  AppType,
  SecurityErrorArgs,
  SecurityErrorCodes,
  UserAccountStatus,
  UserErrorArgs,
  UserErrorCodes
} from '@mudrichenkoevgeny/shared-foundation'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { LoginByEmailUseCase } from '@/usecase/auth/login/login-by-email-use-case'
import { FieldValidator } from '@/validator/field-validator'

export type LoginByEmailScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'content'
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
  loginByEmailUseCase: LoginByEmailUseCase
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
    status: 'content',
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
      if (current.status !== 'content') {
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
      if (current.status !== 'content') {
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
      if (current.status !== 'content') {
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
        current.status !== 'content' ||
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
        if (result.data.userDetails.accountStatus === UserAccountStatus.PENDING_DELETION) {
          deps.onNavigateToPendingDeletion()
        } else {
          deps.onFinished()
        }
        const updated = get().screenState
        if (updated.status === 'content') {
          set({ screenState: { ...updated, actionLoading: false } })
        }
      } else {
        const error = result.error

        if (error.code === SecurityErrorCodes.MFA_CONFIRMATION_REQUIRED) {
          const mfaToken = error.args?.[SecurityErrorArgs.MFA_TOKEN] as string | undefined
          if (mfaToken) {
            deps.onNavigateToTotp(mfaToken)
            const updated = get().screenState
            if (updated.status === 'content') {
              set({ screenState: { ...updated, actionLoading: false } })
            }
            return
          }
        }

        if (error.code === UserErrorCodes.USER_LOCKED) {
          const lockoutTypeRaw = error.args?.[UserErrorArgs.ACCOUNT_LOCKOUT_TYPE] as string | undefined
          const lockoutType = lockoutTypeRaw
            ? (Object.values(AccountLockoutType).find((v) => v === lockoutTypeRaw) ?? null)
            : null
          const lockoutUntilRaw = error.args?.[UserErrorArgs.TEMPORARY_LOCKOUT_UNTIL]
          const lockoutUntil = lockoutUntilRaw ? Number(lockoutUntilRaw) : null

          deps.onNavigateToAccountUnlock?.(lockoutType, lockoutUntil)
          const updated = get().screenState
          if (updated.status === 'content') {
            set({ screenState: { ...updated, actionLoading: false } })
          }
          return
        }

        const updated = get().screenState
        if (updated.status === 'content') {
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
  const storeRef = useRef<LoginByEmailStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = createLoginByEmailStore(dependencies, initialState)
  }

  return (
    <LoginByEmailContext.Provider value={storeRef.current}>
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
