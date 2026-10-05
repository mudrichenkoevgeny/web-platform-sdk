import { UnlockByEmailUseCase } from '@/usecase/auth/unlock/unlock-by-email-use-case'
import { UnlockRepositoryMock } from '@/mock/repository/auth/unlock/unlock-repository-mock'

/**
 * Mock implementation of {@link UnlockByEmailUseCase}.
 */
export class UnlockByEmailUseCaseMock extends UnlockByEmailUseCase {
  public constructor() {
    super(new UnlockRepositoryMock())
  }
}
