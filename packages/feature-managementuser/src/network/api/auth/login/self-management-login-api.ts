import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AuthDataPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Remote login entry points for management user context. */
export interface SelfManagementLoginApi {
  /**
   * Signs in with email credentials.
   *
   * @param email - Management account email
   * @param password - Account password
   * @returns Session tokens and related auth payload, or a mapped failure
   */
  loginByEmail(email: string, password: string): Promise<AppResult<AuthDataPayload, AppError>>

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
}
