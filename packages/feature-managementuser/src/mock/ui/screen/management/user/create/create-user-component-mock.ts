import type { CreateUserStoreDependencies } from '@/ui/screens/management/user/create/CreateUserStore'

export const createUserDependenciesMock = (
  overrides?: Partial<CreateUserStoreDependencies>
): CreateUserStoreDependencies => ({
  createUserUseCase: {
    execute: async () => ({ isSuccess: true, data: {} } as any)
  } as any,
  onSuccess: () => {},
  onBack: () => {},
  ...overrides
})
