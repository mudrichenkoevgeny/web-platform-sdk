import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { LoginByPhoneUseCase } from '@/usecase/auth/login/login-by-phone-use-case'
import type { AuthData } from '@mudrichenkoevgeny/shared-foundation'
import { LoginRepositoryMock } from '@/mock/repository/auth/login/login-repository-mock'
import { AuthStorageMock } from '@/mock/storage/auth/auth-storage-mock'
import { UserStorageMock } from '@/mock/storage/user/user-storage-mock'
/**
 * Mock implementation of {@link LoginByPhoneUseCase}.
 */
export class LoginByPhoneUseCaseMock extends LoginByPhoneUseCase {
  public resultProvider: (phoneNumber: string, confirmationCode: string) => Promise<AppResult<AuthData, AppError>> =
    async () => appResultFailure(CommonError.unknown())

  public constructor() {
    super(new LoginRepositoryMock(), new AuthStorageMock(), new UserStorageMock())
  }

  public override async execute(phoneNumber: string, confirmationCode: string): Promise<AppResult<AuthData, AppError>> {
    return this.resultProvider(phoneNumber, confirmationCode)
  }
}
