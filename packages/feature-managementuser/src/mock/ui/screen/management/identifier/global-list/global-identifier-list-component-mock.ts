import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userIdentifierMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { GlobalIdentifierListStoreDependencies } from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListStore'

export const globalIdentifierListDependenciesMock = (
  overrides?: Partial<GlobalIdentifierListStoreDependencies>
): GlobalIdentifierListStoreDependencies => ({
  managementGetIdentifiersUseCase: {
    execute: async () =>
      appResultSuccess({
        items: [userIdentifierMock()],
        pageNumber: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1
      })
  } as unknown as GlobalIdentifierListStoreDependencies['managementGetIdentifiersUseCase'],
  managementDeleteIdentifierUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as unknown as GlobalIdentifierListStoreDependencies['managementDeleteIdentifierUseCase'],
  onNavigateToIdentifierDetail: () => {},
  onBack: () => {},
  ...overrides
})
