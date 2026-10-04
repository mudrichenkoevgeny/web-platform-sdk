import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ConfirmationType } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Client-side rate limiting for confirmation flows keyed by ConfirmationType and identifier.
 */
export interface ConfirmationRepository {
  /**
   * Invokes action when cooldown for given key has elapsed; otherwise returns error AppResult.
   *
   * @param type - Confirmation flow type
   * @param identifier - Target identifier string
   * @param action - Deferred network action
   * @returns Action result or UserError.TooManyConfirmationRequests error
   */
  executeWithTimer<T>(
    type: ConfirmationType,
    identifier: string,
    action: () => Promise<AppResult<T, AppError>>
  ): Promise<AppResult<T, AppError>>

  /**
   * Returns remaining cooldown in seconds before another attempt is allowed, or 0.
   *
   * @param type - Confirmation flow type
   * @param identifier - Target identifier string
   * @returns Remaining cooldown seconds or 0
   */
  getRemainingDelay(type: ConfirmationType, identifier: string): number
}
