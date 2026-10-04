import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AuthData } from '@mudrichenkoevgeny/shared-foundation'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'

/** Email-based registration repository contract. */
export interface RegistrationRepository {
  /** Registers a new account with email, password, and confirmationCode. */
  registerByEmail(email: string, password: string, confirmationCode: string): Promise<AppResult<AuthData, AppError>>

  /** Sends a registration confirmation code to email. */
  sendRegistrationConfirmationToEmail(email: string): Promise<AppResult<OtpConfirmation, AppError>>

  /** Returns remaining client-side cooldown in seconds before another send is allowed. */
  getRemainingRegistrationConfirmationDelayInSeconds(email: string): number
}
