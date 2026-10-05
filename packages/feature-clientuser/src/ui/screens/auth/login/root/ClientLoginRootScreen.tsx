import React, { forwardRef } from 'react'
import { cn } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  enUserStrings,
  LoginByEmailScreen,
  LoginByTotpScreen,
  LoginRootContainer,
  LoginWelcomeScreen,
  PendingDeletionScreen,
  ResetEmailPasswordScreen,
  UnlockMethodSelectionScreen
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { FeatureUserStrings } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { LoginByPhoneScreen } from '@/ui/screens/auth/login/phone/LoginByPhoneScreen'
import { RegistrationByEmailScreen } from '@/ui/screens/auth/registration/email/RegistrationByEmailScreen'
import {
  ClientLoginRootProvider,
  useClientLoginRootStore
} from '@/ui/screens/auth/login/root/ClientLoginRootStore'
import type { ClientLoginRootStoreDependencies } from '@/ui/screens/auth/login/root/ClientLoginRootStore'

const ClientLoginRootContent: React.FC<{
  dependencies: ClientLoginRootStoreDependencies
  strings?: FeatureUserStrings
}> = ({ dependencies, strings = enUserStrings }) => {
  const stack = useClientLoginRootStore((s) => s.stack)
  const push = useClientLoginRootStore((s) => s.push)
  const pop = useClientLoginRootStore((s) => s.pop)
  const onDismiss = useClientLoginRootStore((s) => s.onDismiss)

  const currentDestination = stack[stack.length - 1]

  const renderActiveScreen = () => {
    switch (currentDestination.type) {
      case 'welcome':
        return (
          <LoginWelcomeScreen
            dependencies={{
              appType: dependencies.appType,
              externalLauncher: dependencies.externalLauncher,
              getOpenGlobalSettingsUseCase: dependencies.getOpenGlobalSettingsUseCase,
              getAvailableUserAuthProvidersUseCase: dependencies.getAvailableUserAuthProvidersUseCase,
              loginByGoogleUseCase: dependencies.loginByGoogleUseCase,
              onNavigateToLoginByEmail: () => push({ type: 'loginByEmail' }),
              onNavigateToLoginByPhone: () => push({ type: 'loginByPhone' }),
              onNavigateToTotp: (mfaToken: string) => push({ type: 'loginByTotp', mfaToken }),
              onNavigateToPendingDeletion: () => push({ type: 'pendingDeletion' }),
              onNavigateToAccountUnlock: (lockoutType, lockoutUntil) =>
                push({ type: 'accountUnlock', lockoutType, lockoutUntil }),
              onFinished: dependencies.onFinished
            }}
            strings={strings}
          />
        )

      case 'loginByEmail':
        return (
          <LoginByEmailScreen
            dependencies={{
              appType: dependencies.appType,
              loginByEmailUseCase: dependencies.loginByEmailUseCase,
              onNavigateToRegistrationByEmail: () => push({ type: 'registrationByEmail' }),
              onNavigateToForgotPassword: () => push({ type: 'resetEmailPassword' }),
              onNavigateToTotp: (mfaToken: string) => push({ type: 'loginByTotp', mfaToken }),
              onNavigateToPendingDeletion: () => push({ type: 'pendingDeletion' }),
              onNavigateToAccountUnlock: (lockoutType, lockoutUntil) =>
                push({ type: 'accountUnlock', lockoutType, lockoutUntil }),
              onBack: pop,
              onFinished: dependencies.onFinished
            }}
            strings={strings}
          />
        )

      case 'loginByPhone':
        return (
          <LoginByPhoneScreen
            dependencies={{
              loginRepository: dependencies.loginRepository,
              sendLoginConfirmationToPhoneUseCase: dependencies.sendLoginConfirmationToPhoneUseCase,
              loginByPhoneUseCase: dependencies.loginByPhoneUseCase,
              onNavigateToTotp: (mfaToken: string) => push({ type: 'loginByTotp', mfaToken }),
              onNavigateToPendingDeletion: () => push({ type: 'pendingDeletion' }),
              onNavigateToAccountUnlock: (lockoutType, lockoutUntil) =>
                push({ type: 'accountUnlock', lockoutType, lockoutUntil }),
              onBack: pop,
              onFinished: dependencies.onFinished
            }}
            strings={strings}
          />
        )

      case 'registrationByEmail':
        return (
          <RegistrationByEmailScreen
            dependencies={{
              registrationRepository: dependencies.registrationRepository,
              sendRegistrationConfirmationToEmailUseCase: dependencies.sendRegistrationConfirmationToEmailUseCase,
              registrationByEmailUseCase: dependencies.registrationByEmailUseCase,
              validatePasswordUseCase: dependencies.validatePasswordUseCase,
              onBack: pop,
              onFinished: dependencies.onFinished
            }}
            strings={strings}
          />
        )

      case 'loginByTotp':
        return (
          <LoginByTotpScreen
            dependencies={{
              mfaToken: currentDestination.mfaToken,
              loginByTotpUseCase: dependencies.loginByTotpUseCase,
              loginByTotpRecoveryCodeUseCase: dependencies.loginByTotpRecoveryCodeUseCase,
              onNavigateToPendingDeletion: () => push({ type: 'pendingDeletion' }),
              onBack: pop,
              onFinished: dependencies.onFinished
            }}
            strings={strings}
          />
        )

      case 'pendingDeletion':
        return (
          <PendingDeletionScreen
            dependencies={{
              restoreUserUseCase: dependencies.restoreUserUseCase,
              logoutUseCase: dependencies.logoutUseCase,
              onRestoreSuccess: dependencies.onFinished,
              onSignOut: pop
            }}
            strings={strings}
          />
        )

      case 'resetEmailPassword':
        return (
          <ResetEmailPasswordScreen
            dependencies={{
              resetPasswordRepository: dependencies.resetPasswordRepository,
              sendResetPasswordConfirmationToEmailUseCase:
                dependencies.sendResetPasswordConfirmationToEmailUseCase,
              resetEmailPasswordUseCase: dependencies.resetEmailPasswordUseCase,
              validatePasswordUseCase: dependencies.validatePasswordUseCase,
              onBack: pop,
              onFinished: dependencies.onFinished
            }}
            strings={strings}
          />
        )

      case 'accountUnlock':
        return (
          <UnlockMethodSelectionScreen
            dependencies={{
              lockoutType: currentDestination.lockoutType ?? null,
              lockoutUntil: currentDestination.lockoutUntil ?? null,
              getUserIdentifiersUseCase: dependencies.getUserIdentifiersUseCase,
              unlockByGoogleUseCase: dependencies.unlockByGoogleUseCase,
              onNavigateToEmailInput: () => {},
              onNavigateToPhoneInput: () => {},
              onUnlockSuccess: pop,
              onBack: pop
            }}
            strings={strings}
          />
        )
    }
  }

  return (
    <LoginRootContainer onDismiss={onDismiss}>
      {renderActiveScreen()}
    </LoginRootContainer>
  )
}

export interface ClientLoginRootScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: ClientLoginRootStoreDependencies
  strings?: FeatureUserStrings
}

export const ClientLoginRootScreen = forwardRef<HTMLDivElement, ClientLoginRootScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <ClientLoginRootProvider dependencies={dependencies}>
          <ClientLoginRootContent dependencies={dependencies} strings={strings} />
        </ClientLoginRootProvider>
      </div>
    )
  }
)

ClientLoginRootScreen.displayName = 'ClientLoginRootScreen'
