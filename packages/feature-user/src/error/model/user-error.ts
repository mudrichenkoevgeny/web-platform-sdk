import { UserErrorCodes, ClientUserErrorCodes, UserErrorArgs } from '@mudrichenkoevgeny/shared-foundation'
import { generateErrorId } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ErrorId } from "@mudrichenkoevgeny/web-platform-sdk-core-common";

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
  readonly code: typeof UserErrorCodes.REGISTRATION_DISABLED
  readonly args: null
  readonly isRetryable: false
}

/** Emitted when attempting to change a nickname when changes are disabled by policy. */
export type UserErrorNicknameChangeDisabled = {
  readonly id: ErrorId
  readonly code: typeof UserErrorCodes.NICKNAME_CHANGE_DISABLED
  readonly args: null
  readonly isRetryable: false
}

/** Emitted when nickname length is below the configured minimum. */
export type UserErrorNicknameTooShort = {
  readonly id: ErrorId
  readonly code: typeof UserErrorCodes.NICKNAME_TOO_SHORT
  readonly args: Record<string, string>
  readonly isRetryable: false
  readonly minLength: number
}

/** Emitted when nickname length is above the configured maximum. */
export type UserErrorNicknameTooLong = {
  readonly id: ErrorId
  readonly code: typeof UserErrorCodes.NICKNAME_TOO_LONG
  readonly args: Record<string, string>
  readonly isRetryable: false
  readonly maxLength: number
}

/** Emitted when nickname contains forbidden characters. */
export type UserErrorInvalidNicknameCharacters = {
  readonly id: ErrorId
  readonly code: typeof UserErrorCodes.INVALID_NICKNAME_CHARACTERS
  readonly args: null
  readonly isRetryable: false
}

/** Emitted when display name length is below the configured minimum. */
export type UserErrorDisplayNameTooShort = {
  readonly id: ErrorId
  readonly code: typeof UserErrorCodes.DISPLAY_NAME_TOO_SHORT
  readonly args: Record<string, string>
  readonly isRetryable: false
  readonly minLength: number
}

/** Emitted when display name length is above the configured maximum. */
export type UserErrorDisplayNameTooLong = {
  readonly id: ErrorId
  readonly code: typeof UserErrorCodes.DISPLAY_NAME_TOO_LONG
  readonly args: Record<string, string>
  readonly isRetryable: false
  readonly maxLength: number
}

/** Emitted when display name contains forbidden characters. */
export type UserErrorInvalidDisplayNameCharacters = {
  readonly id: ErrorId
  readonly code: typeof UserErrorCodes.INVALID_DISPLAY_NAME_CHARACTERS
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
  | UserErrorNicknameChangeDisabled
  | UserErrorNicknameTooShort
  | UserErrorNicknameTooLong
  | UserErrorInvalidNicknameCharacters
  | UserErrorDisplayNameTooShort
  | UserErrorDisplayNameTooLong
  | UserErrorInvalidDisplayNameCharacters

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
    code: UserErrorCodes.REGISTRATION_DISABLED,
    args: null,
    isRetryable: false
  }),

  /**
   * Creates a nickname change disabled error.
   *
   * @returns {@link UserErrorNicknameChangeDisabled}
   */
  nicknameChangeDisabled: (): UserErrorNicknameChangeDisabled => ({
    id: generateErrorId(),
    code: UserErrorCodes.NICKNAME_CHANGE_DISABLED,
    args: null,
    isRetryable: false
  }),

  /**
   * Creates a nickname too short error.
   *
   * @param minLength - The minimum allowed length
   * @returns {@link UserErrorNicknameTooShort}
   */
  nicknameTooShort: (minLength: number): UserErrorNicknameTooShort => ({
    id: generateErrorId(),
    code: UserErrorCodes.NICKNAME_TOO_SHORT,
    args: { [UserErrorArgs.NICKNAME_MIN_LENGTH]: String(minLength) },
    isRetryable: false,
    minLength
  }),

  /**
   * Creates a nickname too long error.
   *
   * @param maxLength - The maximum allowed length
   * @returns {@link UserErrorNicknameTooLong}
   */
  nicknameTooLong: (maxLength: number): UserErrorNicknameTooLong => ({
    id: generateErrorId(),
    code: UserErrorCodes.NICKNAME_TOO_LONG,
    args: { [UserErrorArgs.NICKNAME_MAX_LENGTH]: String(maxLength) },
    isRetryable: false,
    maxLength
  }),

  /**
   * Creates an invalid nickname characters error.
   *
   * @returns {@link UserErrorInvalidNicknameCharacters}
   */
  invalidNicknameCharacters: (): UserErrorInvalidNicknameCharacters => ({
    id: generateErrorId(),
    code: UserErrorCodes.INVALID_NICKNAME_CHARACTERS,
    args: null,
    isRetryable: false
  }),

  /**
   * Creates a display name too short error.
   *
   * @param minLength - The minimum allowed length
   * @returns {@link UserErrorDisplayNameTooShort}
   */
  displayNameTooShort: (minLength: number): UserErrorDisplayNameTooShort => ({
    id: generateErrorId(),
    code: UserErrorCodes.DISPLAY_NAME_TOO_SHORT,
    args: { [UserErrorArgs.DISPLAY_NAME_MIN_LENGTH]: String(minLength) },
    isRetryable: false,
    minLength
  }),

  /**
   * Creates a display name too long error.
   *
   * @param maxLength - The maximum allowed length
   * @returns {@link UserErrorDisplayNameTooLong}
   */
  displayNameTooLong: (maxLength: number): UserErrorDisplayNameTooLong => ({
    id: generateErrorId(),
    code: UserErrorCodes.DISPLAY_NAME_TOO_LONG,
    args: { [UserErrorArgs.DISPLAY_NAME_MAX_LENGTH]: String(maxLength) },
    isRetryable: false,
    maxLength
  }),

  /**
   * Creates an invalid display name characters error.
   *
   * @returns {@link UserErrorInvalidDisplayNameCharacters}
   */
  invalidDisplayNameCharacters: (): UserErrorInvalidDisplayNameCharacters => ({
    id: generateErrorId(),
    code: UserErrorCodes.INVALID_DISPLAY_NAME_CHARACTERS,
    args: null,
    isRetryable: false
  })
}
