import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import { UserAccountStatus, UserRole } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess, parseIntegerOrDefault } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { CreateUserUseCase } from '@/usecase/user/CreateUserUseCase'

export interface CreateUserScreenState {
  email: string
  password: string
  role: string
  status: string
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
  onRoleChanged: (value: string) => void
  onStatusChanged: (value: string) => void
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
    role: 'USER',
    status: 'ACTIVE',
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

    onRoleChanged: (value: string) => {
      set({ screenState: { ...get().screenState, role: value, error: null } })
    },

    onStatusChanged: (value: string) => {
      set({ screenState: { ...get().screenState, status: value, error: null } })
    },

    onAuthorityLevelChanged: (value: string) => {
      set({ screenState: { ...get().screenState, authorityLevel: value, error: null } })
    },

    onCreateClick: async () => {
      const current = get().screenState
      if (current.isLoading) {
        return
      }

      set({ screenState: { ...current, isLoading: true, error: null } })

      const authLevel = parseIntegerOrDefault(current.authorityLevel, 0)
      const resolvedRole = Object.values(UserRole).find(
        (r) => r.toLowerCase() === current.role.toLowerCase()
      ) ?? UserRole.USER
      const resolvedStatus = Object.values(UserAccountStatus).find(
        (s) => s.toLowerCase() === current.status.toLowerCase()
      ) ?? UserAccountStatus.ACTIVE

      const result = await deps.createUserUseCase.execute({
        email: current.email.trim(),
        password: current.password ? current.password.trim() : undefined,
        role: resolvedRole,
        status: resolvedStatus,
        authorityLevel: authLevel,
        permissionCodes: []
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
