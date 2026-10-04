import React, { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import {
  AccountLockoutType,
  SecurityErrorArgs,
  SecurityErrorCodes,
  UserAccountStatus,
  UserAuthProvider
} from '@mudrichenkoevgeny/shared-foundation'
import {
  CommonError,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, ExternalLauncher } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { GetOpenGlobalSettingsUseCase } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type { AvailableAuthProviders } from '@mudrichenkoevgeny/shared-foundation'
import { UserError } from '@/error/model/UserError'
import { UserErrorArgs, UserErrorCodes } from '@mudrichenkoevgeny/shared-foundation'
import type { LoginByGoogleUseCase } from '@/usecase/auth/login/LoginByGoogleUseCase'
import type { GetAvailableUserAuthProvidersUseCase } from '@/usecase/auth/settings/GetAvailableUserAuthProvidersUseCase'
/**
 * Union representing the active screen state for {@link LoginWelcomeScreen}.
 */
export type LoginWelcomeScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'initialization_error'
      error: AppError
    }
  | {
      status: 'content'
      availableAuthProviders: AvailableAuthProviders
      privacyPolicyUrl: string | null
      termsOfServiceUrl: string | null
      actionError: AppError | null
      actionLoading: boolean
    }

/**
 * Dependencies required for initializing {@link LoginWelcomeStore}.
 */
export interface LoginWelcomeStoreDependencies {
  /** External launcher service for opening web links. */
  externalLauncher: ExternalLauncher
  /** Use case for loading open global settings (privacy/terms URLs). */
  getOpenGlobalSettingsUseCase: GetOpenGlobalSettingsUseCase
  /** Use case for fetching available authentication providers. */
  getAvailableUserAuthProvidersUseCase: GetAvailableUserAuthProvidersUseCase
  /** Optional use case for Google sign-in. */
  loginByGoogleUseCase?: LoginByGoogleUseCase | null
  /** Navigation callback for email login flow. */
  onNavigateToLoginByEmail: () => void
  /** Navigation callback for phone login flow. */
  onNavigateToLoginByPhone: () => void
  /** Navigation callback for TOTP MFA verification screen. */
  onNavigateToTotp: (mfaToken: string) => void
  /** Navigation callback for account pending deletion restoration screen. */
  onNavigateToPendingDeletion: () => void
  /** Navigation callback for account unlock screen. */
  onNavigateToAccountUnlock?: (
    lockoutType?: AccountLockoutType | null,
    lockoutUntil?: number | null
  ) => void
  /** Flow completion callback. */
  onFinished: () => void
}

/**
 * State and action contract for {@link LoginWelcomeStore}.
 */
export interface LoginWelcomeStoreState {
  /** Active reactive screen state. */
  screenState: LoginWelcomeScreenState
  /** Asynchronously loads global settings and available providers. */
  initScreen: () => Promise<void>
  /** Retries initialization upon loading error. */
  onRetryInitClick: () => void
  /** Handles user selection of an authentication provider. */
  onLoginClick: (authProvider: UserAuthProvider) => Promise<void>
  /** Opens the privacy policy URL. */
  onPrivacyPolicyClick: () => void
  /** Opens the terms of service URL. */
  onTermsOfServiceClick: () => void
}

/**
 * Type alias for the per-instance Zustand store.
 */
export type LoginWelcomeStore = ReturnType<typeof createLoginWelcomeStore>

/**
 * Instantiates a new isolated {@link LoginWelcomeStore} for a screen instance.
 *
 * @param deps - Screen dependencies
 * @param initialState - Optional initial state override
 * @returns Vanilla Zustand store instance
 */
