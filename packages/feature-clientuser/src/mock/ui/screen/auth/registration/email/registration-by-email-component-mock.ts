import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestAuthData, UserAccountStatus } from '@mudrichenkoevgeny/shared-foundation'
import {
  RegistrationRepositoryMock,
  RegistrationByEmailUseCaseMock,
  SendRegistrationConfirmationToEmailUseCaseMock
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ValidatePasswordUseCaseMock } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { RegistrationByEmailStoreDependencies } from '@/ui/screens/auth/registration/email/RegistrationByEmailStore'

export const registrationByEmailDependenciesMock = (
  overrides?: Partial<RegistrationByEmailStoreDependencies>
): RegistrationByEmailStoreDependencies => {
  const registrationRepository = new RegistrationRepositoryMock()
  registrationRepository.remainingDelayProvider = () => 0

  const sendRegistrationConfirmationToEmailUseCase = new SendRegistrationConfirmationToEmailUseCaseMock()
  sendRegistrationConfirmationToEmailUseCase.resultProvider = async () =>
    appResultSuccess({ retryAfterSeconds: 60, numberOfSymbols: 6, expirationSeconds: 300 })

  const registrationByEmailUseCase = new RegistrationByEmailUseCaseMock()
  registrationByEmailUseCase.resultProvider = async () =>
    appResultSuccess(
      createTestAuthData({
        userPrivate: {
          accountStatus: UserAccountStatus.ACTIVE
        }
      })
    )

  const validatePasswordUseCase = new ValidatePasswordUseCaseMock()

  return {
    registrationRepository,
    sendRegistrationConfirmationToEmailUseCase,
    registrationByEmailUseCase,
    validatePasswordUseCase,
    onBack: () => {},
    onFinished: () => {},
    ...overrides
  }
}
