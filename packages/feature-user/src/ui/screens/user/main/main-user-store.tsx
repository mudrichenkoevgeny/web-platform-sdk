import React, { createContext, useContext, useEffect, useRef } from 'react'
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
 * Discriminated union representing the active screen state for {@link MainUserScreen}.
 */
export type MainUserScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'unauthorized'
      actionError: AppError | null
    }
  | {
      status: 'content'
      user: UserPrivate
      appType: AppType
      isAccountDeletionAvailable: boolean
      showDeleteConfirmation: boolean
      showLogoutConfirmation: boolean
      actionLoading: boolean
      actionError: AppError | null
    }
  | {
      status: 'error'
      error: AppError
    }

/**
 * Dependencies required to construct and run {@link MainUserStore}.
 */
export interface MainUserStoreDependencies {
  appType: AppType
  userRepository: UserRepository
  logoutUseCase: LogoutUseCase
  scheduleUserDeletionUseCase: ScheduleUserDeletionUseCase
  getUserUseCase?: GetUserUseCase
  getAuthSettingsUseCase?: GetAuthSettingsUseCase
  observeAuthSettingsUseCase?: ObserveAuthSettingsUseCase
  onNavigateToLogin: () => void
  onNavigateToTotp: () => void
  onNavigateToSessions: () => void
  onNavigateToIdentifiers: () => void
}

/**
 * State and actions managed by {@link MainUserStore}.
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
  onDeleteAccountClick: () => void
  onConfirmDeleteAccount: () => Promise<void>
  onDismissDialog: () => void
}

export type MainUserStore = ReturnType<typeof createMainUserStore>

/**
 * Factory function creating a Zustand store instance for {@link MainUserScreen}.
 */
export const createMainUserStore = (
  deps: MainUserStoreDependencies,
  initialState?: MainUserScreenState
) => {
  const store = createStore<MainUserStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },
    authSettings: null,

    onRefresh: async () => {
      const current = get().screenState
      if (current.status === 'unauthorized') {
        return
      }

      if (current.status === 'content') {
        set({
          screenState: {
            ...current,
            actionLoading: true,
            actionError: null
          }
        })
      } else {
        set({ screenState: { status: 'loading' } })
      }

      const result = deps.getUserUseCase
        ? await deps.getUserUseCase.execute()
        : await deps.userRepository.refreshCurrentUser()

      if (isSuccess(result)) {
        if (result.data) {
          set({
            screenState: {
              status: 'content',
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
              status: 'unauthorized',
              actionError: null
            }
          })
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
        } else {
          set({
            screenState: {
              status: 'unauthorized',
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
              status: 'unauthorized',
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
                status: 'unauthorized',
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
      if (current.status !== 'content') {
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
      if (current.status !== 'content') {
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
          status: 'unauthorized',
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

    onDeleteAccountClick: () => {
      const current = get().screenState
      if (current.status !== 'content') {
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
      if (current.status !== 'content') {
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
            status: 'unauthorized',
            actionError: null
          }
        })
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

    onDismissDialog: () => {
      const current = get().screenState
      if (current.status !== 'content') {
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
  const storeRef = useRef<MainUserStore | undefined>(undefined)
  if (!storeRef.current) {
    storeRef.current = createMainUserStore(dependencies, initialState)
  }

  useEffect(() => {
    let isMounted = true

    const unsubscribe = dependencies.userRepository.observeCurrentUser((user) => {
      if (!isMounted) return
      if (user) {
        storeRef.current?.setState({
          screenState: {
            status: 'content',
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
        storeRef.current?.setState({
          screenState: {
            status: 'unauthorized',
            actionError: null
          }
        })
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [dependencies])

  return (
    <MainUserContext.Provider value={storeRef.current}>
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
