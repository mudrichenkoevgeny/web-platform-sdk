import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import { AccountLockoutType, toUserIdOrNull, UserAccountStatus } from '@mudrichenkoevgeny/shared-foundation'
import type { UserPrivate, UserId } from '@mudrichenkoevgeny/shared-foundation'
import { CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { DeleteUserUseCase } from '@/usecase/user/delete-user-use-case'
import type { GetUserUseCase } from '@/usecase/user/get-user-use-case'
import type { UpdateUserUseCase } from '@/usecase/user/update-user-use-case'
import type { ManagementDisableTotpUseCase } from '@/usecase/user/security/management-disable-totp-use-case'

const parseIntegerOrDefault = (value: string, defaultValue: number): number => {
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

/** Status values for {@link UserDetailScreenState}. */
export enum UserDetailStatus {
  LOADING = 'loading',
  ERROR = 'error',
  CONTENT = 'content'
}

/** Discriminated union representing active screen state for user detail screen. */
export type UserDetailScreenState =
  | {
      /** Loading state while user details are being loaded initially. */
      status: UserDetailStatus.LOADING
    }
  | {
      /** Error state when loading user details failed. */
      status: UserDetailStatus.ERROR
      /** Error instance describing the failure. */
      error: AppError
    }
  | {
      /** Content state containing user detail data and editable inputs. */
      status: UserDetailStatus.CONTENT
      /** Private user domain model. */
      user: UserPrivate
      /** Whether target user is the currently logged in user. */
      isSelfUser: boolean
      /** Input string value for authority level field. */
      authorityLevelInput: string
      /** Selected account status input value. */
      accountStatusInput: UserAccountStatus
      /** Selected account lockout type input value. */
      lockoutTypeInput: AccountLockoutType
      /** Input string value for temporary lockout until timestamp. */
      temporaryLockoutUntilInput: string
      /** Whether an update action is currently saving. */
      isSaving: boolean
      /** Update error instance if saving failed. */
      saveError: AppError | null
      /** Whether user deletion is currently in progress. */
      isDeleting: boolean
      /** Deletion error instance if delete operation failed. */
      deleteError: AppError | null
      /** Whether TOTP disabling is currently in progress. */
      isDisablingTotp: boolean
      /** TOTP disabling error instance if operation failed. */
      disableTotpError: AppError | null
      /** Whether user delete confirmation modal dialog is visible. */
      isDeleteConfirmationVisible: boolean
    }

/** External dependencies required by {@link createUserDetailStore}. */
export interface UserDetailStoreDependencies {
  /** Target user ID. */
  userId: UserId
  /** Optional currently authenticated user ID. */
  currentUserId?: UserId | null
  /** Use case for loading user details. */
  getUserUseCase: Pick<GetUserUseCase, 'execute'>
  /** Use case for updating user settings. */
  updateUserUseCase: Pick<UpdateUserUseCase, 'execute'>
  /** Use case for deleting user account. */
  deleteUserUseCase: Pick<DeleteUserUseCase, 'execute'>
  /** Use case for disabling TOTP MFA. */
  managementDisableTotpUseCase: Pick<ManagementDisableTotpUseCase, 'execute'>
  /** Navigation callback to open user sessions list. */
  onNavigateToSessions: (userId: UserId) => void
  /** Navigation callback to open user identifiers list. */
  onNavigateToIdentifiers: (userId: UserId) => void
  /** Navigation callback to open user audit events list. */
  onNavigateToAuditEvents: (userId: UserId) => void
  /** Navigation callback to return to previous screen. */
  onBack: () => void
}

/** Reactive store state and action interface for user detail screen. */
export interface UserDetailStoreState {
  /** Current screen UI state. */
  screenState: UserDetailScreenState
  /** Initializes screen state by loading user details. */
  initScreen: () => Promise<void>
  /** Handles authority level input value change. */
  onAuthorityLevelChanged: (value: string) => void
  /** Handles account status select option change. */
  onAccountStatusChanged: (value: UserAccountStatus) => void
  /** Handles lockout type select option change. */
  onLockoutTypeChanged: (value: AccountLockoutType) => void
  /** Handles temporary lockout until input value change. */
  onTemporaryLockoutUntilChanged: (value: string) => void
  /** Submits updated user settings. */
  onUpdateClick: () => Promise<void>
  /** Opens delete confirmation modal dialog. */
  onDeleteClick: () => void
  /** Confirms and submits user account deletion. */
  onConfirmDeleteClick: () => Promise<void>
  /** Dismisses delete confirmation modal dialog. */
  onDismissDeleteDialog: () => void
  /** Submits request to disable TOTP MFA for target user. */
  onDisableTotpClick: () => Promise<void>
  /** Opens user sessions screen. */
  onSessionsClick: () => void
  /** Opens user identifiers screen. */
  onIdentifiersClick: () => void
  /** Opens user audit events screen. */
  onAuditEventsClick: () => void
  /** Retries loading user details after failure. */
  onRetry: () => Promise<void>
  /** Handles back navigation button click. */
  onBackClick: () => void
}

/** Type alias for Zustand store instance returned by {@link createUserDetailStore}. */
export type UserDetailStore = ReturnType<typeof createUserDetailStore>

/**
 * Checks whether the current screen state has unsaved user detail changes.
 *
 * @param state - Current content screen state
 * @returns True if input values differ from original user data
 */
export const hasUserDetailChanges = (state: Extract<UserDetailScreenState, { status: UserDetailStatus.CONTENT }>): boolean => {
  const initialAuthLevel = state.user.authorityLevel.toString()
  const currentAuthLevel = state.authorityLevelInput.trim() || '0'
  const initialTempLockout = state.user.temporaryLockoutUntil ? String(state.user.temporaryLockoutUntil) : ''
  const initialLockoutType = state.user.lockoutType ?? AccountLockoutType.NONE

  return (
    currentAuthLevel !== initialAuthLevel ||
    state.accountStatusInput !== state.user.accountStatus ||
    state.lockoutTypeInput !== initialLockoutType ||
    state.temporaryLockoutUntilInput.trim() !== initialTempLockout
  )
}

/**
 * Factory function creating a Zustand store instance for user detail screen.
 *
 * @param deps - Injected store dependencies
 * @param initialState - Optional initial screen state override
 * @returns Initialized store instance
 */
export const createUserDetailStore = (
  deps: UserDetailStoreDependencies,
  initialState?: UserDetailScreenState
) => {
  let isFetching = false

  return createStore<UserDetailStoreState>()((set, get) => ({
    screenState: initialState ?? { status: UserDetailStatus.LOADING },

    initScreen: async () => {
      const current = get().screenState
      if (isFetching || current.status === UserDetailStatus.CONTENT) {
        return
      }
      isFetching = true

      try {
        const validUserId = toUserIdOrNull(deps.userId)
        if (!validUserId) {
          set({
            screenState: {
              status: UserDetailStatus.ERROR,
              error: CommonError.unknown()
            }
          })
          return
        }

        set({ screenState: { status: UserDetailStatus.LOADING } })
        const userResult = await deps.getUserUseCase.execute(validUserId)

        if (isSuccess(userResult)) {
          const user = userResult.data
          const isSelfUser = deps.currentUserId != null && user.id === deps.currentUserId
          set({
            screenState: {
              status: UserDetailStatus.CONTENT,
              user,
              isSelfUser,
              authorityLevelInput: String(user.authorityLevel),
              accountStatusInput: user.accountStatus,
              lockoutTypeInput: user.lockoutType ?? AccountLockoutType.NONE,
              temporaryLockoutUntilInput: user.temporaryLockoutUntil ? String(user.temporaryLockoutUntil) : '',
              isSaving: false,
              saveError: null,
              isDeleting: false,
              deleteError: null,
              isDisablingTotp: false,
              disableTotpError: null,
              isDeleteConfirmationVisible: false
            }
          })
        } else {
          set({
            screenState: {
              status: UserDetailStatus.ERROR,
              error: userResult.error
            }
          })
        }
      } finally {
        isFetching = false
      }
    },

    onAuthorityLevelChanged: (value: string) => {
      const current = get().screenState
      if (current.status !== UserDetailStatus.CONTENT) {
        return
      }

      if (value === '') {
        set({ screenState: { ...current, authorityLevelInput: value, saveError: null } })
        return
      }

      const num = parseIntegerOrDefault(value, -1)
      if (num >= 0 && num <= 100) {
        set({ screenState: { ...current, authorityLevelInput: value, saveError: null } })
      }
    },

    onAccountStatusChanged: (value: UserAccountStatus) => {
      const current = get().screenState
      if (current.status === UserDetailStatus.CONTENT) {
        set({ screenState: { ...current, accountStatusInput: value, saveError: null } })
      }
    },

    onLockoutTypeChanged: (value: AccountLockoutType) => {
      const current = get().screenState
      if (current.status === UserDetailStatus.CONTENT) {
        set({ screenState: { ...current, lockoutTypeInput: value, saveError: null } })
      }
    },

    onTemporaryLockoutUntilChanged: (value: string) => {
      const current = get().screenState
      if (current.status === UserDetailStatus.CONTENT) {
        set({ screenState: { ...current, temporaryLockoutUntilInput: value, saveError: null } })
      }
    },

    onUpdateClick: async () => {
      const current = get().screenState
      if (current.status !== UserDetailStatus.CONTENT || current.isSaving) {
        return
      }

      set({ screenState: { ...current, isSaving: true, saveError: null } })

      const authLevel = parseIntegerOrDefault(current.authorityLevelInput, 0)
      const tempLockout = current.temporaryLockoutUntilInput.trim().length > 0
        ? parseIntegerOrDefault(current.temporaryLockoutUntilInput, 0)
        : null

      const updateUserResult = await deps.updateUserUseCase.execute(deps.userId, {
        accountStatus: current.accountStatusInput,
        authorityLevel: authLevel,
        permissionCodes: null,
        lockoutType: current.lockoutTypeInput,
        temporaryLockoutUntil: tempLockout
      })

      if (isSuccess(updateUserResult)) {
        await get().initScreen()
      } else {
        const updated = get().screenState
        if (updated.status === UserDetailStatus.CONTENT) {
          set({ screenState: { ...updated, isSaving: false, saveError: updateUserResult.error } })
        }
      }
    },

    onDeleteClick: () => {
      const current = get().screenState
      if (current.status === UserDetailStatus.CONTENT) {
        set({ screenState: { ...current, isDeleteConfirmationVisible: true, deleteError: null } })
      }
    },

    onConfirmDeleteClick: async () => {
      const current = get().screenState
      if (current.status !== UserDetailStatus.CONTENT) {
        return
      }

      set({ screenState: { ...current, isDeleteConfirmationVisible: false, isDeleting: true, deleteError: null } })

      const deleteUserResult = await deps.deleteUserUseCase.execute(deps.userId)
      if (isSuccess(deleteUserResult)) {
        deps.onBack()
      } else {
        const updated = get().screenState
        if (updated.status === UserDetailStatus.CONTENT) {
          set({ screenState: { ...updated, isDeleting: false, deleteError: deleteUserResult.error } })
        }
      }
    },

    onDismissDeleteDialog: () => {
      const current = get().screenState
      if (current.status === UserDetailStatus.CONTENT) {
        set({ screenState: { ...current, isDeleteConfirmationVisible: false } })
      }
    },

    onDisableTotpClick: async () => {
      const current = get().screenState
      if (current.status !== UserDetailStatus.CONTENT || current.isDisablingTotp) {
        return
      }

      set({ screenState: { ...current, isDisablingTotp: true, disableTotpError: null } })

      const disableTotpResult = await deps.managementDisableTotpUseCase.execute(deps.userId)
      if (isSuccess(disableTotpResult)) {
        await get().initScreen()
      } else {
        const updated = get().screenState
        if (updated.status === UserDetailStatus.CONTENT) {
          set({ screenState: { ...updated, isDisablingTotp: false, disableTotpError: disableTotpResult.error } })
        }
      }
    },

    onSessionsClick: () => {
      deps.onNavigateToSessions(deps.userId)
    },

    onIdentifiersClick: () => {
      deps.onNavigateToIdentifiers(deps.userId)
    },

    onAuditEventsClick: () => {
      deps.onNavigateToAuditEvents(deps.userId)
    },

    onRetry: async () => {
      await get().initScreen()
    },

    onBackClick: () => {
      deps.onBack()
    }
  }))
}

const UserDetailContext = createContext<UserDetailStore | null>(null)

/** Props for {@link UserDetailProvider}. */
export interface UserDetailProviderProps {
  /** Injected dependencies. */
  dependencies: UserDetailStoreDependencies
  /** Optional initial state override. */
  initialState?: UserDetailScreenState
  /** React child nodes. */
  children: React.ReactNode
}

/** Context provider wrapping React components with user detail store state. */
export const UserDetailProvider: React.FC<UserDetailProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createUserDetailStore(dependencies, initialState))

  return (
    <UserDetailContext.Provider value={store}>
      {children}
    </UserDetailContext.Provider>
  )
}

/**
 * Custom React hook for selecting reactive state from {@link UserDetailStore}.
 *
 * @param selector - Selector function transforming store state
 * @returns Selected slice of store state
 */
export const useUserDetailStore = <T,>(
  selector: (state: UserDetailStoreState) => T
): T => {
  const store = useContext(UserDetailContext)
  if (!store) {
    throw new Error('useUserDetailStore must be used within UserDetailProvider')
  }
  return useStore(store, selector)
}
