import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuthDataPayload,
  OtpConfirmationPayload,
  RegisterByEmailRequest,
  SendConfirmationToEmailRequest
} from '@mudrichenkoevgeny/shared-foundation'

/** Email registration and confirmation flows for the user feature. */
export interface RegistrationApi {
  /**
   * Creates a new account using email registration data.
   *
   * @param request - Registration payload from the shared contract
   * @returns Session tokens and related auth payload, or a mapped failure
   */
  registerByEmail(request: RegisterByEmailRequest): Promise<AppResult<AuthDataPayload, AppError>>

  /**
   * Sends a registration confirmation message to the user email.
   *
   * @param request - Target email and template parameters
   * @returns Confirmation dispatch result, or a mapped failure
   */
  sendRegistrationConfirmationToEmail(
    request: SendConfirmationToEmailRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>>
}
