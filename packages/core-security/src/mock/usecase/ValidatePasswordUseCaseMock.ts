import { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ValidatePasswordUseCase } from '../../usecase/ValidatePasswordUseCase'
import { SecurityError } from '../../error/model/SecurityError'

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
    // Pass null casts to bypass constructor checks since we override the method
    super(null as any, null as any)
  }

  /**
   * Evaluates the candidate password synchronously.
   *
   * @param _password - Candidate password (ignored)
   * @returns Configured mock result
   */
  public async invoke(_password: string): Promise<AppResult<void, AppError>> {
    if (this.shouldFail) {
      return { success: false, error: SecurityError.passwordTooShort(8) }
    }
    return { success: true, data: undefined }
  }
}
