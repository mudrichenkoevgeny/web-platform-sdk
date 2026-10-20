import { TEST_USER_ID, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementGetSessionsUseCaseMock } from '@/mock/usecase/session/management-get-sessions-use-case-mock'
import { ManagementDeleteSessionUseCaseMock } from '@/mock/usecase/session/management-delete-session-use-case-mock'
import { ManagementDeleteAllUserSessionsUseCaseMock } from '@/mock/usecase/session/management-delete-all-user-sessions-use-case-mock'
import type { UserSessionListStoreDependencies } from '@/ui/screens/management/session/user-list/UserSessionListStore'

export const userSessionListDependenciesMock = (
  overrides?: Partial<UserSessionListStoreDependencies>
): UserSessionListStoreDependencies => {
  const managementGetSessionsUseCase = new ManagementGetSessionsUseCaseMock()
  const managementDeleteSessionUseCase = new ManagementDeleteSessionUseCaseMock()
  const managementDeleteAllUserSessionsUseCase = new ManagementDeleteAllUserSessionsUseCaseMock()

  return {
    userId: toUserIdOrThrow(TEST_USER_ID),
    managementGetSessionsUseCase,
    managementDeleteSessionUseCase,
    managementDeleteAllUserSessionsUseCase,
    onNavigateToSessionDetail: () => {},
    onBack: () => {},
    ...overrides
  }
}