export const createLoginWelcomeStore = (
  deps: LoginWelcomeStoreDependencies,
  initialState?: LoginWelcomeScreenState
) => {
  return createStore<LoginWelcomeStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },

    initScreen: async () => {
      set({ screenState: { status: 'loading' } })

      const [authProvidersRes, settingsRes] = await Promise.all([
        deps.getAvailableUserAuthProvidersUseCase.execute(),
        deps.getOpenGlobalSettingsUseCase.execute()
      ])

      if (isSuccess(authProvidersRes) && isSuccess(settingsRes)) {
        set({
          screenState: {
            status: 'content',
            availableAuthProviders: authProvidersRes.data,
            privacyPolicyUrl: settingsRes.data.privacyPolicyUrl,
            termsOfServiceUrl: settingsRes.data.termsOfServiceUrl,
            actionError: null,
            actionLoading: false
          }
        })
      } else if (!isSuccess(authProvidersRes)) {
        set({
          screenState: {
            status: 'initialization_error',
            error: authProvidersRes.error
          }
        })
      } else if (!isSuccess(settingsRes)) {
        set({
          screenState: {
            status: 'initialization_error',
            error: settingsRes.error
          }
        })
      }
    },

    onRetryInitClick: () => {
      get().initScreen()
    },

    onLoginClick: async (authProvider: UserAuthProvider) => {
      const current = get().screenState
      if (current.status !== 'content' || current.actionLoading) {
        return
      }

      set({
        screenState: {
          ...current,
          actionError: null,
          actionLoading: true
        }
      })

      switch (authProvider) {
        case UserAuthProvider.EMAIL: {
          deps.onNavigateToLoginByEmail()
          const updated = get().screenState
          if (updated.status === 'content') {
            set({ screenState: { ...updated, actionLoading: false } })
          }
          break
        }
        case UserAuthProvider.PHONE: {
          deps.onNavigateToLoginByPhone()
          const updated = get().screenState
          if (updated.status === 'content') {
            set({ screenState: { ...updated, actionLoading: false } })
          }
          break
        }
        case UserAuthProvider.GOOGLE: {
          if (!deps.loginByGoogleUseCase) {
            const err = CommonError.contractViolation(
              new Error('Login by Google is not supported.')
            )
            const updated = get().screenState
            if (updated.status === 'content') {
              set({
                screenState: {
                  ...updated,
                  actionError: err,
                  actionLoading: false
                }
              })
            }
            return
          }

          const result = await deps.loginByGoogleUseCase.execute()
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
                  actionError: error,
                  actionLoading: false
                }
              })
            }
          }
          break
        }
        case UserAuthProvider.APPLE: {
          const appleErr = UserError.externalAuthFailed(new Error('Apple auth not supported'))
          const updated = get().screenState
          if (updated.status === 'content') {
            set({
              screenState: {
                ...updated,
                actionError: appleErr,
                actionLoading: false
              }
            })
          }
          break
        }
      }
    },

    onPrivacyPolicyClick: () => {
      const current = get().screenState
      if (current.status !== 'content' || current.actionLoading) {
        return
      }

      if (current.privacyPolicyUrl && current.privacyPolicyUrl.trim() !== '') {
        deps.externalLauncher.openUrl(current.privacyPolicyUrl)
      }
    },

    onTermsOfServiceClick: () => {
      const current = get().screenState
      if (current.status !== 'content' || current.actionLoading) {
        return
      }

      if (current.termsOfServiceUrl && current.termsOfServiceUrl.trim() !== '') {
        deps.externalLauncher.openUrl(current.termsOfServiceUrl)
      }
    }
  }))
}

const LoginWelcomeContext = createContext<LoginWelcomeStore | null>(null)

/** Props for {@link LoginWelcomeProvider}. */
export interface LoginWelcomeProviderProps {
  /** Dependencies for initializing the store. */
  dependencies: LoginWelcomeStoreDependencies
  /** Optional initial state override. */
  initialState?: LoginWelcomeScreenState
  /** React children. */
  children: React.ReactNode
}

/** Context provider isolating {@link LoginWelcomeStore} per component mount. */
export const LoginWelcomeProvider: React.FC<LoginWelcomeProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const storeRef = useRef<LoginWelcomeStore | undefined>(undefined)
  if (!storeRef.current) {
    storeRef.current = createLoginWelcomeStore(dependencies, initialState)
  }

  return (
    <LoginWelcomeContext.Provider value={storeRef.current}>
      {children}
    </LoginWelcomeContext.Provider>
  )
}

/**
 * Custom hook to consume isolated {@link LoginWelcomeStore} state.
 *
 * @param selector - State selector function
 * @returns Selected state slice
 */
export const useLoginWelcomeStore = <T,>(selector: (state: LoginWelcomeStoreState) => T): T => {
  const store = useContext(LoginWelcomeContext)
  if (!store) {
    throw new Error('useLoginWelcomeStore must be used within LoginWelcomeProvider')
  }
  return useStore(store, selector)
}
