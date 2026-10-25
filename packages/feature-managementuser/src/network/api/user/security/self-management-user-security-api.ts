import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { TotpSecretKey } from '@mudrichenkoevgeny/shared-foundation'

/** Management REST API client interface for managing the current staff member's TOTP security settings. */
export interface SelfManagementUserSecurityApi {
  /**
   * Retrieves TOTP secret key for QR code setup.
   */
  getTotpSecretKey(): Promise<AppResult<TotpSecretKey, AppError>>

  /**
   * Enables TOTP two-factor authentication for current staff member.
   */
  enableTotp(mfaToken: string, totpCode: string): Promise<AppResult<string[], AppError>>

  /**
   * Disables TOTP two-factor authentication for current staff member.
   */
  disableTotp(mfaToken: string, totpCode: string): Promise<AppResult<void, AppError>>
}
