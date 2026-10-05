import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userDetailsMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { UserDetailStoreDependencies } from '@/ui/screens/management/user/detail/UserDetailStore'

export const userDetailDependenciesMock = (
  overrides?: Partial<UserDetailStoreDependencies>
): UserDetailStoreDependencies => ({
  userId: 'usr_123' as unknown as UserId,
  getUserUseCase: {
    execute: async () => appResultSuccess(userDetailsMock())
  } as unknown as UserDetailStoreDependencies['getUserUseCase'],
  updateUserUseCase: {
    execute: async () => appResultSuccess(userDetailsMock())
  } as unknown as UserDetailStoreDependencies['updateUserUseCase'],
  deleteUserUseCase: {
    execute: async () => appResultSuccess({})
  } as unknown as UserDetailStoreDependencies['deleteUserUseCase'],
  managementDisableTotpUseCase: {
    execute: async () => appResultSuccess({})
  } as unknown as UserDetailStoreDependencies['managementDisableTotpUseCase'],
  onNavigateToSessions: () => {},
  onNavigateToIdentifiers: () => {},
  onBack: () => {},
  ...overrides
})
