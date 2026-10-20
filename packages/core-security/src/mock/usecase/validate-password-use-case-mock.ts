import { appResultFailure, appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ValidatePasswordUseCase } from '@/usecase/validate-password-use-case'
import { SecurityError } from '@/error/model/security-error'
import { OpenSecuritySettingsRepositoryMock } from '@/mock/repository/open-security-settings-repository-mock'
import { PasswordPolicyValidator } from '@/domain/model/password-policy-validator'

/**
 * Mock implementation of {@link ValidatePasswordUseCase} for testing UI components.
 */
export class ValidatePasswordUseCaseMock extends ValidatePasswordUseCase {
  /**
   * Constructs a new {@link ValidatePasswordUseCaseMock}.
   *
   * @param shouldFail - If true, mock will always fail with passwordTooShort
   */
  public constructor(private readonly shouldFail: boolean = false) {
    super(new OpenSecuritySettingsRepositoryMock(), new PasswordPolicyValidator())
  }

  /**
   * Evaluates the candidate password synchronously.
   *
   * @param _password - Candidate password (ignored)
   * @returns Configured mock result
   */
  public async execute(_password: string): Promise<AppResult<void, AppError>> {
    if (this.shouldFail) {
      return appResultFailure(SecurityError.passwordTooShort(8))
    }
    return appResultSuccess(undefined)
  }
}
