import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementLoginRootStoreDependencies } from '@/ui/screens/auth/login/root/ManagementLoginRootStore'

export const managementLoginRootDependenciesMock = (
  overrides?: Partial<ManagementLoginRootStoreDependencies>
): ManagementLoginRootStoreDependencies => ({
  appType: AppType.MANAGEMENT,
  getOpenGlobalSettingsUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  getAvailableUserAuthProvidersUseCase: {
    execute: async () =>
      appResultSuccess({
        primary: ['EMAIL'],
        secondary: []
      })
  } as any,
  loginByEmailUseCase: {} as any,
  resetPasswordRepository: {} as any,
  sendResetPasswordConfirmationToEmailUseCase: {} as any,
  resetEmailPasswordUseCase: {} as any,
  validatePasswordUseCase: {} as any,
  loginByTotpUseCase: {} as any,
  loginByTotpRecoveryCodeUseCase: {} as any,
  restoreUserUseCase: {} as any,
  logoutUseCase: {} as any,
  getUserIdentifiersUseCase: {} as any,
  sendUnlockEmailConfirmationUseCase: {} as any,
  sendUnlockPhoneConfirmationUseCase: {} as any,
  unlockByEmailUseCase: {} as any,
  unlockByPhoneUseCase: {} as any,
  externalLauncher: {} as any,
  onDismiss: () => {},
  onFinished: () => {},
  ...overrides
})
