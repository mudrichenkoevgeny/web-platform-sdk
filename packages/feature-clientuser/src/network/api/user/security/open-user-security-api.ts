import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { TotpSecretKey } from '@mudrichenkoevgeny/shared-foundation'

/** Open REST API client interface for user TOTP security management. */
export interface OpenUserSecurityApi {
  /**
   * Retrieves TOTP secret key for QR code setup.
   *
   * @returns AppResult containing {@link TotpSecretKey} on success
   */
  getTotpSecretKey(): Promise<AppResult<TotpSecretKey, AppError>>

  /**
   * Enables TOTP two-factor authentication.
   *
   * @param mfaToken - MFA challenge token
   * @param totpCode - Candidate TOTP code
   * @returns AppResult containing array of recovery code strings
   */
  enableTotp(mfaToken: string, totpCode: string): Promise<AppResult<string[], AppError>>

  /**
   * Disables TOTP two-factor authentication for current user.
   *
   * @param mfaToken - MFA challenge token
   * @param totpCode - Candidate TOTP code
   * @returns AppResult containing void on success
   */
  disableTotp(mfaToken: string, totpCode: string): Promise<AppResult<void, AppError>>
}
