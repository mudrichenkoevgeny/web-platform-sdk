import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { TotpRecoveryCodes, TotpSetup } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Manages security settings, multifactor authentication (TOTP), and recovery codes
 * for the current authenticated account.
 */
export interface UserSecurityRepository {
  /** Initiates TOTP setup process by generating secret key and configuration URI. */
  setupTotp(): Promise<AppResult<TotpSetup, AppError>>

  /** Finalizes and enables TOTP multifactor authentication using verification code. */
  enableTotp(mfaToken: string, code: string): Promise<AppResult<TotpRecoveryCodes, AppError>>

  /** Disables TOTP multifactor authentication for current account. */
  disableTotp(): Promise<AppResult<void, AppError>>

  /** Retrieves active backup recovery codes for current account. */
  getRecoveryCodes(): Promise<AppResult<TotpRecoveryCodes, AppError>>

  /** Invalidates current recovery codes and generates a fresh replacement set. */
  regenerateRecoveryCodes(): Promise<AppResult<TotpRecoveryCodes, AppError>>
}
