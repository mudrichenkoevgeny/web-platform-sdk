import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { ResetEmailPasswordUseCase } from '@/usecase/auth/resetpassword/ResetEmailPasswordUseCase'
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import { ResetPasswordRepositoryMock } from '@/mock/repository/auth/resetpassword/ResetPasswordRepositoryMock'
/**
 * Mock implementation of {@link ResetEmailPasswordUseCase}.
 */
export class ResetEmailPasswordUseCaseMock extends ResetEmailPasswordUseCase {
  public resultProvider: (email: string, newPassword: string, confirmationCode: string) => Promise<AppResult<UserIdentifier, AppError>> =
    async () => appResultFailure(CommonError.unknown())

  public constructor() {
    super(new ResetPasswordRepositoryMock())
  }

  public override async execute(
    email: string,
    newPassword: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifier, AppError>> {
    return this.resultProvider(email, newPassword, confirmationCode)
  }
}
