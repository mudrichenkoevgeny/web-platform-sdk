import { AppError, AppResult, appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginByEmailUseCase } from '@/usecase/auth/login/LoginByEmailUseCase'
import { AuthData } from '@mudrichenkoevgeny/shared-foundation'
import { LoginRepositoryMock } from '@/repository/auth/login/LoginRepositoryMock'
import { AuthStorageMock } from '@/storage/auth/AuthStorageMock'
import { UserStorageMock } from '@/storage/user/UserStorageMock'

/**
 * Mock implementation of {@link LoginByEmailUseCase}.
 */
export class LoginByEmailUseCaseMock extends LoginByEmailUseCase {
  public resultProvider: (email: string, password: string) => Promise<AppResult<AuthData, AppError>> =
    async () => appResultFailure(CommonError.unknown())

  public constructor() {
    super(new LoginRepositoryMock(), new AuthStorageMock(), new UserStorageMock())
  }

  public override async execute(email: string, password: string): Promise<AppResult<AuthData, AppError>> {
    return this.resultProvider(email, password)
  }
}
