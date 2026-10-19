import type { ErrorId } from '@/error/model/error-id'
import type { AccountLockoutType } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Base representation of an application error across SDK modules.
 */
export interface AppError {
  /** Unique error tracking identifier. */
  readonly id: ErrorId
  /** Machine-readable error code string. */
  readonly code: string
  /** Optional key-value parameters for localized message formatting. */
  readonly args?: Record<string, string> | null
  /** Indicates if the operation causing this error can be safely retried. */
  readonly isRetryable: boolean
  /** Optional cooldown delay in seconds extracted from error metadata. */
  readonly retryAfterSeconds?: number
  /** Optional MFA token extracted from error metadata. */
  readonly mfaToken?: string | null
  /** Optional account lockout category extracted from error metadata. */
  readonly lockoutType?: AccountLockoutType | null
  /** Optional lockout expiration epoch millis extracted from error metadata. */
  readonly lockoutUntil?: number | null
}
