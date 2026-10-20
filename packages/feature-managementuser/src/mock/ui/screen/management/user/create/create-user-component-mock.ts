import { CreateUserUseCaseMock } from '@/mock/usecase/user/create-user-use-case-mock'
import type { CreateUserStoreDependencies } from '@/ui/screens/management/user/create/CreateUserStore'

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
