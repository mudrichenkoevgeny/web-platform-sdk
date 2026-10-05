import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import type { AppType } from '@mudrichenkoevgeny/shared-foundation'
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

export const createManagementLoginRootStore = (
  deps: ManagementLoginRootStoreDependencies,
  initialDestination: ManagementLoginDestination = { type: 'welcome' }
) => {
  return createStore<ManagementLoginRootStoreState>()((set, get) => ({
    stack: [initialDestination],

    push: (destination: ManagementLoginDestination) => {
      set({ stack: [...get().stack, destination] })
    },

    pop: () => {
      const currentStack = get().stack
      if (currentStack.length > 1) {
        set({ stack: currentStack.slice(0, currentStack.length - 1) })
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
