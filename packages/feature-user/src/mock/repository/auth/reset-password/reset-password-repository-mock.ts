import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { ResetPasswordRepository } from '@/repository/auth/reset-password/reset-password-repository'
import type { UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import { userIdentifierPrivateMock } from '@/mock/domain/model/identifier/user-identifier-mock'

/**
 * Mock implementation of {@link ResetPasswordRepository}.
 */
export class ResetPasswordRepositoryMock implements ResetPasswordRepository {
  public remainingDelaySeconds = 10
  public sendResult: AppResult<OtpConfirmation, AppError> = appResultSuccess({
    retryAfterSeconds: 10,
    numberOfSymbols: 6,
    expirationSeconds: 300
  })
  public resetResult: AppResult<UserIdentifierPrivate, AppError> = appResultSuccess(userIdentifierPrivateMock())

  public lastSendEmail: string | null = null
  public lastResetEmail: string | null = null
  public lastResetPassword: string | null = null
  public lastResetCode: string | null = null

  public getRemainingResetPasswordConfirmationDelayInSeconds(): number {
    return this.remainingDelaySeconds
  }

  public async sendResetPasswordConfirmationToEmail(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    this.lastSendEmail = email
    return this.sendResult
  }

  public async resetPassword(
    email: string,
    newPassword: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    this.lastResetEmail = email
    this.lastResetPassword = newPassword
    this.lastResetCode = confirmationCode
    return this.resetResult
  }
}
