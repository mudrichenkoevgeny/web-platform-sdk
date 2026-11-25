import { SendUnlockPhoneConfirmationUseCase } from '@/feature/user/usecase/auth/unlock/send-unlock-phone-confirmation-use-case'
import { UnlockRepositoryMock } from '@/feature/user/mock/repository/auth/unlock/unlock-repository-mock'

/**
 * Mock implementation of {@link SendUnlockPhoneConfirmationUseCase}.
 */
export class SendUnlockPhoneConfirmationUseCaseMock extends SendUnlockPhoneConfirmationUseCase {
  public constructor() {
    super(new UnlockRepositoryMock())
  }
}
