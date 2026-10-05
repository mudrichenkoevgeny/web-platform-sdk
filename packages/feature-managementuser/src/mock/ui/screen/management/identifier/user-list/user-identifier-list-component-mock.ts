import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userIdentifierMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { UserIdentifierListStoreDependencies } from '@/ui/screens/management/identifier/userlist/UserIdentifierListStore'

export const userIdentifierListDependenciesMock = (
  overrides?: Partial<UserIdentifierListStoreDependencies>
): UserIdentifierListStoreDependencies => ({
  userId: 'usr_123' as any,
  managementGetIdentifiersUseCase: {
    execute: async () =>
      appResultSuccess({
        items: [userIdentifierMock()],
        pageNumber: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1
      })
  } as any,
  onIdentifierSelect: () => {},
  onBack: () => {},
  ...overrides
})
