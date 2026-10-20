import { ManagementGetSessionsUseCaseMock } from '@/mock/usecase/session/management-get-sessions-use-case-mock'
import { ManagementDeleteSessionUseCaseMock } from '@/mock/usecase/session/management-delete-session-use-case-mock'
import type { GlobalSessionListStoreDependencies } from '@/ui/screens/management/session/global-list/GlobalSessionListStore'

export const globalSessionListDependenciesMock = (
  overrides?: Partial<GlobalSessionListStoreDependencies>
): GlobalSessionListStoreDependencies => {
  const managementGetSessionsUseCase = new ManagementGetSessionsUseCaseMock()
  const managementDeleteSessionUseCase = new ManagementDeleteSessionUseCaseMock()

  return {
    managementGetSessionsUseCase,
    managementDeleteSessionUseCase,
    onNavigateToSessionDetail: () => {},
    onNavigateToUserDetail: () => {},
    onBack: () => {},
    ...overrides
  }
}
