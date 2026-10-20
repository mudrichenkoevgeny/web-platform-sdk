import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserPrivate, createTestTotpSetup, createTestTotpRecoveryCodes, TEST_USER_ID, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { UserRepositoryMock } from '@/mock/repository/user/user-repository-mock'
import { SetupTotpUseCaseMock } from '@/mock/usecase/user/security/setup-totp-use-case-mock'
import { EnableTotpUseCaseMock } from '@/mock/usecase/user/security/enable-totp-use-case-mock'
import { DisableTotpUseCaseMock } from '@/mock/usecase/user/security/disable-totp-use-case-mock'
import type { TotpMainStoreDependencies } from '@/ui/screens/user/totp/main/totp-main-store'

export const totpMainDependenciesMock = (
  overrides?: Partial<TotpMainStoreDependencies>
): TotpMainStoreDependencies => {
  const userRepository = new UserRepositoryMock()
  userRepository.emit(createTestUserPrivate({
    id: toUserIdOrThrow(TEST_USER_ID),
    isTotpEnabled: false
  }))

  const setupTotpUseCase = new SetupTotpUseCaseMock()
  setupTotpUseCase.resultProvider = async () => appResultSuccess(createTestTotpSetup({
    secretKey: 'JBSWY3DPEHPK3PXP',
    otpAuthUrl: 'otpauth://totp/Test?secret=JBSWY3DPEHPK3PXP',
    mfaToken: 'mfa_123'
  }))

  const enableTotpUseCase = new EnableTotpUseCaseMock()
  enableTotpUseCase.resultProvider = async () => appResultSuccess(createTestTotpRecoveryCodes({
    codes: ['1111-2222', '3333-4444']
  }))

  const disableTotpUseCase = new DisableTotpUseCaseMock()
  disableTotpUseCase.resultProvider = async () => appResultSuccess(undefined)

  return {
    userRepository,
    setupTotpUseCase,
    enableTotpUseCase,
    disableTotpUseCase,
    onNavigateToRecoveryCodes: () => {},
    onBack: () => {},
    ...overrides
  }
}
