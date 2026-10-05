import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  OtpConfirmationPayload,
  SendConfirmationToEmailRequest,
  SendConfirmationToPhoneRequest,
  UnlockByEmailConfirmationRequest,
  UnlockByExternalAuthProviderRequest,
  UnlockByPhoneConfirmationRequest
} from '@mudrichenkoevgeny/shared-foundation'

/** Self-service account unlock flows for management users. */
export interface SelfManagementUnlockApi {
  /**
   * Sends an account unlock confirmation code (OTP) to the specified management email address.
   *
   * @param request - Target email address request payload
   * @returns Confirmation dispatch result, or a mapped failure
   */
  sendUnlockEmailConfirmation(
    request: SendConfirmationToEmailRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>>

  /**
   * Unlocks a temporarily locked management account using an email confirmation code.
   *
   * @param request - Unlock payload containing email and confirmation code
   * @returns Void result on success, or a mapped failure
   */
  unlockByEmail(request: UnlockByEmailConfirmationRequest): Promise<AppResult<void, AppError>>

  /**
   * Sends an account unlock confirmation code (OTP) to the specified management phone number.
   *
   * @param request - Target phone number request payload
   * @returns Confirmation dispatch result, or a mapped failure
   */
  sendUnlockPhoneConfirmation(
    request: SendConfirmationToPhoneRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>>

  /**
   * Unlocks a temporarily locked management account using a phone confirmation code.
   *
   * @param request - Unlock payload containing phone number and confirmation code
   * @returns Void result on success, or a mapped failure
   */
  unlockByPhone(request: UnlockByPhoneConfirmationRequest): Promise<AppResult<void, AppError>>

  /**
   * Unlocks a temporarily locked management account via an external authentication provider token.
   *
   * @param request - Unlock payload containing external auth provider and token
   * @returns Void result on success, or a mapped failure
   */
  unlockByExternalAuthProvider(
    request: UnlockByExternalAuthProviderRequest
  ): Promise<AppResult<void, AppError>>
}
