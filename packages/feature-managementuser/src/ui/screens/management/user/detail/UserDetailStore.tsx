import React, { createContext, useContext, useEffect, useState } from 'react'
import { createStore, useStore } from 'zustand'
import { AccountLockoutType } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

const parseIntegerOrDefault = (value: string, defaultValue: number): number => {
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}
import type { UserDetails, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { DeleteUserUseCase } from '@/usecase/user/delete-user-use-case'
import type { GetUserUseCase } from '@/usecase/user/get-user-use-case'
import type { UpdateUserUseCase } from '@/usecase/user/update-user-use-case'
import type { ManagementDisableTotpUseCase } from '@/usecase/user/security/management-disable-totp-use-case'

export type UserDetailScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'error'
      error: AppError
    }
  | {
      status: 'content'
      user: UserDetails
      authorityLevelInput: string
      accountStatusInput: string
      lockoutTypeInput: string
      temporaryLockoutUntilInput: string
      isSaving: boolean
      saveError: AppError | null
      isDeleting: boolean
      deleteError: AppError | null
      isDisablingTotp: boolean
      disableTotpError: AppError | null
      isDeleteConfirmationVisible: boolean
    }

export interface UserDetailStoreDependencies {
  userId: UserId
  getUserUseCase: GetUserUseCase
  updateUserUseCase: UpdateUserUseCase
  deleteUserUseCase: DeleteUserUseCase
  managementDisableTotpUseCase: ManagementDisableTotpUseCase
  onNavigateToSessions: (userId: UserId) => void
  onNavigateToIdentifiers: (userId: UserId) => void
  onBack: () => void
}

export interface UserDetailStoreState {
  screenState: UserDetailScreenState
  initScreen: () => Promise<void>
  onAuthorityLevelChanged: (value: string) => void
  onAccountStatusChanged: (value: string) => void
  onLockoutTypeChanged: (value: string) => void
  onTemporaryLockoutUntilChanged: (value: string) => void
  onUpdateClick: () => Promise<void>
  onDeleteClick: () => void
  onConfirmDeleteClick: () => Promise<void>
  onDismissDeleteDialog: () => void
  onDisableTotpClick: () => Promise<void>
  onSessionsClick: () => void
  onIdentifiersClick: () => void
  onRetry: () => Promise<void>
  onBackClick: () => void
}

export type UserDetailStore = ReturnType<typeof createUserDetailStore>

export const hasUserDetailChanges = (state: Extract<UserDetailScreenState, { status: 'content' }>): boolean => {
  const initialAuthLevel = state.user.authorityLevel.toString()
  const currentAuthLevel = state.authorityLevelInput.trim() || '0'
  const initialAccountStatus = String(state.user.accountStatus)
  const initialLockoutType = String(state.user.lockoutType)
  const initialTempLockout = state.user.temporaryLockoutUntil ? String(state.user.temporaryLockoutUntil) : ''

  return (
    currentAuthLevel !== initialAuthLevel ||
    state.accountStatusInput.toLowerCase() !== initialAccountStatus.toLowerCase() ||
    state.lockoutTypeInput.toLowerCase() !== initialLockoutType.toLowerCase() ||
    state.temporaryLockoutUntilInput !== initialTempLockout
  )
}

export const createUserDetailStore = (
  deps: UserDetailStoreDependencies,
  initialState?: UserDetailScreenState
) => {
  return createStore<UserDetailStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },

    initScreen: async () => {
      set({ screenState: { status: 'loading' } })
      const result = await deps.getUserUseCase.execute(deps.userId)

      if (isSuccess(result)) {
        const user = result.data
        set({
          screenState: {
            status: 'content',
            user,
            authorityLevelInput: String(user.authorityLevel),
            accountStatusInput: String(user.accountStatus),
            lockoutTypeInput: String(user.lockoutType ?? 'NONE'),
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
            status: 'error',
            error: result.error
          }
        })
      }
    },

    onAuthorityLevelChanged: (value: string) => {
      const current = get().screenState
      if (current.status !== 'content') {
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

    onAccountStatusChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, accountStatusInput: value, saveError: null } })
      }
    },

    onLockoutTypeChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, lockoutTypeInput: value, saveError: null } })
      }
    },

    onTemporaryLockoutUntilChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, temporaryLockoutUntilInput: value, saveError: null } })
      }
    },

    onUpdateClick: async () => {
      const current = get().screenState
      if (current.status !== 'content' || current.isSaving) {
        return
      }

      set({ screenState: { ...current, isSaving: true, saveError: null } })

      const authLevel = parseIntegerOrDefault(current.authorityLevelInput, 0)
      const status = current.accountStatusInput || String(current.user.accountStatus)
      const resolvedLockout = Object.values(AccountLockoutType).find(
        (t) => t.toLowerCase() === current.lockoutTypeInput.toLowerCase()
      ) ?? current.user.lockoutType
      const tempLockout = current.temporaryLockoutUntilInput
        ? parseIntegerOrDefault(current.temporaryLockoutUntilInput, 0)
        : current.user.temporaryLockoutUntil

      const result = await deps.updateUserUseCase.execute(deps.userId, {
        accountStatus: status as any,
        authorityLevel: authLevel,
        lockoutType: resolvedLockout,
        temporaryLockoutUntil: tempLockout
      })

      if (isSuccess(result)) {
        await get().initScreen()
      } else {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({ screenState: { ...updated, isSaving: false, saveError: result.error } })
        }
      }
    },

    onDeleteClick: () => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, isDeleteConfirmationVisible: true, deleteError: null } })
      }
    },

    onConfirmDeleteClick: async () => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      set({ screenState: { ...current, isDeleteConfirmationVisible: false, isDeleting: true, deleteError: null } })

      const result = await deps.deleteUserUseCase.execute(deps.userId)
      if (isSuccess(result)) {
        deps.onBack()
      } else {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({ screenState: { ...updated, isDeleting: false, deleteError: result.error } })
        }
      }
    },

    onDismissDeleteDialog: () => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, isDeleteConfirmationVisible: false } })
      }
    },

    onDisableTotpClick: async () => {
      const current = get().screenState
      if (current.status !== 'content' || current.isDisablingTotp) {
        return
      }

      set({ screenState: { ...current, isDisablingTotp: true, disableTotpError: null } })

      const result = await deps.managementDisableTotpUseCase.execute(deps.userId)
      if (isSuccess(result)) {
        await get().initScreen()
      } else {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({ screenState: { ...updated, isDisablingTotp: false, disableTotpError: result.error } })
        }
      }
    },

    onSessionsClick: () => {
      deps.onNavigateToSessions(deps.userId)
    },

    onIdentifiersClick: () => {
      deps.onNavigateToIdentifiers(deps.userId)
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

export interface UserDetailProviderProps {
  dependencies: UserDetailStoreDependencies
  initialState?: UserDetailScreenState
  children: React.ReactNode
}

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

export const useUserDetailStore = <T,>(
  selector: (state: UserDetailStoreState) => T
): T => {
  const store = useContext(UserDetailContext)
  if (!store) {
    throw new Error('useUserDetailStore must be used within UserDetailProvider')
  }
  return useStore(store, selector)
}
