import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userSessionMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { GlobalSessionListStoreDependencies } from '@/ui/screens/management/session/global-list/GlobalSessionListStore'

export const globalSessionListDependenciesMock = (
  overrides?: Partial<GlobalSessionListStoreDependencies>
): GlobalSessionListStoreDependencies => ({
  managementGetSessionsUseCase: {
    execute: async () =>
      appResultSuccess({
        items: [userSessionMock()],
        pageNumber: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1
      })
  } as unknown as GlobalSessionListStoreDependencies['managementGetSessionsUseCase'],
  managementDeleteSessionUseCase: {
    execute: async () => appResultSuccess({})
  } as unknown as GlobalSessionListStoreDependencies['managementDeleteSessionUseCase'],
  onNavigateToSessionDetail: () => {},
  onNavigateToUserDetail: () => {},
  onBack: () => {},
  ...overrides
})
