import { ManagementGetIdentifiersUseCaseMock } from '@/mock/usecase/identifier/management-get-identifiers-use-case-mock'
import { ManagementDeleteIdentifierUseCaseMock } from '@/mock/usecase/identifier/management-delete-identifier-use-case-mock'
import type { GlobalIdentifierListStoreDependencies } from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListStore'

export const globalIdentifierListDependenciesMock = (
  overrides?: Partial<GlobalIdentifierListStoreDependencies>
): GlobalIdentifierListStoreDependencies => {
  const managementGetIdentifiersUseCase = new ManagementGetIdentifiersUseCaseMock()
  const managementDeleteIdentifierUseCase = new ManagementDeleteIdentifierUseCaseMock()

  return {
    managementGetIdentifiersUseCase,
    managementDeleteIdentifierUseCase,
    onNavigateToIdentifierDetail: () => {},
    onBack: () => {},
    ...overrides
  }
}
