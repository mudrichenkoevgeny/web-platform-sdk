import { UnlockByGoogleUseCase } from '@/usecase/auth/unlock/UnlockByGoogleUseCase'
import { GoogleAuthServiceMock } from '@/auth/google/GoogleAuthServiceMock'
import { UnlockRepositoryMock } from '@/repository/auth/unlock/UnlockRepositoryMock'

/**
 * Mock implementation of {@link UnlockByGoogleUseCase}.
 */
export class UnlockByGoogleUseCaseMock extends UnlockByGoogleUseCase {
  public constructor() {
    super(new GoogleAuthServiceMock(), new UnlockRepositoryMock())
  }
}
