import { UnlockByGoogleUseCase } from '@/usecase/auth/unlock/unlock-by-google-use-case'
import { GoogleAuthServiceMock } from '@/mock/auth/google/google-auth-service-mock'
import { UnlockRepositoryMock } from '@/mock/repository/auth/unlock/unlock-repository-mock'

/**
 * Mock implementation of {@link UnlockByGoogleUseCase}.
 */
export class UnlockByGoogleUseCaseMock extends UnlockByGoogleUseCase {
  public constructor() {
    super(new GoogleAuthServiceMock(), new UnlockRepositoryMock())
  }
}
