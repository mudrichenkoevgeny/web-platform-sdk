import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  TotpRecoveryCodesPayload,
  TotpSetupPayload,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'

/** Self-service security management for the authenticated user, including TOTP and recovery codes configuration. */
export interface UserSecurityApi {
  /**
   * Generates a new TOTP secret and returns initialization setup data.
   *
   * @returns TOTP setup details including secret key and challenge token, or a mapped failure
   */
  setupTotp(): Promise<AppResult<TotpSetupPayload, AppError>>

  /**
   * Finalizes and enables TOTP activation by verifying the initial token code.
   *
   * @param request - Verification payload containing current TOTP code
   * @returns Initial set of generated backup recovery codes, or a mapped failure
   */
  enableTotp(request: VerifyTotpPayload): Promise<AppResult<TotpRecoveryCodesPayload, AppError>>

  /**
   * Disables TOTP and invalidates all associated backup recovery codes for the account.
   *
   * @returns Success indicator or mapped failure
   */
  disableTotp(): Promise<AppResult<void, AppError>>

  /**
   * Returns current active backup recovery codes for the account.
   *
   * @returns Active recovery codes payload or mapped failure
   */
  getRecoveryCodes(): Promise<AppResult<TotpRecoveryCodesPayload, AppError>>

  /**
   * Invalidates all existing backup recovery codes and generates a new set.
   *
   * @returns Fresh set of recovery codes or mapped failure
   */
  regenerateRecoveryCodes(): Promise<AppResult<TotpRecoveryCodesPayload, AppError>>
}
