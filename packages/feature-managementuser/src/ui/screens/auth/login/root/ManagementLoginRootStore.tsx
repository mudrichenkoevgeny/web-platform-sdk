import React, { createContext, useContext, useEffect, useState } from 'react'
import { createStore, useStore } from 'zustand'
import type { AccountLockoutType, AppType } from '@mudrichenkoevgeny/shared-foundation'
import type { ExternalLauncher } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GetOpenGlobalSettingsUseCase } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type { ValidatePasswordUseCase } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type {
  GetAvailableUserAuthProvidersUseCase,
  GetUserIdentifiersUseCase,
  LoginByEmailUseCase,
  LoginByTotpRecoveryCodeUseCase,
  LoginByTotpUseCase,
  LogoutUseCase,
  ResetEmailPasswordUseCase,
  ResetPasswordRepository,
  RestoreUserUseCase,
  SendResetPasswordConfirmationToEmailUseCase,
  SendUnlockEmailConfirmationUseCase,
  SendUnlockPhoneConfirmationUseCase,
  UnlockByEmailUseCase,
  UnlockByPhoneUseCase
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { ManagementLoginDestination } from '@/ui/screens/auth/login/management-login-destination'

export interface ManagementLoginRootStoreDependencies {
  appType: AppType
  getOpenGlobalSettingsUseCase: GetOpenGlobalSettingsUseCase
  getAvailableUserAuthProvidersUseCase: GetAvailableUserAuthProvidersUseCase
  loginByEmailUseCase: LoginByEmailUseCase
  resetPasswordRepository: ResetPasswordRepository
  sendResetPasswordConfirmationToEmailUseCase: SendResetPasswordConfirmationToEmailUseCase
  resetEmailPasswordUseCase: ResetEmailPasswordUseCase
  validatePasswordUseCase: ValidatePasswordUseCase
  loginByTotpUseCase: LoginByTotpUseCase
  loginByTotpRecoveryCodeUseCase: LoginByTotpRecoveryCodeUseCase
  restoreUserUseCase: RestoreUserUseCase
  logoutUseCase: LogoutUseCase
  getUserIdentifiersUseCase: GetUserIdentifiersUseCase
  sendUnlockEmailConfirmationUseCase: SendUnlockEmailConfirmationUseCase
  sendUnlockPhoneConfirmationUseCase: SendUnlockPhoneConfirmationUseCase
  unlockByEmailUseCase: UnlockByEmailUseCase
  unlockByPhoneUseCase: UnlockByPhoneUseCase
  externalLauncher: ExternalLauncher
  loginStep?: string
  mfaToken?: string
  lockoutType?: AccountLockoutType | null
  lockoutUntil?: number | null
  onStepChange?: (step: string) => void
  onDismiss: () => void
  onFinished: () => void
}

export interface ManagementLoginRootStoreState {
  stack: ManagementLoginDestination[]
  push: (destination: ManagementLoginDestination) => void
  pop: () => void
  onDismiss: () => void
}

export type ManagementLoginRootStore = ReturnType<typeof createManagementLoginRootStore>

export function mapStepToManagementLoginDestination(
  step?: string,
  mfaToken?: string,
  lockoutType?: AccountLockoutType | null,
  lockoutUntil?: number | null
): ManagementLoginDestination | null {
  if (!step) {
    return null
  }
  switch (step) {
    case 'welcome':
      return { type: 'welcome' }
    case 'email':
    case 'loginByEmail':
      return { type: 'loginByEmail' }
    case 'reset_password':
    case 'resetEmailPassword':
      return { type: 'resetEmailPassword' }
    case 'totp':
    case 'loginByTotp':
      return { type: 'loginByTotp', mfaToken: mfaToken ?? '' }
    case 'pending_deletion':
    case 'pendingDeletion':
      return { type: 'pendingDeletion' }
    case 'unlock':
    case 'accountUnlock':
      return { type: 'accountUnlock', lockoutType, lockoutUntil }
    default:
      return null
  }
}

export const createManagementLoginRootStore = (
  deps: ManagementLoginRootStoreDependencies,
  initialDestination?: ManagementLoginDestination
) => {
  const startDestination =
    initialDestination ??
    mapStepToManagementLoginDestination(deps.loginStep, deps.mfaToken, deps.lockoutType, deps.lockoutUntil) ??
    { type: 'welcome' }

  return createStore<ManagementLoginRootStoreState>()((set, get) => ({
    stack: [startDestination],

    push: (destination: ManagementLoginDestination) => {
      deps.onStepChange?.(destination.type)
      set({ stack: [...get().stack, destination] })
    },

    pop: () => {
      const currentStack = get().stack
      if (currentStack.length > 1) {
        const nextStack = currentStack.slice(0, currentStack.length - 1)
        const previousDestination = nextStack[nextStack.length - 1]
        if (previousDestination) {
          deps.onStepChange?.(previousDestination.type)
        }
        set({ stack: nextStack })
      } else {
        deps.onDismiss()
      }
    },

    onDismiss: () => {
      deps.onDismiss()
    }
  }))
}

const ManagementLoginRootContext = createContext<ManagementLoginRootStore | null>(null)

export interface ManagementLoginRootProviderProps {
  dependencies: ManagementLoginRootStoreDependencies
  initialDestination?: ManagementLoginDestination
  children: React.ReactNode
}

export const ManagementLoginRootProvider: React.FC<ManagementLoginRootProviderProps> = ({
  dependencies,
  initialDestination,
  children
}) => {
  const [store] = useState(() => createManagementLoginRootStore(dependencies, initialDestination))

  useEffect(() => {
    store.setState((state) => {
      const currentTop = state.stack[state.stack.length - 1]
      const mappedDestination = mapStepToManagementLoginDestination(
        dependencies.loginStep,
        dependencies.mfaToken,
        dependencies.lockoutType,
        dependencies.lockoutUntil
      )

      if (mappedDestination && currentTop?.type !== mappedDestination.type) {
        return {
          ...state,
          dependencies,
          stack: [mappedDestination]
        }
      }
      return { ...state, dependencies }
    })
  }, [store, dependencies])

  return (
    <ManagementLoginRootContext.Provider value={store}>
      {children}
    </ManagementLoginRootContext.Provider>
  )
}

export const useManagementLoginRootStore = <T,>(
  selector: (state: ManagementLoginRootStoreState) => T
): T => {
  const store = useContext(ManagementLoginRootContext)
  if (!store) {
    throw new Error('useManagementLoginRootStore must be used within ManagementLoginRootProvider')
  }
  return useStore(store, selector)
}
