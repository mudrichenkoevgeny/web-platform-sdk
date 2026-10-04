import { UserErrorCodes } from '@mudrichenkoevgeny/shared-foundation'
import { generateErrorId } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ErrorId } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { ClientUserErrorCodes } from '@/naming/ClientUserErrorCodes'
/**
 * Error emitted when the stored refresh token is rejected or missing while refreshing a session.
 */
export type UserErrorInvalidRefreshToken = {
  readonly id: ErrorId
  readonly code: typeof UserErrorCodes.INVALID_REFRESH_TOKEN
  readonly args: null
  readonly isRetryable: false
}

/**
 * User aborted an external OAuth/sign-in flow.
 */
export type UserErrorExternalAuthCancelled = {
  readonly id: ErrorId
  readonly code: typeof ClientUserErrorCodes.EXTERNAL_AUTH_CANCELLED
  readonly args: null
  readonly isRetryable: false
  readonly throwable?: unknown
}

/**
 * External OAuth/sign-in failed after user interaction.
 */
export type UserErrorExternalAuthFailed = {
  readonly id: ErrorId
  readonly code: typeof ClientUserErrorCodes.EXTERNAL_AUTH_FAILED
  readonly args: null
  readonly isRetryable: false
  readonly throwable?: unknown
}

/**
 * Rate limiting on confirmation-code requests.
 */
export type UserErrorTooManyConfirmationRequests = {
  readonly id: ErrorId
  readonly code: typeof ClientUserErrorCodes.TOO_MANY_CONFIRMATION_REQUESTS
  readonly args: Record<string, string> | null
  readonly isRetryable: false
  readonly retryAfterSeconds: number
}

/**
 * Registration is disabled by administrator in auth settings.
 */
export type UserErrorRegistrationDisabled = {
  readonly id: ErrorId
  readonly code: typeof ClientUserErrorCodes.REGISTRATION_DISABLED
  readonly args: null
  readonly isRetryable: false
}

/**
 * Discriminated union type representing user-feature application errors.
 */
export type UserError =
  | UserErrorInvalidRefreshToken
  | UserErrorExternalAuthCancelled
  | UserErrorExternalAuthFailed
  | UserErrorTooManyConfirmationRequests
  | UserErrorRegistrationDisabled

/**
 * Factory helper object for constructing {@link UserError} instances.
 */
export const UserError = {
  /**
   * Creates an invalid refresh token error.
   *
   * @returns {@link UserErrorInvalidRefreshToken}
   */
  invalidRefreshToken: (): UserErrorInvalidRefreshToken => ({
    id: generateErrorId(),
    code: UserErrorCodes.INVALID_REFRESH_TOKEN,
    args: null,
    isRetryable: false
  }),

  /**
   * Creates an external auth cancelled error.
   *
   * @param throwable - Optional underlying cancellation cause
   * @returns {@link UserErrorExternalAuthCancelled}
   */
  externalAuthCancelled: (throwable?: unknown): UserErrorExternalAuthCancelled => ({
    id: generateErrorId(),
    code: ClientUserErrorCodes.EXTERNAL_AUTH_CANCELLED,
    args: null,
    isRetryable: false,
    throwable
  }),

  /**
   * Creates an external auth failed error.
   *
   * @param throwable - Optional failure cause
   * @returns {@link UserErrorExternalAuthFailed}
   */
  externalAuthFailed: (throwable?: unknown): UserErrorExternalAuthFailed => ({
    id: generateErrorId(),
    code: ClientUserErrorCodes.EXTERNAL_AUTH_FAILED,
    args: null,
    isRetryable: false,
    throwable
  }),

  /**
   * Creates a too many confirmation requests error.
   *
   * @param retryAfterSeconds - Suggested wait time before retrying
   * @returns {@link UserErrorTooManyConfirmationRequests}
   */
  tooManyConfirmationRequests: (retryAfterSeconds: number): UserErrorTooManyConfirmationRequests => ({
    id: generateErrorId(),
    code: ClientUserErrorCodes.TOO_MANY_CONFIRMATION_REQUESTS,
    args: { retryAfterSeconds: String(retryAfterSeconds) },
    isRetryable: false,
    retryAfterSeconds
  }),

  /**
   * Creates a registration disabled error.
   *
   * @returns {@link UserErrorRegistrationDisabled}
   */
  registrationDisabled: (): UserErrorRegistrationDisabled => ({
    id: generateErrorId(),
    code: ClientUserErrorCodes.REGISTRATION_DISABLED,
    args: null,
    isRetryable: false
  })
}
