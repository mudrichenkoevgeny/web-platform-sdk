import { UnlockByExternalAuthProviderUseCase } from '@/feature/user/usecase/auth/unlock/unlock-by-external-auth-provider-use-case'
import { UnlockRepositoryMock } from '@/feature/user/mock/repository/auth/unlock/unlock-repository-mock'

/**
 * Mock implementation of {@link UnlockByExternalAuthProviderUseCase}.
 */
export class UnlockByExternalAuthProviderUseCaseMock extends UnlockByExternalAuthProviderUseCase {
  public constructor() {
    super(new UnlockRepositoryMock())
  }
}
