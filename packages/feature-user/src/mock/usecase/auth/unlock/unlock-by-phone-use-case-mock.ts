import { UnlockByPhoneUseCase } from '@/usecase/auth/unlock/unlock-by-phone-use-case'
import { UnlockRepositoryMock } from '@/mock/repository/auth/unlock/unlock-repository-mock'

/**
 * Mock implementation of {@link UnlockByPhoneUseCase}.
 */
export class UnlockByPhoneUseCaseMock extends UnlockByPhoneUseCase {
  public constructor() {
    super(new UnlockRepositoryMock())
  }
}
