import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuthDataPayload,
  OtpConfirmationPayload,
  UserAuthProvider
} from '@mudrichenkoevgeny/shared-foundation'

/** Remote login and phone confirmation entry points for the user feature. */
export interface OpenLoginApi {
  /**
   * Signs in with email credentials.
   *
   * @param email - User email
   * @param password - Account password
   * @returns Session tokens and related auth payload, or a mapped failure
   */
  loginByEmail(email: string, password: string): Promise<AppResult<AuthDataPayload, AppError>>

  /**
   * Signs in with phone credentials.
   *
   * @param phoneNumber - User phone number
   * @param confirmationCode - OTP code
   * @returns Session tokens and related auth payload, or a mapped failure
   */
  loginByPhone(phoneNumber: string, confirmationCode: string): Promise<AppResult<AuthDataPayload, AppError>>

  /**
   * Signs in via an external identity provider.
   *
   * @param authProvider - Provider type
   * @param externalProviderToken - OAuth token
   * @returns Session tokens and related auth payload, or a mapped failure
   */
  loginByExternalAuthProvider(authProvider: UserAuthProvider, externalProviderToken: string): Promise<AppResult<AuthDataPayload, AppError>>

  /**
   * Completes multifactor authentication using TOTP.
   *
   * @param mfaToken - MFA token
   * @param code - TOTP code
   * @returns Session tokens and updated auth payload, or a mapped failure
   */
  loginByTotp(mfaToken: string, code: string): Promise<AppResult<AuthDataPayload, AppError>>

  /**
   * Completes multifactor authentication using a static backup code.
   *
   * @param mfaToken - MFA token
   * @param code - Backup recovery code
   * @returns Session tokens and updated auth payload, or a mapped failure
   */
  loginByTotpRecoveryCode(mfaToken: string, code: string): Promise<AppResult<AuthDataPayload, AppError>>

  /**
   * Sends a login confirmation challenge to the user phone.
   *
   * @param phoneNumber - Target phone number
   * @returns Confirmation dispatch result, or a mapped failure
   */
  sendLoginConfirmationToPhone(phoneNumber: string): Promise<AppResult<OtpConfirmationPayload, AppError>>
}
