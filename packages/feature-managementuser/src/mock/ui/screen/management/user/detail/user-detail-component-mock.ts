import { TEST_USER_ID, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { GetUserUseCaseMock } from '@/mock/usecase/user/get-user-use-case-mock'
import { UpdateUserUseCaseMock } from '@/mock/usecase/user/update-user-use-case-mock'
import { DeleteUserUseCaseMock } from '@/mock/usecase/user/delete-user-use-case-mock'
import { ManagementDisableTotpUseCaseMock } from '@/mock/usecase/user/security/management-disable-totp-use-case-mock'
import type { UserDetailStoreDependencies } from '@/ui/screens/management/user/detail/UserDetailStore'

export const userDetailDependenciesMock = (
  overrides?: Partial<UserDetailStoreDependencies>
): UserDetailStoreDependencies => {
  const getUserUseCase = new GetUserUseCaseMock()
  const updateUserUseCase = new UpdateUserUseCaseMock()
  const deleteUserUseCase = new DeleteUserUseCaseMock()
  const managementDisableTotpUseCase = new ManagementDisableTotpUseCaseMock()

  return {
    userId: toUserIdOrThrow(TEST_USER_ID),
    getUserUseCase,
    updateUserUseCase,
    deleteUserUseCase,
    managementDisableTotpUseCase,
    onNavigateToSessions: () => {},
    onNavigateToIdentifiers: () => {},
    onNavigateToAuditEvents: () => {},
    onBack: () => {},
    ...overrides
  }
}
