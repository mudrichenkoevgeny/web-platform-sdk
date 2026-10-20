import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType, createTestSessionToken, createTestUserPrivate, TEST_USER_ID, toUserIdOrThrow, UserAccountStatus } from '@mudrichenkoevgeny/shared-foundation'
import { LoginByEmailUseCaseMock } from '@/mock/usecase/auth/login/login-by-email-use-case-mock'
import type { LoginByEmailStoreDependencies } from '@/ui/screens/auth/login/email/login-by-email-store'

export const loginByEmailDependenciesMock = (
  overrides?: Partial<LoginByEmailStoreDependencies>
): LoginByEmailStoreDependencies => {
  const loginByEmailUseCase = new LoginByEmailUseCaseMock()
  loginByEmailUseCase.resultProvider = async () =>
    appResultSuccess({
      userPrivate: createTestUserPrivate({
        id: toUserIdOrThrow(TEST_USER_ID),
        accountStatus: UserAccountStatus.ACTIVE
      }),
      sessionToken: createTestSessionToken()
    })

  return {
    appType: AppType.CLIENT,
    loginByEmailUseCase,
    onNavigateToRegistrationByEmail: () => {},
    onNavigateToForgotPassword: () => {},
    onNavigateToTotp: () => {},
    onNavigateToPendingDeletion: () => {},
    onNavigateToAccountUnlock: () => {},
    onBack: () => {},
    onFinished: () => {},
    ...overrides
  }
}
