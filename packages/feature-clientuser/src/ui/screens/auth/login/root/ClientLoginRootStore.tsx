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
import type { ClientLoginDestination } from '@/ui/screens/auth/login/client-login-destination'

export interface ClientLoginRootStoreDependencies {
  appType: AppType
  getOpenGlobalSettingsUseCase: GetOpenGlobalSettingsUseCase
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
  loginStep?: string
  mfaToken?: string
  lockoutType?: AccountLockoutType | null
  lockoutUntil?: number | null
  onStepChange?: (step: string) => void
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

export function mapStepToClientLoginDestination(
  step?: string,
  mfaToken?: string,
  lockoutType?: AccountLockoutType | null,
  lockoutUntil?: number | null
): ClientLoginDestination | null {
  if (!step) {
    return null
  }
  switch (step) {
    case 'welcome':
      return { type: 'welcome' }
    case 'email':
    case 'loginByEmail':
      return { type: 'loginByEmail' }
    case 'phone':
    case 'loginByPhone':
      return { type: 'loginByPhone' }
    case 'registration':
    case 'registrationByEmail':
      return { type: 'registrationByEmail' }
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

export const createClientLoginRootStore = (
  deps: ClientLoginRootStoreDependencies,
  initialDestination?: ClientLoginDestination
) => {
  const startDestination =
    initialDestination ??
    mapStepToClientLoginDestination(deps.loginStep, deps.mfaToken, deps.lockoutType, deps.lockoutUntil) ??
    { type: 'welcome' }

  return createStore<ClientLoginRootStoreState>()((set, get) => ({
    stack: [startDestination],

    push: (destination: ClientLoginDestination) => {
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

  useEffect(() => {
    store.setState((state) => {
      const currentTop = state.stack[state.stack.length - 1]
      const mappedDestination = mapStepToClientLoginDestination(
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
