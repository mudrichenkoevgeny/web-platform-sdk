import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { RegistrationByEmailStoreDependencies } from '@/ui/screens/auth/registration/email/registration-by-email-store'

export const registrationByEmailDependenciesMock = (
  overrides?: Partial<RegistrationByEmailStoreDependencies>
): RegistrationByEmailStoreDependencies => ({
  registrationRepository: {
    getRemainingRegistrationConfirmationDelayInSeconds: () => 0
  } as any,
  sendRegistrationConfirmationToEmailUseCase: {
    execute: async () => appResultSuccess({ retryAfterSeconds: 60 })
  } as any,
  registrationByEmailUseCase: {
    execute: async () => appResultSuccess({
      userDetails: {
        id: 'usr_123',
        accountStatus: 'ACTIVE'
      }
    })
  } as any,
  validatePasswordUseCase: {
    execute: () => ({ isValid: true, errors: [] })
  } as any,
  onBack: () => {},
  onFinished: () => {},
  ...overrides
})
