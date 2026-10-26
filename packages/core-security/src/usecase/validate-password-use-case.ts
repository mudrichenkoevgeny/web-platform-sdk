import { appResultFailure, appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  PasswordPolicyFailReason,
  PasswordPolicyValidator,
  type OpenPasswordPolicy
} from '@mudrichenkoevgeny/shared-foundation'
import type { OpenSecuritySettingsRepository } from '@/repository/open-security-settings-repository'
import { SecurityError } from '@/error/model/security-error'

/** Default fallback password policy if loading from repository fails. */
const FALLBACK_PASSWORD_POLICY: OpenPasswordPolicy = {
  minLength: 8,
  requireLetter: true,
  requireUpperCase: false,
  requireLowerCase: false,
  requireDigit: false,
  requireSpecialChar: false
}

/**
 * Validates a password string against the current {@link OpenPasswordPolicy} from {@link OpenSecuritySettingsRepository}.
 */
export class ValidatePasswordUseCase {
  /**
   * Constructs a new {@link ValidatePasswordUseCase}.
   *
   * @param openSecuritySettingsRepository - Source of the active password policy
   * @param passwordPolicyValidator - Pure domain logic validator implementation from shared foundation
   */
  public constructor(
    private readonly openSecuritySettingsRepository: OpenSecuritySettingsRepository,
    private readonly passwordPolicyValidator: PasswordPolicyValidator
  ) {}

  /**
   * Evaluates the candidate password.
   *
   * @param password - Candidate password to validate
   * @returns AppResult resolving to void on success, or SecurityError on failure
   */
  public async execute(password: string): Promise<AppResult<void, AppError>> {
    const securitySettingsResult = await this.openSecuritySettingsRepository.getOpenSecuritySettings()

    const passwordPolicy = securitySettingsResult.success
      ? securitySettingsResult.data.passwordPolicy
      : FALLBACK_PASSWORD_POLICY

    const validationResult = this.passwordPolicyValidator.validate(passwordPolicy, password)

    if (validationResult.success) {
      return appResultSuccess(undefined)
    }

    const primaryReason = validationResult.reasons[0] ?? PasswordPolicyFailReason.TOO_SHORT
    return appResultFailure(this.toSecurityError(primaryReason, passwordPolicy.minLength))
  }

  private toSecurityError(reason: PasswordPolicyFailReason, minLength: number): SecurityError {
    switch (reason) {
      case PasswordPolicyFailReason.TOO_SHORT:
      case 'too_short':
        return SecurityError.passwordTooShort(minLength)
      case PasswordPolicyFailReason.NO_LETTER:
      case 'no_letter':
        return SecurityError.passwordNoLetter()
      case PasswordPolicyFailReason.NO_UPPERCASE:
      case 'no_uppercase':
        return SecurityError.passwordNoUpperCase()
      case PasswordPolicyFailReason.NO_LOWERCASE:
      case 'no_lowercase':
        return SecurityError.passwordNoLowerCase()
      case PasswordPolicyFailReason.NO_DIGIT:
      case 'no_digit':
        return SecurityError.passwordNoDigit()
      case PasswordPolicyFailReason.NO_SPECIAL_CHAR:
      case 'no_special_char':
        return SecurityError.passwordNoSpecialChar()
      case PasswordPolicyFailReason.TOO_COMMON:
      case 'too_common':
        return SecurityError.passwordTooCommon()
      default:
        return SecurityError.passwordTooShort(minLength)
    }
  }
}
