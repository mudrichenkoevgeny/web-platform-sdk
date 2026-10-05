import { SendUnlockPhoneConfirmationUseCase } from '@/usecase/auth/unlock/send-unlock-phone-confirmation-use-case'
import { UnlockRepositoryMock } from '@/mock/repository/auth/unlock/unlock-repository-mock'

/**
 * Mock implementation of {@link SendUnlockPhoneConfirmationUseCase}.
 */
export class SendUnlockPhoneConfirmationUseCaseMock extends SendUnlockPhoneConfirmationUseCase {
  public constructor() {
    super(new UnlockRepositoryMock())
  }
}
