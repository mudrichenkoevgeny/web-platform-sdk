import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userDetailsMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { GlobalUserListStoreDependencies } from '@/ui/screens/management/user/global-list/GlobalUserListStore'

export const globalUserListDependenciesMock = (
  overrides?: Partial<GlobalUserListStoreDependencies>
): GlobalUserListStoreDependencies => ({
  getUsersUseCase: {
    execute: async () =>
      appResultSuccess({
        items: [userDetailsMock()],
        pageNumber: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1
      })
  } as any,
  onNavigateToUserDetail: () => {},
  onNavigateToCreateUser: () => {},
  onBack: () => {},
  ...overrides
})
