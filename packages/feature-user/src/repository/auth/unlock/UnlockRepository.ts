import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'

/** Operations for self-service account unlocking. */
export interface UnlockRepository {
  /** Sends an account unlock confirmation code to email. */
  sendUnlockEmailConfirmation(email: string): Promise<AppResult<OtpConfirmation, AppError>>

  /** Gets remaining client-side cooldown in seconds before another email unlock OTP can be sent. */
  getRemainingUnlockEmailConfirmationDelayInSeconds(email: string): number

  /** Unlocks account using email confirmation code. */
  unlockByEmail(email: string, confirmationCode: string): Promise<AppResult<void, AppError>>

  /** Sends an account unlock confirmation code to phoneNumber. */
  sendUnlockPhoneConfirmation(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>>

  /** Gets remaining client-side cooldown in seconds before another phone unlock OTP can be sent. */
  getRemainingUnlockPhoneConfirmationDelayInSeconds(phoneNumber: string): number

  /** Unlocks account using phone confirmation code. */
  unlockByPhone(phoneNumber: string, confirmationCode: string): Promise<AppResult<void, AppError>>

  /** Unlocks account using external provider token. */
  unlockByExternalAuthProvider(authProvider: string, externalProviderToken: string): Promise<AppResult<void, AppError>>
}
