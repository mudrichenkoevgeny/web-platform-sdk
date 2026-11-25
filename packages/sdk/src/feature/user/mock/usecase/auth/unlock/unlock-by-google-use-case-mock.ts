import { UnlockByGoogleUseCase } from '@/feature/user/usecase/auth/unlock/unlock-by-google-use-case'
import { GoogleAuthServiceMock } from '@/feature/user/mock/auth/google/google-auth-service-mock'
import { UnlockRepositoryMock } from '@/feature/user/mock/repository/auth/unlock/unlock-repository-mock'

/**
 * Mock implementation of {@link UnlockByGoogleUseCase}.
 */
export class UnlockByGoogleUseCaseMock extends UnlockByGoogleUseCase {
  public constructor() {
    super(new GoogleAuthServiceMock(), new UnlockRepositoryMock())
  }
}
