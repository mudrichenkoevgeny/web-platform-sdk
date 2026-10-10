import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { ResetEmailPasswordUseCase } from '@/usecase/auth/reset-password/reset-email-password-use-case'
import type { UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { ResetPasswordRepositoryMock } from '@/mock/repository/auth/reset-password/reset-password-repository-mock'
/**
 * Mock implementation of {@link ResetEmailPasswordUseCase}.
 */
export class ResetEmailPasswordUseCaseMock extends ResetEmailPasswordUseCase {
  public resultProvider: (email: string, newPassword: string, confirmationCode: string) => Promise<AppResult<UserIdentifierPrivate, AppError>> =
    async () => appResultFailure(CommonError.unknown())

  public constructor() {
    super(new ResetPasswordRepositoryMock())
  }

  public override async execute(
    email: string,
    newPassword: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    return this.resultProvider(email, newPassword, confirmationCode)
  }
}
