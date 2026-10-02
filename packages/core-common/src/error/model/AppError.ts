import { ErrorId } from './ErrorId'

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
}
