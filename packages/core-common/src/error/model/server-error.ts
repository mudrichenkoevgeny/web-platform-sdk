import type { AppError } from '@/error/model/app-error'
import type { ErrorId } from '@/error/model/error-id'
import {
  AccountLockoutType,
  CommonErrorArgs,
  SecurityErrorArgs,
  UserErrorArgs
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Represents an error returned explicitly by the remote server API.
 */
export class ServerError implements AppError {
  /** Arguments map used for message interpolation. */
  public readonly args: Record<string, string>
  /** Optional cooldown delay in seconds. */
  public readonly retryAfterSeconds: number
  /** Optional MFA verification token. */
  public readonly mfaToken: string | null
  /** Optional account lockout category. */
  public readonly lockoutType: AccountLockoutType | null
  /** Optional lockout expiration timestamp. */
  public readonly lockoutUntil: number | null

  /**
   * Constructs a new {@link ServerError}.
   *
   * @param id - Unique error identifier
   * @param code - Error code string
   * @param message - Raw message string from server response
   * @param args - Key-value map of error parameters
   * @param isRetryable - Whether the failed operation can be retried
   */
  public constructor(
    public readonly id: ErrorId,
    public readonly code: string,
    public readonly message: string,
    args?: Record<string, string>,
    public readonly isRetryable: boolean = false
  ) {
    const safeArgs = args ?? {}
    this.args = safeArgs

    const rawRetry = safeArgs[CommonErrorArgs.RETRY_AFTER_SECONDS] ?? safeArgs['retry_after_seconds']
    this.retryAfterSeconds = rawRetry && !isNaN(Number(rawRetry)) ? Number(rawRetry) : 0

    const rawMfa = safeArgs[SecurityErrorArgs.MFA_TOKEN] ?? safeArgs['mfa_token']
    this.mfaToken = rawMfa && rawMfa.trim().length > 0 ? rawMfa : null

    const rawLockoutType = safeArgs[UserErrorArgs.ACCOUNT_LOCKOUT_TYPE] ?? safeArgs['account_lockout_type']
    this.lockoutType = rawLockoutType ? (Object.values(AccountLockoutType).find((v) => v === rawLockoutType) ?? null) : null

    const rawLockoutUntil = safeArgs[UserErrorArgs.TEMPORARY_LOCKOUT_UNTIL] ?? safeArgs['temporary_lockout_until']
    this.lockoutUntil = rawLockoutUntil && !isNaN(Number(rawLockoutUntil)) ? Number(rawLockoutUntil) : null
  }
}
