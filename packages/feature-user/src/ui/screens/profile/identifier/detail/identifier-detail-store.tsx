import React, { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import { toUserIdentifierIdOrNull, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifierId, UserId } from "@mudrichenkoevgeny/shared-foundation";
import { CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { GetUserIdentifierUseCase } from '@/usecase/identifier/get-user-identifier-use-case'
import type { DeleteUserIdentifierUseCase } from '@/usecase/identifier/delete-user-identifier-use-case'
import type { EmailChangePasswordUseCase } from '@/usecase/identifier/email-change-password-use-case'
import type { AuthStorage } from '@/storage/auth/auth-storage'
/**
 * Discriminated union representing active screen state for {@link IdentifierDetailScreen}.
 */
export type IdentifierDetailScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'error'
      error: AppError
    }
  | {
      status: 'content'
      identifier: UserIdentifierPrivate
      isCurrentIdentifier: boolean
      canChangePassword: boolean
      canDeletePassword: boolean
      actionLoading: boolean
      actionError: AppError | null
      isChangePasswordDialogVisible: boolean
      isDeleteConfirmationVisible: boolean
    }

/**
 * Dependencies required to construct and run {@link IdentifierDetailStore}.
 */
export interface IdentifierDetailStoreDependencies {
  identifier?: UserIdentifierPrivate
  identifierId?: UserIdentifierId
  getUserIdentifierUseCase?: GetUserIdentifierUseCase
  deleteUserIdentifierUseCase?: DeleteUserIdentifierUseCase
  emailChangePasswordUseCase?: EmailChangePasswordUseCase
  deletePasswordUseCase?: { execute: (identifierId: UserIdentifierId) => Promise<AppResult<void, AppError>> }
  deletePassword?: (identifierId: UserIdentifierId) => Promise<void>
  isCurrentIdentifier?: boolean
  authStorage?: AuthStorage
  onIdentifierDeleted?: (identifierId: UserIdentifierId) => void
  onNavigateToUserDetail?: (userId: UserId) => void
  onNavigateToProfile?: () => void
  onBack: () => void
}

/**
 * State and actions managed by {@link IdentifierDetailStore}.
 */
export interface IdentifierDetailStoreState {
  screenState: IdentifierDetailScreenState
  initializeIdentifier: () => Promise<void>
  onDeleteIdentifierRequested: () => void
  onDismissDeleteIdentifierDialog: () => void
  onDeleteIdentifierClick: () => Promise<void>
  onChangePasswordClick: () => void
  onConfirmChangePasswordClick: (oldPassword: string, newPassword: string) => Promise<void>
  onDismissChangePasswordDialog: () => void
  onDeletePasswordClick: () => Promise<void>
  onRetry: () => void
  onBackClick: () => void
  onUserClick: () => void
}

export type IdentifierDetailStore = ReturnType<typeof createIdentifierDetailStore>

/**
 * Factory function creating a Zustand store instance for {@link IdentifierDetailScreen}.
 */
export const createIdentifierDetailStore = (
  deps: IdentifierDetailStoreDependencies,
  initialState?: IdentifierDetailScreenState
) => {
  let isFetching = false

  const store = createStore<IdentifierDetailStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },

    initializeIdentifier: async () => {
      const current = get().screenState
      if (isFetching || current.status === 'content') {
        return
      }
      isFetching = true

      try {
        const targetId = deps.identifierId ?? deps.identifier?.id
        const storedIdentifierIdRaw = deps.authStorage ? await deps.authStorage.getIdentifierId() : null
        const activeIdentifierId = storedIdentifierIdRaw ? toUserIdentifierIdOrNull(storedIdentifierIdRaw) : null
        const resolvedIsCurrent = deps.isCurrentIdentifier ?? (targetId != null && targetId === activeIdentifierId)

        if (deps.identifier) {
          set({
            screenState: {
              status: 'content',
              identifier: deps.identifier,
              isCurrentIdentifier: resolvedIsCurrent,
              canChangePassword: deps.emailChangePasswordUseCase != null && deps.identifier.userAuthProvider === UserAuthProvider.EMAIL,
              canDeletePassword: (deps.deletePasswordUseCase != null || deps.deletePassword != null) && deps.identifier.userAuthProvider === UserAuthProvider.EMAIL,
              actionLoading: false,
              actionError: null,
              isChangePasswordDialogVisible: false,
              isDeleteConfirmationVisible: false
            }
          })
          return
        }

        if (targetId && deps.getUserIdentifierUseCase) {
          set({ screenState: { status: 'loading' } })
          const result = await deps.getUserIdentifierUseCase.execute(targetId)

          if (isSuccess(result)) {
            const loaded = result.data
            set({
              screenState: {
                status: 'content',
                identifier: loaded,
                isCurrentIdentifier: resolvedIsCurrent,
                canChangePassword: deps.emailChangePasswordUseCase != null && loaded.userAuthProvider === UserAuthProvider.EMAIL,
                canDeletePassword: (deps.deletePasswordUseCase != null || deps.deletePassword != null) && loaded.userAuthProvider === UserAuthProvider.EMAIL,
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
                error: result.error
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

      const targetId = current.identifier.id
      set({
        screenState: {
          ...current,
          isDeleteConfirmationVisible: false,
          actionLoading: true,
          actionError: null
        }
      })

      if (deps.deleteUserIdentifierUseCase) {
        const result = await deps.deleteUserIdentifierUseCase.execute(targetId)
        if (isSuccess(result)) {
          deps.onIdentifierDeleted?.(targetId)
          deps.onBack()
        } else {
          set({
            screenState: {
              ...current,
              isDeleteConfirmationVisible: false,
              actionLoading: false,
              actionError: result.error
            }
          })
        }
      } else {
        deps.onIdentifierDeleted?.(targetId)
        deps.onBack()
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

      const email = current.identifier.identifier
      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      if (deps.emailChangePasswordUseCase) {
        const result = await deps.emailChangePasswordUseCase.execute(email, oldPassword, newPassword)
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
          set({
            screenState: {
              ...current,
              actionLoading: false,
              actionError: result.error
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

      const targetId = current.identifier.id
      set({
        screenState: {
          ...current,
          actionLoading: true,
          actionError: null
        }
      })

      if (deps.deletePasswordUseCase) {
        const result = await deps.deletePasswordUseCase.execute(targetId)
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
      } else if (deps.deletePassword) {
        await deps.deletePassword(targetId)
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
      deps.onBack()
    },

    onUserClick: () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }
      if (current.isCurrentIdentifier) {
        deps.onNavigateToProfile?.()
      } else {
        deps.onNavigateToUserDetail?.(current.identifier.userId)
      }
    }
  }))

  return store
}

const IdentifierDetailContext = createContext<IdentifierDetailStore | null>(null)

/**
 * Props for {@link IdentifierDetailProvider}.
 */
export interface IdentifierDetailProviderProps {
  dependencies: IdentifierDetailStoreDependencies
  initialState?: IdentifierDetailScreenState
  children: React.ReactNode
}

/**
 * React Context Provider for {@link IdentifierDetailStore}.
 */
export const IdentifierDetailProvider: React.FC<IdentifierDetailProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const storeRef = useRef<IdentifierDetailStore | undefined>(undefined)
  if (!storeRef.current) {
    storeRef.current = createIdentifierDetailStore(dependencies, initialState)
  }

  return (
    <IdentifierDetailContext.Provider value={storeRef.current}>
      {children}
    </IdentifierDetailContext.Provider>
  )
}

/**
 * Custom hook to select state from {@link IdentifierDetailStore}.
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
