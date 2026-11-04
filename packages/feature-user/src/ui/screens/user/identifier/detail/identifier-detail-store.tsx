import React, { createContext, useContext, useState, useEffect } from 'react'
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
import type { IdentifierDetailDataSource } from './identifier-detail-data-source'

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
  /** Data source handling user identifier detail retrieval and actions. */
  dataSource?: IdentifierDetailDataSource
  /** Optional current logged in user ID to check ownership. */
  currentUserId?: UserId | null
  /** Optional current active session identifier flag. */
  isCurrentIdentifier?: boolean
  /** Legacy use case for fetching single user identifier details. */
  getUserIdentifierUseCase?: Pick<GetUserIdentifierUseCase, 'execute'>
  /** Legacy use case for deleting a user identifier. */
  deleteUserIdentifierUseCase?: Pick<DeleteUserIdentifierUseCase, 'execute'>
  /** Legacy use case for updating email password. */
  emailChangePasswordUseCase?: Pick<EmailChangePasswordUseCase, 'execute'>
  /** Legacy use case for deleting password credentials. */
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

  if (deps.dataSource) {
    return {
      isCurrentIdentifier: isCurrentSessionIdentifier,
      canChangePassword: Boolean(deps.dataSource.isChangePasswordAvailable) && isEmail,
      canDeletePassword: Boolean(deps.dataSource.isDeletePasswordAvailable) && isEmail
    }
  }

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

        const getUserIdentifierUseCase = activeDeps.getUserIdentifierUseCase
        const getIdentifierFn =
          activeDeps.dataSource?.getIdentifier ??
          (getUserIdentifierUseCase
            ? (id: UserIdentifierId) => getUserIdentifierUseCase.execute(id)
            : null)

        if (targetId && getIdentifierFn) {
          set({ screenState: { status: IdentifierDetailStatus.LOADING } })
          const fetchIdentifierDetailResult = await getIdentifierFn(targetId)

          if (isSuccess(fetchIdentifierDetailResult)) {
            const loaded = fetchIdentifierDetailResult.data
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
                error: fetchIdentifierDetailResult.error
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
      const deleteUserIdentifierUseCase = activeDeps.deleteUserIdentifierUseCase
      const deleteFn =
        activeDeps.dataSource?.deleteIdentifier ??
        (deleteUserIdentifierUseCase
          ? (identifierId: UserIdentifierId) => deleteUserIdentifierUseCase.execute(identifierId)
          : null)

      if (deleteFn) {
        const result = await deleteFn(id)
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
      const emailChangePasswordUseCase = activeDeps.emailChangePasswordUseCase
      const changePasswordFn =
        activeDeps.dataSource?.changePassword ??
        (emailChangePasswordUseCase
          ? (identifierId: UserIdentifierId, op: string, np: string) =>
              emailChangePasswordUseCase.execute(
                identifierId,
                op,
                np
              )
          : null)

      if (changePasswordFn) {
        const result = await changePasswordFn(id, oldPass, newPass)
        if (isSuccess(result)) {
          set({
            screenState: {
              ...current,
              actionLoading: false,
              actionError: null,
              isChangePasswordDialogVisible: false
            }
          })
          await get().initializeIdentifier()
        } else {
          set({
            screenState: {
              ...current,
              actionLoading: false,
              actionError: result.error
            }
          })
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
          isChangePasswordDialogVisible: false
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

      if (activeDeps.dataSource?.deletePassword) {
        const result = await activeDeps.dataSource.deletePassword(id)
        if (isSuccess(result)) {
          await get().initializeIdentifier()
        } else {
          set({
            screenState: {
              ...current,
              actionLoading: false,
              actionError: result.error
            }
          })
        }
      } else if (activeDeps.deletePasswordUseCase) {
        const result = await activeDeps.deletePasswordUseCase.execute(id)
        if (isSuccess(result)) {
          await get().initializeIdentifier()
        } else {
          set({
            screenState: {
              ...current,
              actionLoading: false,
              actionError: result.error
            }
          })
        }
      } else if (activeDeps.deletePassword) {
        await activeDeps.deletePassword(id)
        await get().initializeIdentifier()
      }
    },

    onRetry: () => {
      void get().initializeIdentifier()
    },

    onBackClick: () => {
      get().dependencies.onBack()
    },

    onUserClick: () => {
      const current = get().screenState
      if (current.status !== IdentifierDetailStatus.CONTENT) {
        return
      }
      const activeDeps = get().dependencies
      if (activeDeps.onNavigateToUserDetail) {
        activeDeps.onNavigateToUserDetail(current.identifier.userId)
      } else {
        activeDeps.onNavigateToUserMain?.()
      }
    }
  }))

  return store
}

const IdentifierDetailContext = createContext<IdentifierDetailStore | null>(null)

/** Props for {@link IdentifierDetailProvider}. */
export interface IdentifierDetailProviderProps {
  dependencies: IdentifierDetailStoreDependencies
  initialState?: IdentifierDetailScreenState
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

/** Custom hook to select state from {@link IdentifierDetailStore}. */
export const useIdentifierDetailStore = <T,>(
  selector: (state: IdentifierDetailStoreState) => T
): T => {
  const store = useContext(IdentifierDetailContext)
  if (!store) {
    throw new Error('useIdentifierDetailStore must be used within IdentifierDetailProvider')
  }
  return useStore(store, selector)
}
