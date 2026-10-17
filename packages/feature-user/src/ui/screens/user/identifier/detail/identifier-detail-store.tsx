import React, { createContext, useContext, useState, useEffect } from 'react'
import { createStore, useStore } from 'zustand'
import { toUserIdentifierIdOrNull, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifierId, UserId, UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AuthStorage } from '@/storage/auth/auth-storage'

/** Discriminated union representing active screen state for {@link IdentifierDetailScreen}. */
export type IdentifierDetailScreenState =
  | {
      /** Loading state while user identifier details are being fetched. */
      status: 'loading'
    }
  | {
      /** Error state when loading user identifier details failed. */
      status: 'error'
      /** Error instance describing the failure. */
      error: AppError
    }
  | {
      /** Content state containing user identifier private details. */
      status: 'content'
      /** User identifier private details model. */
      identifier: UserIdentifierPrivate
      /** Whether this identifier is the active session's identifier. */
      isCurrentIdentifier: boolean
      /** Whether the current user can change this identifier's password. */
      canChangePassword: boolean
      /** Whether the current user can delete this identifier's password. */
      canDeletePassword: boolean
      /** Whether a background action is currently loading. */
      actionLoading: boolean
      /** Action error instance if a background action failed. */
      actionError: AppError | null
      /** Whether the change password dialog is currently open. */
      isChangePasswordDialogVisible: boolean
      /** Whether the delete confirmation dialog is currently open. */
      isDeleteConfirmationVisible: boolean
    }

/** Dependencies required to construct and run {@link IdentifierDetailStore}. */
export interface IdentifierDetailStoreDependencies {
  /** Optional preloaded identifier private details. */
  identifier?: UserIdentifierPrivate
  /** Optional target identifier ID to fetch. */
  identifierId?: UserIdentifierId
  /** Use case for loading user identifier details. */
  getUserIdentifierUseCase?: { execute: (identifierId: UserIdentifierId) => Promise<AppResult<UserIdentifierPrivate, AppError>> }
  /** Use case for deleting user identifier. */
  deleteUserIdentifierUseCase?: { execute: (identifierId: UserIdentifierId) => Promise<AppResult<void, AppError>> }
  /** Use case for changing email password. */
  emailChangePasswordUseCase?: { execute: (userIdentifierId: UserIdentifierId, oldPassword: string, newPassword: string) => Promise<AppResult<void, AppError>> }
  /** Use case for deleting identifier password. */
  deletePasswordUseCase?: { execute: (identifierId: UserIdentifierId) => Promise<AppResult<void, AppError>> }
  /** Optional alternative callback function to delete password. */
  deletePassword?: (identifierId: UserIdentifierId) => Promise<void>
  /** Explicit override flag indicating if this is the active session's identifier. */
  isCurrentIdentifier?: boolean
  /** Currently authenticated user ID. */
  currentUserId?: UserId | null
  /** Auth storage instance for inspecting active identifier ID. */
  authStorage?: AuthStorage
  /** Callback when identifier is deleted successfully. */
  onIdentifierDeleted?: (identifierId: UserIdentifierId) => void
  /** Navigation callback to user detail screen. */
  onNavigateToUserDetail?: (userId: UserId) => void
  /** Navigation callback to user profile screen. */
  onNavigateToProfile?: () => void
  /** Navigation callback to return to previous screen. */
  onBack: () => void
}

/** State and actions managed by {@link IdentifierDetailStore}. */
export interface IdentifierDetailStoreState {
  /** Injected store dependencies. */
  dependencies: IdentifierDetailStoreDependencies
  /** Current screen UI state. */
  screenState: IdentifierDetailScreenState
  /** Initializes identifier details. */
  initializeIdentifier: () => Promise<void>
  /** Shows delete confirmation dialog. */
  onDeleteIdentifierRequested: () => void
  /** Dismisses delete confirmation dialog. */
  onDismissDeleteIdentifierDialog: () => void
  /** Confirms and executes identifier deletion. */
  onDeleteIdentifierClick: () => Promise<void>
  /** Opens change password dialog. */
  onChangePasswordClick: () => void
  /** Submits change password request. */
  onConfirmChangePasswordClick: (oldPassword: string, newPassword: string) => Promise<void>
  /** Dismisses change password dialog. */
  onDismissChangePasswordDialog: () => void
  /** Submits delete password request. */
  onDeletePasswordClick: () => Promise<void>
  /** Retries loading identifier details after failure. */
  onRetry: () => void
  /** Handles back navigation button click. */
  onBackClick: () => void
  /** Handles click on associated user. */
  onUserClick: () => void
}

