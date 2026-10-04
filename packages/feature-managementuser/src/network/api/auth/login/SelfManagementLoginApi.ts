import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuthDataPayload,
  LoginByEmailRequest,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'

/** Remote login and second-factor verification entry points for the user feature. */
export interface SelfManagementLoginApi {
  /**
   * Signs in with email credentials.
   *
   * @param request - Email and secret payload from the shared contract
   * @returns Session tokens and related auth payload, or a mapped failure
   */
  loginByEmail(request: LoginByEmailRequest): Promise<AppResult<AuthDataPayload, AppError>>

  /**
   * Completes multifactor authentication using TOTP.
   *
   * @param request - Verification payload containing the current TOTP token
   * @returns Session tokens and updated auth payload upon successful verification, or a mapped failure
   */
  loginByTotp(request: VerifyTotpPayload): Promise<AppResult<AuthDataPayload, AppError>>

  /**
   * Completes multifactor authentication and account access recovery using a static backup code.
   *
   * @param request - Verification payload containing the unused recovery code
   * @returns Session tokens and updated auth payload upon successful verification, or a mapped failure
   */
  loginByTotpRecoveryCode(request: VerifyTotpPayload): Promise<AppResult<AuthDataPayload, AppError>>
}
