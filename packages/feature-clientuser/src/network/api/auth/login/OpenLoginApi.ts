import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuthDataPayload,
  LoginByEmailRequest,
  LoginByExternalAuthProviderRequest,
  LoginByPhoneRequest,
  OtpConfirmationPayload,
  SendConfirmationToPhoneRequest,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'

/** Remote login and phone confirmation entry points for the user feature. */
export interface OpenLoginApi {
  /**
   * Signs in with email credentials.
   *
   * @param request - Email and secret payload from the shared contract
   * @returns Session tokens and related auth payload, or a mapped failure
   */
  loginByEmail(request: LoginByEmailRequest): Promise<AppResult<AuthDataPayload, AppError>>

  /**
   * Signs in with phone credentials.
   *
   * @param request - Phone login payload from the shared contract
   * @returns Session tokens and related auth payload, or a mapped failure
   */
  loginByPhone(request: LoginByPhoneRequest): Promise<AppResult<AuthDataPayload, AppError>>

  /**
   * Signs in via an external identity provider.
   *
   * @param request - Provider-specific login payload from the shared contract
   * @returns Session tokens and related auth payload, or a mapped failure
   */
  loginByExternalAuthProvider(request: LoginByExternalAuthProviderRequest): Promise<AppResult<AuthDataPayload, AppError>>

  /**
   * Completes multifactor authentication using TOTP.
   *
   * @param request - Verification payload containing current TOTP token
   * @returns Session tokens and updated auth payload, or a mapped failure
   */
  loginByTotp(request: VerifyTotpPayload): Promise<AppResult<AuthDataPayload, AppError>>

  /**
   * Completes multifactor authentication using a static backup code.
   *
   * @param request - Verification payload containing unused recovery code
   * @returns Session tokens and updated auth payload, or a mapped failure
   */
  loginByTotpRecoveryCode(request: VerifyTotpPayload): Promise<AppResult<AuthDataPayload, AppError>>

  /**
   * Sends a login confirmation challenge to the user phone.
   *
   * @param request - Target phone and channel details
   * @returns Confirmation dispatch result, or a mapped failure
   */
  sendLoginConfirmationToPhone(request: SendConfirmationToPhoneRequest): Promise<AppResult<OtpConfirmationPayload, AppError>>
}
