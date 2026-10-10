import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { LoginByPhoneStoreDependencies } from '@/ui/screens/auth/login/phone/LoginByPhoneStore'

export const loginByPhoneDependenciesMock = (
  overrides?: Partial<LoginByPhoneStoreDependencies>
): LoginByPhoneStoreDependencies => ({
  loginRepository: {
    getRemainingLoginConfirmationDelayInSeconds: () => 0
  } as any,
  sendLoginConfirmationToPhoneUseCase: {
    execute: async () => appResultSuccess({ retryAfterSeconds: 60 })
  } as any,
  loginByPhoneUseCase: {
    execute: async () => appResultSuccess({
      userPrivate: {
        id: 'usr_123',
        accountStatus: 'ACTIVE'
      }
    })
  } as any,
  onNavigateToTotp: () => {},
  onNavigateToPendingDeletion: () => {},
  onNavigateToAccountUnlock: () => {},
  onBack: () => {},
  onFinished: () => {},
  ...overrides
})
