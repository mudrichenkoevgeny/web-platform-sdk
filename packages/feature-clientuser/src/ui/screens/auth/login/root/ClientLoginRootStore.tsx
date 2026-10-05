import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import type { AppType } from '@mudrichenkoevgeny/shared-foundation'
import type {
  GetGlobalSettingsUseCase,
  ExternalLauncher
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ValidatePasswordUseCase } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type {
  GetAvailableUserAuthProvidersUseCase,
  GetUserIdentifiersUseCase,
  LoginByEmailUseCase,
  LoginByGoogleUseCase,
  LoginByPhoneUseCase,
  LoginByTotpRecoveryCodeUseCase,
  LoginByTotpUseCase,
  LoginRepository,
  LogoutUseCase,
  RegistrationByEmailUseCase,
  RegistrationRepository,
  ResetEmailPasswordUseCase,
  ResetPasswordRepository,
  RestoreUserUseCase,
  SendLoginConfirmationToPhoneUseCase,
  SendRegistrationConfirmationToEmailUseCase,
  SendResetPasswordConfirmationToEmailUseCase,
  SendUnlockEmailConfirmationUseCase,
  SendUnlockPhoneConfirmationUseCase,
  UnlockByEmailUseCase,
  UnlockByGoogleUseCase,
  UnlockByPhoneUseCase
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { ClientLoginDestination } from '@/ui/screens/auth/login/ClientLoginDestination'

export interface ClientLoginRootStoreDependencies {
  appType: AppType
  getOpenGlobalSettingsUseCase: GetGlobalSettingsUseCase
  getAvailableUserAuthProvidersUseCase: GetAvailableUserAuthProvidersUseCase
  loginByGoogleUseCase: LoginByGoogleUseCase
  loginByEmailUseCase: LoginByEmailUseCase
  loginRepository: LoginRepository
  sendLoginConfirmationToPhoneUseCase: SendLoginConfirmationToPhoneUseCase
  loginByPhoneUseCase: LoginByPhoneUseCase
  registrationRepository: RegistrationRepository
  sendRegistrationConfirmationToEmailUseCase: SendRegistrationConfirmationToEmailUseCase
  registrationByEmailUseCase: RegistrationByEmailUseCase
  resetPasswordRepository: ResetPasswordRepository
  sendResetPasswordConfirmationToEmailUseCase: SendResetPasswordConfirmationToEmailUseCase
  resetEmailPasswordUseCase: ResetEmailPasswordUseCase
  validatePasswordUseCase: ValidatePasswordUseCase
  loginByTotpUseCase: LoginByTotpUseCase
  loginByTotpRecoveryCodeUseCase: LoginByTotpRecoveryCodeUseCase
  restoreUserUseCase: RestoreUserUseCase
  logoutUseCase: LogoutUseCase
  getUserIdentifiersUseCase: GetUserIdentifiersUseCase
  unlockByGoogleUseCase: UnlockByGoogleUseCase
  sendUnlockEmailConfirmationUseCase: SendUnlockEmailConfirmationUseCase
  sendUnlockPhoneConfirmationUseCase: SendUnlockPhoneConfirmationUseCase
  unlockByEmailUseCase: UnlockByEmailUseCase
  unlockByPhoneUseCase: UnlockByPhoneUseCase
  externalLauncher: ExternalLauncher
  onDismiss: () => void
  onFinished: () => void
}

export interface ClientLoginRootStoreState {
  stack: ClientLoginDestination[]
  push: (destination: ClientLoginDestination) => void
  pop: () => void
  onDismiss: () => void
}

export type ClientLoginRootStore = ReturnType<typeof createClientLoginRootStore>

export const createClientLoginRootStore = (
  deps: ClientLoginRootStoreDependencies,
  initialDestination: ClientLoginDestination = { type: 'welcome' }
) => {
  return createStore<ClientLoginRootStoreState>()((set, get) => ({
    stack: [initialDestination],

    push: (destination: ClientLoginDestination) => {
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

const ClientLoginRootContext = createContext<ClientLoginRootStore | null>(null)

export interface ClientLoginRootProviderProps {
  dependencies: ClientLoginRootStoreDependencies
  initialDestination?: ClientLoginDestination
  children: React.ReactNode
}

export const ClientLoginRootProvider: React.FC<ClientLoginRootProviderProps> = ({
  dependencies,
  initialDestination,
  children
}) => {
  const [store] = useState(() => createClientLoginRootStore(dependencies, initialDestination))

  return (
    <ClientLoginRootContext.Provider value={store}>
      {children}
    </ClientLoginRootContext.Provider>
  )
}

export const useClientLoginRootStore = <T,>(
  selector: (state: ClientLoginRootStoreState) => T
): T => {
  const store = useContext(ClientLoginRootContext)
  if (!store) {
    throw new Error('useClientLoginRootStore must be used within ClientLoginRootProvider')
  }
  return useStore(store, selector)
}
