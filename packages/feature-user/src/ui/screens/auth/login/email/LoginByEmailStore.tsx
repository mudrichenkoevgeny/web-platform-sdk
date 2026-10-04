import React, { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import {
  SecurityErrorArgs,
  SecurityErrorCodes
} from '@mudrichenkoevgeny/shared-foundation'
import {
  AccountLockoutType,
  UserAccountStatus
} from '@mudrichenkoevgeny/shared-foundation'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { UserErrorArgs, UserErrorCodes } from '@mudrichenkoevgeny/shared-foundation'
import type { LoginByEmailUseCase } from '@/usecase/auth/login/LoginByEmailUseCase'
import { FieldValidator } from '@/validator/FieldValidator'
/**
 * Union representing the active screen state for {@link LoginByEmailScreen}.
 */
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

/**
 * Dependencies required for initializing {@link LoginByEmailStore}.
 */
export interface LoginByEmailStoreDependencies {
  /**
   * Operational application type (Client or Management).
   */
  appType: AppType
  /**
   * Use case for performing sign-in with email and password.
   */
  loginByEmailUseCase: LoginByEmailUseCase
  /**
   * Navigation callback for email registration screen.
   */
  onNavigateToRegistrationByEmail: () => void
  /**
   * Navigation callback for forgot password screen.
   */
  onNavigateToForgotPassword: () => void
  /**
   * Navigation callback for TOTP MFA verification screen.
   */
  onNavigateToTotp: (mfaToken: string) => void
  /**
   * Navigation callback for account pending deletion restoration screen.
   */
  onNavigateToPendingDeletion: () => void
  /**
   * Navigation callback for account unlock screen.
   */
  onNavigateToAccountUnlock?: (
    lockoutType?: AccountLockoutType | null,
    lockoutUntil?: number | null
  ) => void
  /**
   * Navigation callback for popping current screen step.
   */
  onBack: () => void
  /**
   * Flow completion callback.
   */
  onFinished: () => void
}

/**
 * State and action contract for {@link LoginByEmailStore}.
 */
export interface LoginByEmailStoreState {
  /**
   * Active reactive screen state.
   */
  screenState: LoginByEmailScreenState
  /**
   * Updates email field and recomputes validity.
   */
  onEmailChanged: (email: string) => void
  /**
   * Updates password field and recomputes validity.
   */
  onPasswordChanged: (password: string) => void
  /**
   * Toggles password field text visibility.
   */
  onTogglePasswordVisibility: () => void
  /**
   * Validates credentials and executes login request.
   */
  onLoginClick: () => Promise<void>
  /**
   * Navigates to forgot password flow.
   */
  onForgotPasswordClick: () => void
  /**
   * Navigates to registration flow.
   */
  onRegistrationClick: () => void
  /**
   * Pops screen step.
   */
  onBackClick: () => void
}

/**
 * Type alias for the per-instance Zustand store.
 */
export type LoginByEmailStore = ReturnType<typeof createLoginByEmailStore>

/**
 * Instantiates a new isolated {@link LoginByEmailStore} for a screen instance.
 *
 * @param deps - Screen dependencies
 * @param initialState - Optional initial state override
 * @returns Vanilla Zustand store instance
 */
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
        if (result.data.user.accountStatus === UserAccountStatus.PENDING_DELETION) {
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

/**
 * Props for {@link LoginByEmailProvider}.
 */
export interface LoginByEmailProviderProps {
  /** Dependencies for initializing the store. */
  dependencies: LoginByEmailStoreDependencies
  /** Optional initial state override. */
  initialState?: LoginByEmailScreenState
  /** React children. */
  children: React.ReactNode
}

/**
 * Context provider isolating {@link LoginByEmailStore} per component mount.
 */
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

/**
 * Custom hook to consume isolated {@link LoginByEmailStore} state.
 *
 * @param selector - State selector function
 * @returns Selected state slice
 */
export const useLoginByEmailStore = <T,>(selector: (state: LoginByEmailStoreState) => T): T => {
  const store = useContext(LoginByEmailContext)
  if (!store) {
    throw new Error('useLoginByEmailStore must be used within LoginByEmailProvider')
  }
  return useStore(store, selector)
}
