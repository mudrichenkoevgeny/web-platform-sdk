import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestSessionToken, createTestUserPrivate, TEST_USER_ID, toUserIdOrThrow, UserAccountStatus } from '@mudrichenkoevgeny/shared-foundation'
import { LoginByTotpUseCaseMock } from '@/mock/usecase/auth/login/login-by-totp-use-case-mock'
import { LoginByTotpRecoveryCodeUseCaseMock } from '@/mock/usecase/auth/login/login-by-totp-recovery-code-use-case-mock'
import type { LoginByTotpStoreDependencies } from '@/ui/screens/auth/login/totp/login-by-totp-store'

export const loginByTotpDependenciesMock = (
  overrides?: Partial<LoginByTotpStoreDependencies>
): LoginByTotpStoreDependencies => {
  const loginByTotpUseCase = new LoginByTotpUseCaseMock()
  loginByTotpUseCase.resultProvider = async () =>
    appResultSuccess({
      userPrivate: createTestUserPrivate({
        id: toUserIdOrThrow(TEST_USER_ID),
        accountStatus: UserAccountStatus.ACTIVE
      }),
      sessionToken: createTestSessionToken()
    })

  const loginByTotpRecoveryCodeUseCase = new LoginByTotpRecoveryCodeUseCaseMock()
  loginByTotpRecoveryCodeUseCase.resultProvider = async () =>
    appResultSuccess({
      userPrivate: createTestUserPrivate({
        id: toUserIdOrThrow(TEST_USER_ID),
        accountStatus: UserAccountStatus.ACTIVE
      }),
      sessionToken: createTestSessionToken()
    })

  return {
    mfaToken: 'mock_mfa_token',
    loginByTotpUseCase,
    loginByTotpRecoveryCodeUseCase,
    onNavigateToPendingDeletion: () => {},
    onBack: () => {},
    onFinished: () => {},
    ...overrides
  }
}
