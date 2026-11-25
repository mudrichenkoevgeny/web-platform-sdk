import { GetUsersUseCaseMock } from '@/feature/management-user/mock/usecase/user/get-users-use-case-mock'
import type { GlobalUserListStoreDependencies } from '@/feature/management-user/ui/screens/management/user/global-list/global-user-list-store'

export const globalUserListDependenciesMock = (
  overrides?: Partial<GlobalUserListStoreDependencies>
): GlobalUserListStoreDependencies => {
  const getUsersUseCase = new GetUsersUseCaseMock()

  return {
    getUsersUseCase,
    onNavigateToUserDetail: () => {},
    onNavigateToCreateUser: () => {},
    onBack: () => {},
    ...overrides
  }
}
