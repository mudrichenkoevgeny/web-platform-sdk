import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ConfirmationKey } from '@mudrichenkoevgeny/shared-foundation'

/** Management REST API client interface for self-management password reset operations. */
export interface SelfManagementResetPasswordApi {
  /**
   * Requests a password reset verification code for a staff member.
   *
   * @param identifier - Email or phone identifier
   * @returns AppResult containing {@link ConfirmationKey} on success
   */
  requestResetPasswordCode(identifier: string): Promise<AppResult<ConfirmationKey, AppError>>

  /**
   * Confirms password reset with key and code.
   *
   * @param key - Confirmation key
   * @param code - Verification code
   * @param newPassword - Optional new password
   * @returns AppResult containing void on success
   */
  confirmResetPassword(key: string, code: string, newPassword?: string | null): Promise<AppResult<void, AppError>>
}
