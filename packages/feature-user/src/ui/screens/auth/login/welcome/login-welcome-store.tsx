import React, { createContext, useContext, useEffect, useState } from 'react'
import { createStore, useStore } from 'zustand'
import {
  AccountLockoutType,
  SecurityErrorCodes,
  UserAccountStatus,
  UserAuthProvider,
  UserErrorCodes
} from '@mudrichenkoevgeny/shared-foundation'
import {
  CommonError,
  getAppErrorAccountLockoutType,
  getAppErrorMfaToken,
  getAppErrorTemporaryLockoutUntil,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, ExternalLauncher } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { GetOpenGlobalSettingsUseCase } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type { AvailableAuthProviders } from '@mudrichenkoevgeny/shared-foundation'
import { UserError } from '@/error/model/user-error'
import type { LoginByGoogleUseCase } from '@/usecase/auth/login/login-by-google-use-case'
import type { GetAvailableUserAuthProvidersUseCase } from '@/usecase/auth/settings/get-available-user-auth-providers-use-case'
/**
 * Screen status values for {@link LoginWelcomeScreenState}.
 */
export enum LoginWelcomeStatus {
  LOADING = 'loading',
  INITIALIZATION_ERROR = 'initialization_error',
  CONTENT = 'content'
}

/**
 * Union representing the active screen state for {@link LoginWelcomeScreen}.
 */
export type LoginWelcomeScreenState =
  | {
      status: LoginWelcomeStatus.LOADING
    }
  | {
      status: LoginWelcomeStatus.INITIALIZATION_ERROR
      error: AppError
    }
  | {
      status: LoginWelcomeStatus.CONTENT
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
    screenState: initialState ?? { status: LoginWelcomeStatus.LOADING },

    initScreen: async () => {
      set({ screenState: { status: LoginWelcomeStatus.LOADING } })

      const [authProvidersRes, settingsRes] = await Promise.all([
        deps.getAvailableUserAuthProvidersUseCase.execute(),
        deps.getOpenGlobalSettingsUseCase.execute()
      ])

      if (isSuccess(authProvidersRes) && isSuccess(settingsRes)) {
        set({
          screenState: {
            status: LoginWelcomeStatus.CONTENT,
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
            status: LoginWelcomeStatus.INITIALIZATION_ERROR,
            error: authProvidersRes.error
          }
        })
      } else if (!isSuccess(settingsRes)) {
        set({
          screenState: {
            status: LoginWelcomeStatus.INITIALIZATION_ERROR,
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
      if (current.status !== LoginWelcomeStatus.CONTENT || current.actionLoading) {
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
          if (updated.status === LoginWelcomeStatus.CONTENT) {
            set({ screenState: { ...updated, actionLoading: false } })
          }
          break
        }
        case UserAuthProvider.PHONE: {
          deps.onNavigateToLoginByPhone()
          const updated = get().screenState
          if (updated.status === LoginWelcomeStatus.CONTENT) {
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
            if (updated.status === LoginWelcomeStatus.CONTENT) {
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

          const googleLoginResult = await deps.loginByGoogleUseCase.execute()
          if (isSuccess(googleLoginResult)) {
            if (googleLoginResult.data.userPrivate.accountStatus === UserAccountStatus.PENDING_DELETION) {
              deps.onNavigateToPendingDeletion()
            } else {
              deps.onFinished()
            }
            const updated = get().screenState
            if (updated.status === LoginWelcomeStatus.CONTENT) {
              set({ screenState: { ...updated, actionLoading: false } })
            }
          } else {
            const error = googleLoginResult.error
            if (error.code === SecurityErrorCodes.MFA_CONFIRMATION_REQUIRED) {
              const mfaToken = getAppErrorMfaToken(error)
              if (mfaToken) {
                deps.onNavigateToTotp(mfaToken)
                const updated = get().screenState
                if (updated.status === LoginWelcomeStatus.CONTENT) {
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
              if (updated.status === LoginWelcomeStatus.CONTENT) {
                set({ screenState: { ...updated, actionLoading: false } })
              }
              return
            }

            const updated = get().screenState
            if (updated.status === LoginWelcomeStatus.CONTENT) {
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
          if (updated.status === LoginWelcomeStatus.CONTENT) {
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
      if (current.status !== LoginWelcomeStatus.CONTENT || current.actionLoading) {
        return
      }

      if (current.privacyPolicyUrl && current.privacyPolicyUrl.trim() !== '') {
        deps.externalLauncher.openUrl(current.privacyPolicyUrl)
      }
    },

    onTermsOfServiceClick: () => {
      const current = get().screenState
      if (current.status !== LoginWelcomeStatus.CONTENT || current.actionLoading) {
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
  const [store] = useState(() => createLoginWelcomeStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <LoginWelcomeContext.Provider value={store}>
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
