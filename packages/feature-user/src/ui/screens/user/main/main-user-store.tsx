import React, { createContext, useContext, useEffect, useState } from 'react'
import { createStore, useStore } from 'zustand'
import type { UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { UserError } from '@/error/model/user-error'
import type { UserRepository } from '@/repository/user/user-repository'
import type { LogoutUseCase } from '@/usecase/session/logout-use-case'
import type { ScheduleUserDeletionUseCase } from '@/usecase/user/schedule-user-deletion-use-case'
import type { GetUserUseCase } from '@/usecase/user/get-user-use-case'
import type { GetAuthSettingsUseCase } from '@/usecase/auth/settings/get-auth-settings-use-case'
import type { ObserveAuthSettingsUseCase } from '@/usecase/auth/settings/observe-auth-settings-use-case'
import type { OpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Status values for {@link MainUserScreenState}.
 */
export enum MainUserStatus {
  LOADING = 'loading',
  UNAUTHORIZED = 'unauthorized',
  CONTENT = 'content',
  ERROR = 'error'
}

/**
 * Discriminated union representing the active screen state for {@link MainUserScreen}.
 */
export type MainUserScreenState =
  | {
      status: MainUserStatus.LOADING
    }
  | {
      status: MainUserStatus.UNAUTHORIZED
      actionError: AppError | null
    }
  | {
      status: MainUserStatus.CONTENT
      user: UserPrivate
      appType: AppType
      isAccountDeletionAvailable: boolean
      showDeleteConfirmation: boolean
      showLogoutConfirmation: boolean
      actionLoading: boolean
      actionError: AppError | null
    }
  | {
      status: MainUserStatus.ERROR
      error: AppError
    }

/**
 * Dependencies required to construct and run {@link MainUserStore}.
 */
export interface MainUserStoreDependencies {
  appType: AppType
  userRepository: UserRepository
  getUserUseCase?: GetUserUseCase
  logoutUseCase: LogoutUseCase
  scheduleUserDeletionUseCase: ScheduleUserDeletionUseCase
  getAuthSettingsUseCase?: GetAuthSettingsUseCase
  observeAuthSettingsUseCase?: ObserveAuthSettingsUseCase
  onNavigateToLogin: () => void
  onNavigateToTotp: () => void
  onNavigateToSessions: () => void
  onNavigateToIdentifiers: () => void
  onNavigateToStorage: () => void
}

/**
 * Contract for state and actions exposed by {@link MainUserStore}.
 */
export interface MainUserStoreState {
  screenState: MainUserScreenState
  authSettings: OpenAuthSettings | null
  onRefresh: () => Promise<void>
  onLoginClick: () => Promise<void>
  onLogoutClick: () => void
  onConfirmLogout: () => Promise<void>
  onTotpMainClick: () => void
  onSessionsClick: () => void
  onIdentifiersClick: () => void
  onStorageClick: () => void
  onDeleteAccountClick: () => void
  onConfirmDeleteAccount: () => Promise<void>
  onDismissDialog: () => void
}

/**
 * Type alias for the per-instance Zustand store.
 */
export type MainUserStore = ReturnType<typeof createMainUserStore>

/**
 * Factory function creating a Zustand store instance for {@link MainUserScreen}.
 */
export const createMainUserStore = (
  deps: MainUserStoreDependencies,
  initialState?: MainUserScreenState
) => {
  const store = createStore<MainUserStoreState>()((set, get) => ({
    screenState: initialState ?? { status: MainUserStatus.LOADING },
    authSettings: null,

    onRefresh: async () => {
      const current = get().screenState
      if (current.status === MainUserStatus.UNAUTHORIZED) {
        return
      }

      if (current.status === MainUserStatus.CONTENT) {
        set({
          screenState: {
            ...current,
            actionLoading: true,
            actionError: null
          }
        })
      } else {
        set({ screenState: { status: MainUserStatus.LOADING } })
      }

      const result = deps.getUserUseCase
        ? await deps.getUserUseCase.execute()
        : await deps.userRepository.refreshCurrentUser()

      if (isSuccess(result)) {
        if (result.data) {
          set({
            screenState: {
              status: MainUserStatus.CONTENT,
              user: result.data,
              appType: deps.appType,
              isAccountDeletionAvailable: deps.appType === AppType.CLIENT,
              showDeleteConfirmation: false,
              showLogoutConfirmation: false,
              actionLoading: false,
              actionError: null
            }
          })
        } else {
          set({
            screenState: {
              status: MainUserStatus.UNAUTHORIZED,
              actionError: null
            }
          })
        }
      } else {
        const updated = get().screenState
        if (updated.status === MainUserStatus.CONTENT) {
          set({
            screenState: {
              ...updated,
              actionLoading: false,
              actionError: result.error
            }
          })
        } else {
          set({
            screenState: {
              status: MainUserStatus.UNAUTHORIZED,
              actionError: null
            }
          })
        }
      }
    },

    onLoginClick: async () => {
      const currentSettings = get().authSettings
      if (currentSettings) {
        if (!currentSettings.isRegistrationEnabled) {
          set({
            screenState: {
              status: MainUserStatus.UNAUTHORIZED,
              actionError: UserError.registrationDisabled()
            }
          })
          return
        }
        deps.onNavigateToLogin()
        return
      }

      if (deps.getAuthSettingsUseCase) {
        const result = await deps.getAuthSettingsUseCase.execute()
        if (isSuccess(result)) {
          if (!result.data.isRegistrationEnabled) {
            set({
              screenState: {
                status: MainUserStatus.UNAUTHORIZED,
                actionError: UserError.registrationDisabled()
              }
            })
            return
          }
        }
      }

      deps.onNavigateToLogin()
    },

    onLogoutClick: () => {
      const current = get().screenState
      if (current.status !== MainUserStatus.CONTENT) {
        return
      }
      set({
        screenState: {
          ...current,
          showLogoutConfirmation: true
        }
      })
    },

    onConfirmLogout: async () => {
      const current = get().screenState
      if (current.status !== MainUserStatus.CONTENT) {
        return
      }

      set({
        screenState: {
          ...current,
          showLogoutConfirmation: false,
          actionLoading: true
        }
      })

      await deps.logoutUseCase.execute()

      set({
        screenState: {
          status: MainUserStatus.UNAUTHORIZED,
          actionError: null
        }
      })
    },

    onTotpMainClick: () => {
      deps.onNavigateToTotp()
    },

    onSessionsClick: () => {
      deps.onNavigateToSessions()
    },

    onIdentifiersClick: () => {
      deps.onNavigateToIdentifiers()
    },

    onStorageClick: () => {
      deps.onNavigateToStorage()
    },

    onDeleteAccountClick: () => {
      const current = get().screenState
      if (current.status !== MainUserStatus.CONTENT) {
        return
      }
      set({
        screenState: {
          ...current,
          showDeleteConfirmation: true
        }
      })
    },

    onConfirmDeleteAccount: async () => {
      const current = get().screenState
      if (current.status !== MainUserStatus.CONTENT) {
        return
      }

      set({
        screenState: {
          ...current,
          showDeleteConfirmation: false,
          actionLoading: true
        }
      })

      const result = await deps.scheduleUserDeletionUseCase.execute()

      if (isSuccess(result)) {
        await deps.userRepository.clearSession()
        set({
          screenState: {
            status: MainUserStatus.UNAUTHORIZED,
            actionError: null
          }
        })
      } else {
        const updated = get().screenState
        if (updated.status === MainUserStatus.CONTENT) {
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

    onDismissDialog: () => {
      const current = get().screenState
      if (current.status !== MainUserStatus.CONTENT) {
        return
      }
      set({
        screenState: {
          ...current,
          showDeleteConfirmation: false,
          showLogoutConfirmation: false
        }
      })
    }
  }))

  return store
}

const MainUserContext = createContext<MainUserStore | null>(null)

/**
 * Props for {@link MainUserProvider}.
 */
export interface MainUserProviderProps {
  dependencies: MainUserStoreDependencies
  initialState?: MainUserScreenState
  children: React.ReactNode
}

/**
 * React Context Provider for {@link MainUserStore}.
 */
export const MainUserProvider: React.FC<MainUserProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createMainUserStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  useEffect(() => {
    let isMounted = true

    const unsubscribe = dependencies.userRepository.observeCurrentUser((user) => {
      if (!isMounted) return
      if (user) {
        store.setState({
          screenState: {
            status: MainUserStatus.CONTENT,
            user,
            appType: dependencies.appType,
            isAccountDeletionAvailable: dependencies.appType === AppType.CLIENT,
            showDeleteConfirmation: false,
            showLogoutConfirmation: false,
            actionLoading: false,
            actionError: null
          }
        })
      } else {
        store.setState({
          screenState: {
            status: MainUserStatus.UNAUTHORIZED,
            actionError: null
          }
        })
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [dependencies, store])

  return (
    <MainUserContext.Provider value={store}>
      {children}
    </MainUserContext.Provider>
  )
}

/**
 * Custom hook to select state from {@link MainUserStore}.
 */
export const useMainUserStore = <T,>(selector: (state: MainUserStoreState) => T): T => {
  const store = useContext(MainUserContext)
  if (!store) {
    throw new Error('useMainUserStore must be used within MainUserProvider')
  }
  return useStore(store, selector)
}
