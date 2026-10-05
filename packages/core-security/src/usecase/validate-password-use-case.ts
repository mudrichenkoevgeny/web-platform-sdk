import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenSecuritySettingsRepository } from '@/repository/open-security-settings-repository'
import type { PasswordPolicyValidator, PasswordPolicyFailReason } from '@/domain/model/password-policy-validator'
import { SecurityError } from '@/error/model/security-error'
import { OpenPasswordPolicy } from '@/domain/model/open-security-settings'

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
   * @param passwordPolicyValidator - Pure domain logic validator implementation
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
      ? securitySettingsResult.data.openPasswordPolicy
      : FALLBACK_PASSWORD_POLICY

    const validationResult = this.passwordPolicyValidator.validate(passwordPolicy, password)

    if (validationResult.success) {
      return { success: true, data: undefined }
    }

    const primaryReason = validationResult.reasons[0] as PasswordPolicyFailReason
    return {
      success: false,
      error: this.toSecurityError(primaryReason, passwordPolicy.minLength)
    }
  }

  private toSecurityError(reason: PasswordPolicyFailReason, minLength: number): SecurityError {
    switch (reason) {
      case 'TOO_SHORT':
        return SecurityError.passwordTooShort(minLength)
      case 'NO_LETTER':
        return SecurityError.passwordNoLetter()
      case 'NO_UPPERCASE':
        return SecurityError.passwordNoUpperCase()
      case 'NO_LOWERCASE':
        return SecurityError.passwordNoLowerCase()
      case 'NO_DIGIT':
        return SecurityError.passwordNoDigit()
      case 'NO_SPECIAL_CHAR':
        return SecurityError.passwordNoSpecialChar()
      case 'TOO_COMMON':
        return SecurityError.passwordTooCommon()
    }
  }
}
