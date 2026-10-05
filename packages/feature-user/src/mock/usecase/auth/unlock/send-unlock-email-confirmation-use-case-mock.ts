import { SendUnlockEmailConfirmationUseCase } from '@/usecase/auth/unlock/send-unlock-email-confirmation-use-case'
import { UnlockRepositoryMock } from '@/mock/repository/auth/unlock/unlock-repository-mock'

/**
 * Mock implementation of {@link SendUnlockEmailConfirmationUseCase}.
 */
export class SendUnlockEmailConfirmationUseCaseMock extends SendUnlockEmailConfirmationUseCase {
  public constructor() {
    super(new UnlockRepositoryMock())
  }
}
