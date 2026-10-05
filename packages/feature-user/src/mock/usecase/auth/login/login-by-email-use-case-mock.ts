import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { LoginByEmailUseCase } from '@/usecase/auth/login/login-by-email-use-case'
import type { AuthData } from '@mudrichenkoevgeny/shared-foundation'
import { LoginRepositoryMock } from '@/mock/repository/auth/login/login-repository-mock'
import { AuthStorageMock } from '@/mock/storage/auth/auth-storage-mock'
import { UserStorageMock } from '@/mock/storage/user/user-storage-mock'
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