/** Type alias for Zustand store instance returned by {@link createIdentifierDetailStore}. */
export type IdentifierDetailStore = ReturnType<typeof createIdentifierDetailStore>

/**
 * Factory function creating a Zustand store instance for {@link IdentifierDetailScreen}.
 *
 * @param deps - Injected store dependencies
 * @param initialState - Optional initial screen state override
 * @returns Initialized store instance
 */
export const createIdentifierDetailStore = (
  deps: IdentifierDetailStoreDependencies,
  initialState?: IdentifierDetailScreenState
) => {
  let isFetching = false

  const store = createStore<IdentifierDetailStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: 'loading' },

    initializeIdentifier: async () => {
      const current = get().screenState
      if (isFetching || current.status === 'content') {
        return
      }
      isFetching = true

      try {
        const activeDeps = get().dependencies
        const targetId = activeDeps.identifierId ?? activeDeps.identifier?.id
        const storedIdentifierIdRaw = activeDeps.authStorage ? await activeDeps.authStorage.getIdentifierId() : null
        const activeIdentifierId = storedIdentifierIdRaw ? toUserIdentifierIdOrNull(storedIdentifierIdRaw) : null

        if (activeDeps.identifier) {
          const isSelfIdentifier =
            activeDeps.isCurrentIdentifier ??
            ((activeIdentifierId != null && activeDeps.identifier.id === activeIdentifierId) ||
              (activeDeps.currentUserId != null && activeDeps.identifier.userId === activeDeps.currentUserId))

          set({
            screenState: {
              status: 'content',
              identifier: activeDeps.identifier,
              isCurrentIdentifier: isSelfIdentifier,
              canChangePassword: activeDeps.emailChangePasswordUseCase != null && activeDeps.identifier.userAuthProvider === UserAuthProvider.EMAIL,
              canDeletePassword: (activeDeps.deletePasswordUseCase != null || activeDeps.deletePassword != null) && activeDeps.identifier.userAuthProvider === UserAuthProvider.EMAIL,
              actionLoading: false,
              actionError: null,
              isChangePasswordDialogVisible: false,
              isDeleteConfirmationVisible: false
            }
          })
          return
        }

        if (targetId && activeDeps.getUserIdentifierUseCase) {
          set({ screenState: { status: 'loading' } })
          const userIdentifierResult = await activeDeps.getUserIdentifierUseCase.execute(targetId)

          if (isSuccess(userIdentifierResult)) {
            const loaded = userIdentifierResult.data
            const isSelfIdentifier =
              activeDeps.isCurrentIdentifier ??
              ((activeIdentifierId != null && loaded.id === activeIdentifierId) ||
                (activeDeps.currentUserId != null && loaded.userId === activeDeps.currentUserId))

            set({
              screenState: {
                status: 'content',
                identifier: loaded,
                isCurrentIdentifier: isSelfIdentifier,
                canChangePassword: activeDeps.emailChangePasswordUseCase != null && loaded.userAuthProvider === UserAuthProvider.EMAIL,
                canDeletePassword: (activeDeps.deletePasswordUseCase != null || activeDeps.deletePassword != null) && loaded.userAuthProvider === UserAuthProvider.EMAIL,
                actionLoading: false,
                actionError: null,
                isChangePasswordDialogVisible: false,
                isDeleteConfirmationVisible: false
              }
            })
          } else {
            set({
              screenState: {
                status: 'error',
                error: userIdentifierResult.error
              }
            })
          }
        } else {
          set({
            screenState: {
              status: 'error',
              error: CommonError.unknown()
            }
          })
        }
      } finally {
        isFetching = false
      }
    },

    onDeleteIdentifierRequested: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }
      set({
        screenState: {
          ...current,
          isDeleteConfirmationVisible: true,
          actionError: null
        }
      })
    },

    onDismissDeleteIdentifierDialog: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }
      set({
        screenState: {
          ...current,
          isDeleteConfirmationVisible: false
        }
      })
    },

    onDeleteIdentifierClick: async () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      const activeDeps = get().dependencies
      const targetId = current.identifier.id
      if (!targetId) {
        return
      }
      set({
        screenState: {
          ...current,
          isDeleteConfirmationVisible: false,
          actionLoading: true,
          actionError: null
        }
      })

      if (activeDeps.deleteUserIdentifierUseCase) {
        const deleteIdentifierResult = await activeDeps.deleteUserIdentifierUseCase.execute(targetId)
        if (isSuccess(deleteIdentifierResult)) {
          activeDeps.onIdentifierDeleted?.(targetId)
          activeDeps.onBack()
        } else {
          set({
            screenState: {
              ...current,
              isDeleteConfirmationVisible: false,
              actionLoading: false,
              actionError: deleteIdentifierResult.error
            }
          })
        }
      } else {
        activeDeps.onIdentifierDeleted?.(targetId)
        activeDeps.onBack()
      }
    },

    onChangePasswordClick: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }
      set({
        screenState: {
          ...current,
          isChangePasswordDialogVisible: true,
          actionError: null
        }
      })
    },

    onConfirmChangePasswordClick: async (oldPassword: string, newPassword: string) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      const activeDeps = get().dependencies
      const identifierId = current.identifier.id
      if (!identifierId) {
        return
      }
      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      if (activeDeps.emailChangePasswordUseCase) {
        const changePasswordResult = await activeDeps.emailChangePasswordUseCase.execute(identifierId, oldPassword, newPassword)
        if (isSuccess(changePasswordResult)) {
          set({
            screenState: {
              ...current,
              actionLoading: false,
              isChangePasswordDialogVisible: false,
              actionError: null
            }
          })
        } else {
          set({
            screenState: {
              ...current,
              actionLoading: false,
              actionError: changePasswordResult.error
            }
          })
        }
      } else {
        set({
          screenState: {
            ...current,
            actionLoading: false,
            isChangePasswordDialogVisible: false
          }
        })
      }
    },

    onDismissChangePasswordDialog: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }
      set({
        screenState: {
          ...current,
          isChangePasswordDialogVisible: false
        }
      })
    },

    onDeletePasswordClick: async () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      const activeDeps = get().dependencies
      const targetId = current.identifier.id
      if (!targetId) {
        return
      }
      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      if (activeDeps.deletePasswordUseCase) {
        const deletePasswordResult = await activeDeps.deletePasswordUseCase.execute(targetId)
        if (isSuccess(deletePasswordResult)) {
          await get().initializeIdentifier()
        } else {
          set({
            screenState: {
              ...current,
              actionLoading: false,
              actionError: deletePasswordResult.error
            }
          })
        }
      } else if (activeDeps.deletePassword) {
        await activeDeps.deletePassword(targetId)
        await get().initializeIdentifier()
      } else {
        set({
          screenState: {
            ...current,
            actionLoading: false
          }
        })
      }
    },

    onRetry: () => {
      get().initializeIdentifier()
    },

    onBackClick: () => {
      get().dependencies.onBack()
    },

    onUserClick: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }
      const activeDeps = get().dependencies
      if (activeDeps.onNavigateToUserDetail) {
        activeDeps.onNavigateToUserDetail(current.identifier.userId)
      } else {
        activeDeps.onNavigateToProfile?.()
      }
    }
  }))

  return store
}

