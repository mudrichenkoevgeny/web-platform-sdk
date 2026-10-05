import type { CreateUserStoreDependencies } from '@/ui/screens/management/user/create/CreateUserStore'

export const createUserDependenciesMock = (
  overrides?: Partial<CreateUserStoreDependencies>
): CreateUserStoreDependencies => ({
  createUserUseCase: {
    execute: async () => ({ isSuccess: true, data: undefined })
  } as unknown as CreateUserStoreDependencies['createUserUseCase'],
  onSuccess: () => {},
  onBack: () => {},
  ...overrides
})
