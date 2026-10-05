import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userDetailsMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { UserDetailStoreDependencies } from '@/ui/screens/management/user/detail/UserDetailStore'

export const userDetailDependenciesMock = (
  overrides?: Partial<UserDetailStoreDependencies>
): UserDetailStoreDependencies => ({
  userId: 'usr_123' as any,
  getUserUseCase: {
    execute: async () => appResultSuccess(userDetailsMock())
  } as any,
  updateUserUseCase: {
    execute: async () => appResultSuccess(userDetailsMock())
  } as any,
  deleteUserUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  managementDisableTotpUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  onNavigateToSessions: () => {},
  onNavigateToIdentifiers: () => {},
  onBack: () => {},
  ...overrides
})
