import { GetUsersUseCaseMock } from '@/mock/usecase/user/get-users-use-case-mock'
import type { GlobalUserListStoreDependencies } from '@/ui/screens/management/user/global-list/GlobalUserListStore'

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
