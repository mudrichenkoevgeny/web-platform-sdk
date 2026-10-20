import { TEST_USER_ID, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementGetIdentifiersUseCaseMock } from '@/mock/usecase/identifier/management-get-identifiers-use-case-mock'
import type { UserIdentifierListStoreDependencies } from '@/ui/screens/management/identifier/user-list/UserIdentifierListStore'

export const userIdentifierListDependenciesMock = (
  overrides?: Partial<UserIdentifierListStoreDependencies>
): UserIdentifierListStoreDependencies => {
  const managementGetIdentifiersUseCase = new ManagementGetIdentifiersUseCaseMock()

  return {
    userId: toUserIdOrThrow(TEST_USER_ID),
    managementGetIdentifiersUseCase,
    onIdentifierSelect: () => {},
    onBack: () => {},
    ...overrides
  }
}
