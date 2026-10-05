import { UnlockByExternalAuthProviderUseCase } from '@/usecase/auth/unlock/unlock-by-external-auth-provider-use-case'
import { UnlockRepositoryMock } from '@/mock/repository/auth/unlock/unlock-repository-mock'

/**
 * Mock implementation of {@link UnlockByExternalAuthProviderUseCase}.
 */
export class UnlockByExternalAuthProviderUseCaseMock extends UnlockByExternalAuthProviderUseCase {
  public constructor() {
    super(new UnlockRepositoryMock())
  }
}
