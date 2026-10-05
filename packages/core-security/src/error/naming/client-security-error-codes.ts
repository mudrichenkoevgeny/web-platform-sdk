/**
 * Machine-readable error codes for security client errors and password policy validation.
 */
export const ClientSecurityErrorCodes = {
  /** Password policy is missing and cannot be fetched. */
  PASSWORD_POLICY_UNAVAILABLE: 'PASSWORD_POLICY_UNAVAILABLE',
  /** Password does not meet the minimum length requirement. */
  PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',
  /** Password must contain at least one letter. */
  PASSWORD_NO_LETTER: 'PASSWORD_NO_LETTER',
  /** Password must contain at least one uppercase letter. */
  PASSWORD_NO_UPPERCASE: 'PASSWORD_NO_UPPERCASE',
  /** Password must contain at least one lowercase letter. */
  PASSWORD_NO_LOWERCASE: 'PASSWORD_NO_LOWERCASE',
  /** Password must contain at least one digit. */
  PASSWORD_NO_DIGIT: 'PASSWORD_NO_DIGIT',
  /** Password must contain at least one special character. */
  PASSWORD_NO_SPECIAL_CHAR: 'PASSWORD_NO_SPECIAL_CHAR',
  /** Password is in the list of forbidden common passwords. */
  PASSWORD_TOO_COMMON: 'PASSWORD_TOO_COMMON'
} as const
