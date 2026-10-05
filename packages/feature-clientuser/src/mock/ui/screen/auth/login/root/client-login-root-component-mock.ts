import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ClientLoginRootStoreDependencies } from '@/ui/screens/auth/login/root/ClientLoginRootStore'

export const clientLoginRootDependenciesMock = (
  overrides?: Partial<ClientLoginRootStoreDependencies>
): ClientLoginRootStoreDependencies => ({
  appType: AppType.CLIENT,
  getOpenGlobalSettingsUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  getAvailableUserAuthProvidersUseCase: {
    execute: async () => appResultSuccess({
      primary: ['EMAIL'],
      secondary: ['PHONE']
    })
  } as any,
  loginByGoogleUseCase: {} as any,
  loginByEmailUseCase: {} as any,
  loginRepository: {} as any,
  sendLoginConfirmationToPhoneUseCase: {} as any,
  loginByPhoneUseCase: {} as any,
  registrationRepository: {} as any,
  sendRegistrationConfirmationToEmailUseCase: {} as any,
  registrationByEmailUseCase: {} as any,
  resetPasswordRepository: {} as any,
  sendResetPasswordConfirmationToEmailUseCase: {} as any,
  resetEmailPasswordUseCase: {} as any,
  validatePasswordUseCase: {} as any,
  loginByTotpUseCase: {} as any,
  loginByTotpRecoveryCodeUseCase: {} as any,
  restoreUserUseCase: {} as any,
  logoutUseCase: {} as any,
  getUserIdentifiersUseCase: {} as any,
  unlockByGoogleUseCase: {} as any,
  sendUnlockEmailConfirmationUseCase: {} as any,
  sendUnlockPhoneConfirmationUseCase: {} as any,
  unlockByEmailUseCase: {} as any,
  unlockByPhoneUseCase: {} as any,
  externalLauncher: {} as any,
  onDismiss: () => {},
  onFinished: () => {},
  ...overrides
})
