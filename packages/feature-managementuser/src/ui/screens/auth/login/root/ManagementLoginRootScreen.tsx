import React, { forwardRef } from 'react'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { cn } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  LoginByEmailScreen,
  LoginByTotpScreen,
  LoginRootContainer,
  LoginWelcomeScreen,
  PendingDeletionScreen,
  ResetEmailPasswordScreen,
  UnlockMethodSelectionScreen
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { FeatureUserStrings } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import {
  ManagementLoginRootProvider,
  useManagementLoginRootStore
} from '@/ui/screens/auth/login/root/ManagementLoginRootStore'
import type { ManagementLoginRootStoreDependencies } from '@/ui/screens/auth/login/root/ManagementLoginRootStore'

const ManagementLoginRootContent: React.FC<{
  dependencies: ManagementLoginRootStoreDependencies
  strings?: FeatureUserStrings
}> = ({ dependencies, strings }) => {
  const stack = useManagementLoginRootStore((s) => s.stack)
  const push = useManagementLoginRootStore((s) => s.push)
  const pop = useManagementLoginRootStore((s) => s.pop)
  const onDismiss = useManagementLoginRootStore((s) => s.onDismiss)

  const currentDestination = stack[stack.length - 1]

  const renderActiveScreen = () => {
    switch (currentDestination.type) {
      case 'welcome':
        return (
          <LoginWelcomeScreen
            dependencies={{
              appType: AppType.MANAGEMENT,
              externalLauncher: dependencies.externalLauncher,
              getOpenGlobalSettingsUseCase: dependencies.getOpenGlobalSettingsUseCase,
              getAvailableUserAuthProvidersUseCase: dependencies.getAvailableUserAuthProvidersUseCase,
              loginByGoogleUseCase: null,
              onNavigateToLoginByEmail: () => push({ type: 'loginByEmail' }),
              onNavigateToLoginByPhone: () => {},
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
              appType: AppType.MANAGEMENT,
              loginByEmailUseCase: dependencies.loginByEmailUseCase,
              onNavigateToRegistrationByEmail: () => {},
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
              unlockByGoogleUseCase: null,
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

export interface ManagementLoginRootScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: ManagementLoginRootStoreDependencies
  strings?: FeatureUserStrings
}

export const ManagementLoginRootScreen = forwardRef<HTMLDivElement, ManagementLoginRootScreenProps>(
  ({ dependencies, strings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <ManagementLoginRootProvider dependencies={dependencies}>
          <ManagementLoginRootContent dependencies={dependencies} strings={strings} />
        </ManagementLoginRootProvider>
      </div>
    )
  }
)

ManagementLoginRootScreen.displayName = 'ManagementLoginRootScreen'
