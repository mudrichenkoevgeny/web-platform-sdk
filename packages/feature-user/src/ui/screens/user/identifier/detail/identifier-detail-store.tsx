import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import { AppType, toUserIdentifierIdOrNull, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifierId, UserId, UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AuthStorage } from '@/storage/auth/auth-storage'
import type { GetUserIdentifierUseCase } from '@/usecase/identifier/get-user-identifier-use-case'
import type { DeleteUserIdentifierUseCase } from '@/usecase/identifier/delete-user-identifier-use-case'
import type { EmailChangePasswordUseCase } from '@/usecase/identifier/email-change-password-use-case'
import type { DeletePasswordUseCase } from '@/usecase/identifier/delete-password-use-case'

/** Status values for {@link IdentifierDetailScreenState}. */
export enum IdentifierDetailStatus {
  LOADING = 'loading',
  ERROR = 'error',
  CONTENT = 'content'
}

/** Discriminated union representing active screen state for {@link IdentifierDetailScreen}. */
export type IdentifierDetailScreenState =
  | {
      /** Loading state while user identifier details are being fetched. */
      status: IdentifierDetailStatus.LOADING
    }
  | {
      /** Error state when loading user identifier details failed. */
      status: IdentifierDetailStatus.ERROR
      /** Error instance describing the failure. */
      error: AppError
    }
  | {
      /** Content state containing user identifier private details. */
      status: IdentifierDetailStatus.CONTENT
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
  /** Optional application environment type (CLIENT or MANAGEMENT). */
  appType?: AppType
  /** Optional preloaded user identifier model. */
  identifier?: UserIdentifierPrivate
  /** Optional target user identifier ID to fetch. */
  identifierId?: UserIdentifierId | null
  /** Optional current logged in user ID to check ownership. */
  currentUserId?: UserId | null
  /** Optional current active session identifier flag. */
  isCurrentIdentifier?: boolean
  /** Use case for fetching single user identifier details. */
  getUserIdentifierUseCase?: Pick<GetUserIdentifierUseCase, 'execute'>
  /** Use case for deleting a user identifier. */
  deleteUserIdentifierUseCase?: Pick<DeleteUserIdentifierUseCase, 'execute'>
  /** Use case for updating email password. */
  emailChangePasswordUseCase?: Pick<EmailChangePasswordUseCase, 'execute'>
  /** Use case for deleting password credentials. */
  deletePasswordUseCase?: Pick<DeletePasswordUseCase, 'execute'>
  /** Legacy callback for deleting password. */
  deletePassword?: (identifierId: UserIdentifierId) => Promise<void>
  /** Callback triggered when identifier deletion completes. */
  onIdentifierDeleted?: (identifierId: UserIdentifierId) => void
  /** Navigation callback to user details screen. */
  onNavigateToUserDetail?: (userId: UserId) => void
  /** Navigation callback to user main screen. */
  onNavigateToUserMain?: () => void
  /** Navigation callback for back action. */
  onBack: () => void
  /** Auth storage interface for session checks. */
  authStorage?: AuthStorage
}

/** Contract for state and actions exposed by {@link IdentifierDetailStore}. */
export interface IdentifierDetailStoreState {
  dependencies: IdentifierDetailStoreDependencies
  screenState: IdentifierDetailScreenState
  initializeIdentifier: () => Promise<void>
  onDeleteIdentifierRequested: () => void
  onDismissDeleteIdentifierDialog: () => void
  onDeleteIdentifierClick: () => Promise<void>
  onChangePasswordClick: () => void
  onConfirmChangePasswordClick: (oldPass: string, newPass: string) => Promise<void>
  onDismissChangePasswordDialog: () => void
  onDeletePasswordClick: () => Promise<void>
  onRetry: () => void
  onBackClick: () => void
  onUserClick: () => void
}

/** Type alias for Zustand store instance returned by {@link createIdentifierDetailStore}. */
export type IdentifierDetailStore = ReturnType<typeof createIdentifierDetailStore>

