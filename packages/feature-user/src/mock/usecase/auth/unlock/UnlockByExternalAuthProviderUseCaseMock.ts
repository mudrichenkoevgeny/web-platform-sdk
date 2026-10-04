import { UnlockByExternalAuthProviderUseCase } from '@/usecase/auth/unlock/UnlockByExternalAuthProviderUseCase'
import { UnlockRepositoryMock } from '@/mock/repository/auth/unlock/UnlockRepositoryMock'

/**
 * Mock implementation of {@link UnlockByExternalAuthProviderUseCase}.
 */
export class UnlockByExternalAuthProviderUseCaseMock extends UnlockByExternalAuthProviderUseCase {
  public constructor() {
    super(new UnlockRepositoryMock())
  }
}
