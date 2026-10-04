import { UnlockByEmailUseCase } from '@/usecase/auth/unlock/UnlockByEmailUseCase'
import { UnlockRepositoryMock } from '@/repository/auth/unlock/UnlockRepositoryMock'

/**
 * Mock implementation of {@link UnlockByEmailUseCase}.
 */
export class UnlockByEmailUseCaseMock extends UnlockByEmailUseCase {
  public constructor() {
    super(new UnlockRepositoryMock())
  }
}
