import { SendUnlockEmailConfirmationUseCase } from '@/usecase/auth/unlock/SendUnlockEmailConfirmationUseCase'
import { UnlockRepositoryMock } from '@/mock/repository/auth/unlock/UnlockRepositoryMock'

/**
 * Mock implementation of {@link SendUnlockEmailConfirmationUseCase}.
 */
export class SendUnlockEmailConfirmationUseCaseMock extends SendUnlockEmailConfirmationUseCase {
  public constructor() {
    super(new UnlockRepositoryMock())
  }
}
