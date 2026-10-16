import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OtpConfirmationPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Self-service account unlock flows for management users. */
export interface SelfManagementUnlockApi {
  /**
   * Sends an account unlock confirmation code (OTP) to the specified management email address.
   *
   * @param email - Target email address
   * @returns Confirmation dispatch result, or a mapped failure
   */
  sendUnlockEmailConfirmation(email: string): Promise<AppResult<OtpConfirmationPayload, AppError>>

  /**
   * Unlocks a temporarily locked management account using an email confirmation code.
   *
   * @param email - User email
   * @param confirmationCode - OTP confirmation code
   * @returns Void result on success, or a mapped failure
   */
  unlockByEmail(email: string, confirmationCode: string): Promise<AppResult<void, AppError>>

  /**
   * Sends an account unlock confirmation code (OTP) to the specified management phone number.
   *
   * @param phoneNumber - Target phone number
   * @returns Confirmation dispatch result, or a mapped failure
   */
  sendUnlockPhoneConfirmation(phoneNumber: string): Promise<AppResult<OtpConfirmationPayload, AppError>>

  /**
   * Unlocks a temporarily locked management account using a phone confirmation code.
   *
   * @param phoneNumber - Target phone number
   * @param confirmationCode - OTP confirmation code
   * @returns Void result on success, or a mapped failure
   */
  unlockByPhone(phoneNumber: string, confirmationCode: string): Promise<AppResult<void, AppError>>

  /**
   * Unlocks a temporarily locked management account via an external authentication provider token.
   *
   * @param authProvider - Provider type
   * @param externalProviderToken - OAuth token
   * @returns Void result on success, or a mapped failure
   */
  unlockByExternalAuthProvider(authProvider: string, externalProviderToken: string): Promise<AppResult<void, AppError>>
}
