import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk/core/common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk/core/common";
import { RegistrationByEmailUseCase } from '@/feature/user/usecase/auth/registration/registration-by-email-use-case'
import type { AuthData } from '@mudrichenkoevgeny/shared-foundation'
import { RegistrationRepositoryMock } from '@/feature/user/mock/repository/auth/registration/registration-repository-mock'
import { AuthStorageMock } from '@/feature/user/mock/storage/auth/auth-storage-mock'
import { UserStorageMock } from '@/feature/user/mock/storage/user/user-storage-mock'
/**
 * Mock implementation of {@link RegistrationByEmailUseCase}.
 */
export class RegistrationByEmailUseCaseMock extends RegistrationByEmailUseCase {
  public resultProvider: (email: string, password: string, confirmationCode: string) => Promise<AppResult<AuthData, AppError>> =
    async () => appResultFailure(CommonError.unknown())

  public constructor() {
    super(new RegistrationRepositoryMock(), new AuthStorageMock(), new UserStorageMock())
  }

  public override async execute(
    email: string,
    password: string,
    confirmationCode: string
  ): Promise<AppResult<AuthData, AppError>> {
    return this.resultProvider(email, password, confirmationCode)
  }
}
