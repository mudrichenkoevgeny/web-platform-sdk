import type { AppError } from '@/error/model/app-error'
import type { AccountLockoutType } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Safely reads cooldown delay in seconds from an application error instance.
 *
 * @param error - Application error instance
 * @returns Cooldown delay in seconds, or 0 if not present
 */
export const getAppErrorRetryAfterSeconds = (error: AppError): number => {
  return error.retryAfterSeconds ?? 0
}

/**
 * Safely reads MFA token from an application error instance.
 *
 * @param error - Application error instance
 * @returns MFA token string or null
 */
export const getAppErrorMfaToken = (error: AppError): string | null => {
  return error.mfaToken ?? null
}

/**
 * Safely reads account lockout type from an application error instance.
 *
 * @param error - Application error instance
 * @returns {@link AccountLockoutType} or null
 */
export const getAppErrorAccountLockoutType = (error: AppError): AccountLockoutType | null => {
  return error.lockoutType ?? null
}

/**
 * Safely reads temporary lockout expiration epoch millis from an application error instance.
 *
 * @param error - Application error instance
 * @returns Epoch millis timestamp or null
 */
export const getAppErrorTemporaryLockoutUntil = (error: AppError): number | null => {
  return error.lockoutUntil ?? null
}
