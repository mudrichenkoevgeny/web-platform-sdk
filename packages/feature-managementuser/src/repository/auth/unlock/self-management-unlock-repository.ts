import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'

/** Self-management unlock repository interface for staff members. */
export interface SelfManagementUnlockRepository {
  /**
   * Sends an account unlock confirmation code (OTP) to the specified email address.
   *
   * @param email - Target email address
   * @returns AppResult containing {@link OtpConfirmation} on success
   */
  sendUnlockEmailConfirmation(email: string): Promise<AppResult<OtpConfirmation, AppError>>

  /**
   * Returns remaining cooldown delay in seconds before sending another unlock email confirmation.
   *
   * @param email - Target email address
   * @returns Cooldown delay in seconds
   */
  getRemainingUnlockEmailConfirmationDelayInSeconds(email: string): number

  /**
   * Unlocks a temporarily locked management account using an email confirmation code.
   *
   * @param email - User email
   * @param confirmationCode - OTP confirmation code
   * @returns Void result on success
   */
  unlockByEmail(email: string, confirmationCode: string): Promise<AppResult<void, AppError>>
}
