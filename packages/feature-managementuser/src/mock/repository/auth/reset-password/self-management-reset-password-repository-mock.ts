import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OtpConfirmation, UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { userIdentifierPrivateMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { ResetPasswordRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/** Mock implementation of {@link ResetPasswordRepository} for self management. */
export class SelfManagementResetPasswordRepositoryMock implements ResetPasswordRepository {
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

  public getRemainingResetPasswordConfirmationDelayInSeconds(_email: string): number {
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
