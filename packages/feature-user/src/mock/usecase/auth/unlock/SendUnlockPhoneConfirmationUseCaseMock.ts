import { SendUnlockPhoneConfirmationUseCase } from '@/usecase/auth/unlock/SendUnlockPhoneConfirmationUseCase'
import { UnlockRepositoryMock } from '@/mock/repository/auth/unlock/UnlockRepositoryMock'

/**
 * Mock implementation of {@link SendUnlockPhoneConfirmationUseCase}.
 */
export class SendUnlockPhoneConfirmationUseCaseMock extends SendUnlockPhoneConfirmationUseCase {
  public constructor() {
    super(new UnlockRepositoryMock())
  }
}