const IdentifierDetailContext = createContext<IdentifierDetailStore | null>(null)

/** Props for {@link IdentifierDetailProvider}. */
export interface IdentifierDetailProviderProps {
  /** Injected dependencies. */
  dependencies: IdentifierDetailStoreDependencies
  /** Optional initial state override. */
  initialState?: IdentifierDetailScreenState
  /** React child nodes. */
  children: React.ReactNode
}

/** React Context Provider for {@link IdentifierDetailStore}. */
export const IdentifierDetailProvider: React.FC<IdentifierDetailProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createIdentifierDetailStore(dependencies, initialState))

  useEffect(() => {
    store.setState((state) => ({ ...state, dependencies }))
  }, [store, dependencies])

  return (
    <IdentifierDetailContext.Provider value={store}>
      {children}
    </IdentifierDetailContext.Provider>
  )
}

/**
 * Custom hook to select state from {@link IdentifierDetailStore}.
 *
 * @param selector - Selector function transforming store state
 * @returns Selected slice of store state
 */
export const useIdentifierDetailStore = <T,>(
  selector: (state: IdentifierDetailStoreState) => T
): T => {
  const store = useContext(IdentifierDetailContext)
  if (!store) {
    throw new Error('useIdentifierDetailStore must be used within IdentifierDetailProvider')
  }
  return useStore(store, selector)
}
