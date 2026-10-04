import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'

/** Password recovery repository contract. */
export interface ResetPasswordRepository {
  /** Completes password reset for account identified by email using newPassword and confirmationCode. */
  resetPassword(email: string, newPassword: string, confirmationCode: string): Promise<AppResult<UserIdentifier, AppError>>

  /** Requests a password-reset confirmation code to be sent to email. */
  sendResetPasswordConfirmationToEmail(email: string): Promise<AppResult<OtpConfirmation, AppError>>

  /** Returns remaining client-side cooldown in seconds before another send is allowed. */
  getRemainingResetPasswordConfirmationDelayInSeconds(email: string): number
}
