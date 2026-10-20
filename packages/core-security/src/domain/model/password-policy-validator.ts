import type { OpenPasswordPolicy } from '@/domain/model/open-security-settings'

/** Represents individual reasons why a password might fail policy validation. */
export type PasswordPolicyFailReason =
  | 'TOO_SHORT'
  | 'NO_LETTER'
  | 'NO_UPPERCASE'
  | 'NO_LOWERCASE'
  | 'NO_DIGIT'
  | 'NO_SPECIAL_CHAR'
  | 'TOO_COMMON'

/** Result of a password policy validation check. */
export type PasswordPolicyValidatorResult =
  | { readonly success: true }
  | { readonly success: false; readonly reasons: [PasswordPolicyFailReason, ...PasswordPolicyFailReason[]] }

/**
 * Validates a candidate password string against an {@link OpenPasswordPolicy}.
 */
export class PasswordPolicyValidator {
  /**
   * Evaluates a password string against the rules defined in a policy.
   *
   * @param policy - Target password policy
   * @param password - Candidate string
   * @returns Validation result indicating success or failure reasons
   */
  public validate(policy: OpenPasswordPolicy, password: string): PasswordPolicyValidatorResult {
    const reasons: PasswordPolicyFailReason[] = []

    if (password.length < policy.minLength) {
      reasons.push('TOO_SHORT')
    }

    if (policy.requireLetter && !/[a-zA-Z]/.test(password)) {
      reasons.push('NO_LETTER')
    }

    if (policy.requireUpperCase && !/[A-Z]/.test(password)) {
      reasons.push('NO_UPPERCASE')
    }

    if (policy.requireLowerCase && !/[a-z]/.test(password)) {
      reasons.push('NO_LOWERCASE')
    }

    if (policy.requireDigit && !/[0-9]/.test(password)) {
      reasons.push('NO_DIGIT')
    }

    if (policy.requireSpecialChar && !/[^a-zA-Z0-9]/.test(password)) {
      reasons.push('NO_SPECIAL_CHAR')
    }

    const [firstReason, ...rest] = reasons
    if (firstReason) {
      return { success: false, reasons: [firstReason, ...rest] }
    }

    return { success: true }
  }
}