function computeIdentifierPermissions(
  identifier: UserIdentifierPrivate,
  deps: IdentifierDetailStoreDependencies,
  activeIdentifierId: UserIdentifierId | null
) {
  const isManagement = deps.appType === AppType.MANAGEMENT
  const isSelfUser = deps.currentUserId != null && identifier.userId === deps.currentUserId
  const isCurrentSessionIdentifier =
    deps.isCurrentIdentifier ??
    (activeIdentifierId != null ? identifier.id === activeIdentifierId : isSelfUser)
  const isEmail = identifier.userAuthProvider === UserAuthProvider.EMAIL

  if (isManagement) {
    if (isCurrentSessionIdentifier || isSelfUser) {
      return {
        isCurrentIdentifier: true,
        canChangePassword: false,
        canDeletePassword: false
      }
    }
    return {
      isCurrentIdentifier: false,
      canChangePassword: false,
      canDeletePassword: (deps.deletePasswordUseCase != null || deps.deletePassword != null) && isEmail
    }
  }

  return {
    isCurrentIdentifier: isCurrentSessionIdentifier,
    canChangePassword: deps.emailChangePasswordUseCase != null && isEmail,
    canDeletePassword: (deps.deletePasswordUseCase != null || deps.deletePassword != null) && isEmail
  }
}

