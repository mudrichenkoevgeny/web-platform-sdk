import { UnlockByPhoneUseCase } from '@/usecase/auth/unlock/UnlockByPhoneUseCase'
import { UnlockRepositoryMock } from '@/repository/auth/unlock/UnlockRepositoryMock'

/**
 * Mock implementation of {@link UnlockByPhoneUseCase}.
 */
export class UnlockByPhoneUseCaseMock extends UnlockByPhoneUseCase {
  public constructor() {
    super(new UnlockRepositoryMock())
  }
}
