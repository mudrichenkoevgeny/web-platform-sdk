import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userSessionMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { UserSessionListStoreDependencies } from '@/ui/screens/management/session/userlist/UserSessionListStore'

export const userSessionListDependenciesMock = (
  overrides?: Partial<UserSessionListStoreDependencies>
): UserSessionListStoreDependencies => ({
  userId: 'usr_123' as any,
  managementGetSessionsUseCase: {
    execute: async () =>
      appResultSuccess({
        items: [userSessionMock()],
        pageNumber: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1
      })
  } as any,
  managementDeleteSessionUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  managementDeleteAllUserSessionsUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  onNavigateToSessionDetail: () => {},
  onBack: () => {},
  ...overrides
})