export const createIdentifierDetailStore = (
  deps: IdentifierDetailStoreDependencies,
  initialState?: IdentifierDetailScreenState
) => {
  let isFetching = false

  const store = createStore<IdentifierDetailStoreState>()((set, get) => ({
    dependencies: deps,
    screenState: initialState ?? { status: IdentifierDetailStatus.LOADING },

    initializeIdentifier: async () => {
      const current = get().screenState
      if (isFetching || current.status === IdentifierDetailStatus.CONTENT) {
        return
      }
      isFetching = true

      try {
        const activeDeps = get().dependencies
        const targetId = activeDeps.identifierId ?? activeDeps.identifier?.id
        const storedIdentifierIdRaw = activeDeps.authStorage ? await activeDeps.authStorage.getIdentifierId() : null
        const activeIdentifierId = storedIdentifierIdRaw ? toUserIdentifierIdOrNull(storedIdentifierIdRaw) : null

        if (activeDeps.identifier) {
          const permissions = computeIdentifierPermissions(activeDeps.identifier, activeDeps, activeIdentifierId)

          set({
            screenState: {
              status: IdentifierDetailStatus.CONTENT,
              identifier: activeDeps.identifier,
              ...permissions,
              actionLoading: false,
              actionError: null,
              isChangePasswordDialogVisible: false,
              isDeleteConfirmationVisible: false
            }
          })
          return
        }

        if (targetId && activeDeps.getUserIdentifierUseCase) {
          set({ screenState: { status: IdentifierDetailStatus.LOADING } })
          const userIdentifierResult = await activeDeps.getUserIdentifierUseCase.execute(targetId)

          if (isSuccess(userIdentifierResult)) {
            const loaded = userIdentifierResult.data
            const permissions = computeIdentifierPermissions(loaded, activeDeps, activeIdentifierId)

            set({
              screenState: {
                status: IdentifierDetailStatus.CONTENT,
                identifier: loaded,
                ...permissions,
                actionLoading: false,
                actionError: null,
                isChangePasswordDialogVisible: false,
                isDeleteConfirmationVisible: false
              }
            })
          } else {
            set({
              screenState: {
                status: IdentifierDetailStatus.ERROR,
                error: userIdentifierResult.error
              }
            })
          }
        } else {
          set({
            screenState: {
              status: IdentifierDetailStatus.ERROR,
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
      if (current.status !== IdentifierDetailStatus.CONTENT) {
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
      if (current.status !== IdentifierDetailStatus.CONTENT) {
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
      if (current.status !== IdentifierDetailStatus.CONTENT || current.actionLoading) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null,
          isDeleteConfirmationVisible: false
        }
      })

      const id = toUserIdentifierIdOrNull(current.identifier.id)
      if (!id) {
        return
      }

      const activeDeps = get().dependencies
      if (activeDeps.deleteUserIdentifierUseCase) {
        const result = await activeDeps.deleteUserIdentifierUseCase.execute(id)
        if (isSuccess(result)) {
          activeDeps.onIdentifierDeleted?.(id)
          if (current.isCurrentIdentifier) {
            activeDeps.onNavigateToUserMain?.()
          } else {
            activeDeps.onBack()
          }
        } else {
          const updated = get().screenState
          if (updated.status === IdentifierDetailStatus.CONTENT) {
            set({
              screenState: {
                ...updated,
                actionLoading: false,
                actionError: result.error
              }
            })
          }
        }
      }
    },

    onChangePasswordClick: () => {
      const current = get().screenState
      if (current.status !== IdentifierDetailStatus.CONTENT) {
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

    onConfirmChangePasswordClick: async (oldPass: string, newPass: string) => {
      const current = get().screenState
      if (current.status !== IdentifierDetailStatus.CONTENT || current.actionLoading) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const id = toUserIdentifierIdOrNull(current.identifier.id)
      if (!id) {
        return
      }

      const activeDeps = get().dependencies
      if (activeDeps.emailChangePasswordUseCase) {
        const result = await activeDeps.emailChangePasswordUseCase.execute(
          id,
          oldPass,
          newPass
        )
        if (isSuccess(result)) {
          set({
            screenState: {
              ...current,
              actionLoading: false,
              isChangePasswordDialogVisible: false,
              actionError: null
            }
          })
        } else {
          const updated = get().screenState
          if (updated.status === IdentifierDetailStatus.CONTENT) {
            set({
              screenState: {
                ...updated,
                actionLoading: false,
                actionError: result.error
              }
            })
          }
        }
      }
    },

    onDismissChangePasswordDialog: () => {
      const current = get().screenState
      if (current.status !== IdentifierDetailStatus.CONTENT) {
        return
      }

      set({
        screenState: {
          ...current,
          isChangePasswordDialogVisible: false,
          actionError: null
        }
      })
    },

    onDeletePasswordClick: async () => {
      const current = get().screenState
      if (current.status !== IdentifierDetailStatus.CONTENT || current.actionLoading) {
        return
      }

      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      const id = toUserIdentifierIdOrNull(current.identifier.id)
      if (!id) {
        return
      }

      const activeDeps = get().dependencies
      if (activeDeps.deletePasswordUseCase) {
        const result = await activeDeps.deletePasswordUseCase.execute(id)
        if (isSuccess(result)) {
          await get().initializeIdentifier()
        } else {
          const updated = get().screenState
          if (updated.status === IdentifierDetailStatus.CONTENT) {
            set({
              screenState: {
                ...updated,
                actionLoading: false,
                actionError: result.error
              }
            })
          }
        }
      } else if (activeDeps.deletePassword) {
        try {
          await activeDeps.deletePassword(id)
          await get().initializeIdentifier()
        } catch {
          const updated = get().screenState
          if (updated.status === IdentifierDetailStatus.CONTENT) {
            set({
              screenState: {
                ...updated,
                actionLoading: false,
                actionError: CommonError.unknown()
              }
            })
          }
        }
      }
    },

    onRetry: async () => {
      await get().initializeIdentifier()
    },

    onBackClick: () => {
      get().dependencies.onBack()
    },

    onUserClick: () => {
      const current = get().screenState
      if (current.status !== IdentifierDetailStatus.CONTENT) {
        return
      }
      get().dependencies.onNavigateToUserDetail?.(current.identifier.userId)
    }
  }))

  return store
}

/** Context for providing {@link IdentifierDetailStore}. */
export const IdentifierDetailContext = createContext<IdentifierDetailStore | null>(null)

/** Props for {@link IdentifierDetailProvider}. */
export interface IdentifierDetailProviderProps {
  dependencies: IdentifierDetailStoreDependencies
  initialState?: IdentifierDetailScreenState
  children: React.ReactNode
}

/** Context Provider isolating {@link IdentifierDetailStore} per component tree. */
export const IdentifierDetailProvider: React.FC<IdentifierDetailProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createIdentifierDetailStore(dependencies, initialState))

  return (
    <IdentifierDetailContext.Provider value={store}>
      {children}
    </IdentifierDetailContext.Provider>
  )
}

/** Custom hook to consume isolated {@link IdentifierDetailStore} state. */
export const useIdentifierDetailStore = <T,>(
  selector: (state: IdentifierDetailStoreState) => T
): T => {
  const store = useContext(IdentifierDetailContext)
  if (!store) {
    throw new Error('useIdentifierDetailStore must be used within IdentifierDetailProvider')
  }
  return useStore(store, selector)
}
