import { CreateUserUseCaseMock } from '@/feature/management-user/mock/usecase/user/create-user-use-case-mock'
import type { CreateUserStoreDependencies } from '@/feature/management-user/ui/screens/management/user/create/create-user-store'

export const createUserDependenciesMock = (
  overrides?: Partial<CreateUserStoreDependencies>
): CreateUserStoreDependencies => {
  const createUserUseCase = new CreateUserUseCaseMock()

  return {
    createUserUseCase,
    onSuccess: () => {},
    onBack: () => {},
    ...overrides
  }
}
