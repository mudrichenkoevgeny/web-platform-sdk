import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestAuthData, createTestUserPrivate, UserAccountStatus } from '@mudrichenkoevgeny/shared-foundation'
import {
  LoginRepositoryMock,
  LoginByPhoneUseCaseMock,
  SendLoginConfirmationToPhoneUseCaseMock
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { LoginByPhoneStoreDependencies } from '@/ui/screens/auth/login/phone/LoginByPhoneStore'

export const loginByPhoneDependenciesMock = (
  overrides?: Partial<LoginByPhoneStoreDependencies>
): LoginByPhoneStoreDependencies => {
  const loginRepository = new LoginRepositoryMock()
  loginRepository.remainingDelayProvider = () => 0

  const sendLoginConfirmationToPhoneUseCase = new SendLoginConfirmationToPhoneUseCaseMock()
  sendLoginConfirmationToPhoneUseCase.resultProvider = async () =>
    appResultSuccess({ retryAfterSeconds: 60, numberOfSymbols: 6, expirationSeconds: 300 })

  const loginByPhoneUseCase = new LoginByPhoneUseCaseMock()
  loginByPhoneUseCase.resultProvider = async () =>
    appResultSuccess(
      createTestAuthData({
        userPrivate: createTestUserPrivate({
          accountStatus: UserAccountStatus.ACTIVE
        })
      })
    )

  return {
    loginRepository,
    sendLoginConfirmationToPhoneUseCase,
    loginByPhoneUseCase,
    onNavigateToTotp: () => {},
    onNavigateToPendingDeletion: () => {},
    onNavigateToAccountUnlock: () => {},
    onBack: () => {},
    onFinished: () => {},
    ...overrides
  }
}
