import { SecurityErrorArgs } from '@mudrichenkoevgeny/shared-foundation'
import { generateErrorId } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ErrorId } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { ClientSecurityErrorCodes } from '@/naming/ClientSecurityErrorCodes'
/** Error indicating security/password policy settings could not be fetched. */
export type SecurityErrorPasswordPolicyUnavailable = {
  readonly id: ErrorId
  readonly code: typeof ClientSecurityErrorCodes.PASSWORD_POLICY_UNAVAILABLE
  readonly args: null
  readonly isRetryable: true
}

/** Error indicating candidate password is shorter than minimum required length. */
export type SecurityErrorPasswordTooShort = {
  readonly id: ErrorId
  readonly code: typeof ClientSecurityErrorCodes.PASSWORD_TOO_SHORT
  readonly args: Record<string, string> | null
  readonly isRetryable: false
}

/** Error indicating candidate password contains no letter character. */
export type SecurityErrorPasswordNoLetter = {
  readonly id: ErrorId
  readonly code: typeof ClientSecurityErrorCodes.PASSWORD_NO_LETTER
  readonly args: null
  readonly isRetryable: false
}

/** Error indicating candidate password contains no uppercase letter. */
export type SecurityErrorPasswordNoUpperCase = {
  readonly id: ErrorId
  readonly code: typeof ClientSecurityErrorCodes.PASSWORD_NO_UPPERCASE
  readonly args: null
  readonly isRetryable: false
}

/** Error indicating candidate password contains no lowercase letter. */
export type SecurityErrorPasswordNoLowerCase = {
  readonly id: ErrorId
  readonly code: typeof ClientSecurityErrorCodes.PASSWORD_NO_LOWERCASE
  readonly args: null
  readonly isRetryable: false
}

/** Error indicating candidate password contains no digit character. */
export type SecurityErrorPasswordNoDigit = {
  readonly id: ErrorId
  readonly code: typeof ClientSecurityErrorCodes.PASSWORD_NO_DIGIT
  readonly args: null
  readonly isRetryable: false
}

/** Error indicating candidate password contains no special character. */
export type SecurityErrorPasswordNoSpecialChar = {
  readonly id: ErrorId
  readonly code: typeof ClientSecurityErrorCodes.PASSWORD_NO_SPECIAL_CHAR
  readonly args: null
  readonly isRetryable: false
}

/** Error indicating candidate password is on the forbidden common passwords list. */
export type SecurityErrorPasswordTooCommon = {
  readonly id: ErrorId
  readonly code: typeof ClientSecurityErrorCodes.PASSWORD_TOO_COMMON
  readonly args: null
  readonly isRetryable: false
}

/**
 * Discriminated union type representing security domain errors.
 */
export type SecurityError =
  | SecurityErrorPasswordPolicyUnavailable
  | SecurityErrorPasswordTooShort
  | SecurityErrorPasswordNoLetter
  | SecurityErrorPasswordNoUpperCase
  | SecurityErrorPasswordNoLowerCase
  | SecurityErrorPasswordNoDigit
  | SecurityErrorPasswordNoSpecialChar
  | SecurityErrorPasswordTooCommon

/**
 * Factory helper object for constructing {@link SecurityError} plain objects.
 */
export const SecurityError = {
  /**
   * Creates a password policy unavailable error.
   *
   * @returns {@link SecurityErrorPasswordPolicyUnavailable}
   */
  passwordPolicyUnavailable: (): SecurityErrorPasswordPolicyUnavailable => ({
    id: generateErrorId(),
    code: ClientSecurityErrorCodes.PASSWORD_POLICY_UNAVAILABLE,
    args: null,
    isRetryable: true
  }),

  /**
   * Creates a password too short validation error.
   *
   * @param minLength - Optional minimum length requirement
   * @returns {@link SecurityErrorPasswordTooShort}
   */
  passwordTooShort: (minLength?: number | null): SecurityErrorPasswordTooShort => ({
    id: generateErrorId(),
    code: ClientSecurityErrorCodes.PASSWORD_TOO_SHORT,
    args: minLength != null ? { [SecurityErrorArgs.PASSWORD_MIN_LENGTH]: String(minLength) } : null,
    isRetryable: false
  }),

  /**
   * Creates a password missing letter validation error.
   *
   * @returns {@link SecurityErrorPasswordNoLetter}
   */
  passwordNoLetter: (): SecurityErrorPasswordNoLetter => ({
    id: generateErrorId(),
    code: ClientSecurityErrorCodes.PASSWORD_NO_LETTER,
    args: null,
    isRetryable: false
  }),

  /**
   * Creates a password missing uppercase letter validation error.
   *
   * @returns {@link SecurityErrorPasswordNoUpperCase}
   */
  passwordNoUpperCase: (): SecurityErrorPasswordNoUpperCase => ({
    id: generateErrorId(),
    code: ClientSecurityErrorCodes.PASSWORD_NO_UPPERCASE,
    args: null,
    isRetryable: false
  }),

  /**
   * Creates a password missing lowercase letter validation error.
   *
   * @returns {@link SecurityErrorPasswordNoLowerCase}
   */
  passwordNoLowerCase: (): SecurityErrorPasswordNoLowerCase => ({
    id: generateErrorId(),
    code: ClientSecurityErrorCodes.PASSWORD_NO_LOWERCASE,
    args: null,
    isRetryable: false
  }),

  /**
   * Creates a password missing digit validation error.
   *
   * @returns {@link SecurityErrorPasswordNoDigit}
   */
  passwordNoDigit: (): SecurityErrorPasswordNoDigit => ({
    id: generateErrorId(),
    code: ClientSecurityErrorCodes.PASSWORD_NO_DIGIT,
    args: null,
    isRetryable: false
  }),

  /**
   * Creates a password missing special character validation error.
   *
   * @returns {@link SecurityErrorPasswordNoSpecialChar}
   */
  passwordNoSpecialChar: (): SecurityErrorPasswordNoSpecialChar => ({
    id: generateErrorId(),
    code: ClientSecurityErrorCodes.PASSWORD_NO_SPECIAL_CHAR,
    args: null,
    isRetryable: false
  }),

  /**
   * Creates a password too common validation error.
   *
   * @returns {@link SecurityErrorPasswordTooCommon}
   */
  passwordTooCommon: (): SecurityErrorPasswordTooCommon => ({
    id: generateErrorId(),
    code: ClientSecurityErrorCodes.PASSWORD_TOO_COMMON,
    args: null,
    isRetryable: false
  })
}
