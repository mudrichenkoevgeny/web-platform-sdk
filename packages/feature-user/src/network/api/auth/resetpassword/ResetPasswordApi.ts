import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  OtpConfirmationPayload,
  ResetPasswordRequest,
  SendResetPasswordConfirmationRequest,
  UserIdentifierPayload
} from '@mudrichenkoevgeny/shared-foundation'

/** Password reset and related confirmation calls for unauthenticated recovery flows. */
export interface ResetPasswordApi {
  /**
   * Completes password reset using the server-issued reset flow payload.
   *
   * @param request - Reset token and new secret from the shared contract
   * @returns Updated user identifier context, or a mapped failure
   */
  resetPassword(request: ResetPasswordRequest): Promise<AppResult<UserIdentifierPayload, AppError>>

  /**
   * Sends a password-reset confirmation link or code to the user email.
   *
   * @param request - Target account hint from the shared contract
   * @returns Confirmation dispatch result, or a mapped failure
   */
  sendResetPasswordConfirmationToEmail(
    request: SendResetPasswordConfirmationRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>>
}
