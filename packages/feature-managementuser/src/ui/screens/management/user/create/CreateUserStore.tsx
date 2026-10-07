import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import { UserAccountStatus, UserRole } from '@mudrichenkoevgeny/shared-foundation'
import { FieldValidator } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { CreateUserUseCase } from '@/usecase/user/create-user-use-case'

const parseIntegerOrDefault = (value: string, defaultValue: number): number => {
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

export interface CreateUserScreenState {
  email: string
  password: string
  isPasswordVisible: boolean
  role: UserRole
  status: UserAccountStatus
  authorityLevel: string
  isLoading: boolean
  error: AppError | null
}

export interface CreateUserStoreDependencies {
  createUserUseCase: CreateUserUseCase
  onSuccess: () => void
  onBack: () => void
}

export interface CreateUserStoreState {
  screenState: CreateUserScreenState
  onEmailChanged: (value: string) => void
  onPasswordChanged: (value: string) => void
  onTogglePasswordVisibility: () => void
  onRoleChanged: (value: UserRole) => void
  onStatusChanged: (value: UserAccountStatus) => void
  onAuthorityLevelChanged: (value: string) => void
  onCreateClick: () => Promise<void>
  onBackClick: () => void
}

export type CreateUserStore = ReturnType<typeof createCreateUserStore>

export const createCreateUserStore = (
  deps: CreateUserStoreDependencies,
  initialState?: Partial<CreateUserScreenState>
) => {
  const defaultState: CreateUserScreenState = {
    email: '',
    password: '',
    isPasswordVisible: false,
    role: UserRole.USER,
    status: UserAccountStatus.ACTIVE,
    authorityLevel: '0',
    isLoading: false,
    error: null,
    ...initialState
  }

  return createStore<CreateUserStoreState>()((set, get) => ({
    screenState: defaultState,

    onEmailChanged: (value: string) => {
      set({ screenState: { ...get().screenState, email: value, error: null } })
    },

    onPasswordChanged: (value: string) => {
      set({ screenState: { ...get().screenState, password: value, error: null } })
    },

    onTogglePasswordVisibility: () => {
      set({ screenState: { ...get().screenState, isPasswordVisible: !get().screenState.isPasswordVisible } })
    },

    onRoleChanged: (value: UserRole) => {
      set({ screenState: { ...get().screenState, role: value, error: null } })
    },

    onStatusChanged: (value: UserAccountStatus) => {
      set({ screenState: { ...get().screenState, status: value, error: null } })
    },

    onAuthorityLevelChanged: (value: string) => {
      if (value === '') {
        set({ screenState: { ...get().screenState, authorityLevel: value, error: null } })
        return
      }
      const trimmed = value.trim()
      if (/^\d+$/.test(trimmed)) {
        const num = parseInt(trimmed, 10)
        if (num >= 0 && num <= 100) {
          set({ screenState: { ...get().screenState, authorityLevel: trimmed, error: null } })
        }
      }
    },

    onCreateClick: async () => {
      const current = get().screenState
      if (current.isLoading || !FieldValidator.isValidEmail(current.email)) {
        return
      }

      set({ screenState: { ...current, isLoading: true, error: null } })

      const authLevel = parseIntegerOrDefault(current.authorityLevel, 0)

      const result = await deps.createUserUseCase.execute({
        email: current.email.trim(),
        password: current.password.trim() || null,
        role: current.role,
        account_status: current.status,
        authority_level: authLevel,
        permission_codes: []
      })

      if (isSuccess(result)) {
        deps.onSuccess()
      } else {
        set({ screenState: { ...get().screenState, isLoading: false, error: result.error } })
      }
    },

    onBackClick: () => {
      deps.onBack()
    }
  }))
}

const CreateUserContext = createContext<CreateUserStore | null>(null)

export interface CreateUserProviderProps {
  dependencies: CreateUserStoreDependencies
  initialState?: Partial<CreateUserScreenState>
  children: React.ReactNode
}

export const CreateUserProvider: React.FC<CreateUserProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createCreateUserStore(dependencies, initialState))

  return (
    <CreateUserContext.Provider value={store}>
      {children}
    </CreateUserContext.Provider>
  )
}

export const useCreateUserStore = <T,>(
  selector: (state: CreateUserStoreState) => T
): T => {
  const store = useContext(CreateUserContext)
  if (!store) {
    throw new Error('useCreateUserStore must be used within CreateUserProvider')
  }
  return useStore(store, selector)
}
