import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { ResetPasswordRepository } from '@/repository/auth/resetpassword/ResetPasswordRepository'
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import { userIdentifierMock } from '@mudrichenkoevgeny/shared-foundation'
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
  public resetResult: AppResult<UserIdentifier, AppError> = appResultSuccess(userIdentifierMock())

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
  ): Promise<AppResult<UserIdentifier, AppError>> {
    this.lastResetEmail = email
    this.lastResetPassword = newPassword
    this.lastResetCode = confirmationCode
    return this.resetResult
  }
}
