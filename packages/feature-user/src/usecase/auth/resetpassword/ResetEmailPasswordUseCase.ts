import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ResetPasswordRepository } from '@/repository/auth/resetpassword/ResetPasswordRepository'
import { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Completes password reset for email flow using server-issued confirmation code.
 */
export class ResetEmailPasswordUseCase {
  /**
   * Constructs a new {@link ResetEmailPasswordUseCase}.
   *
   * @param resetPasswordRepository - Password recovery repository
   */
  public constructor(private readonly resetPasswordRepository: ResetPasswordRepository) {}

  /**
   * Resets email password.
   *
   * @param email - Account email
   * @param newPassword - New password
   * @param confirmationCode - Confirmation code from email
   * @returns UserIdentifier on success or AppError
   */
  public async execute(
    email: string,
    newPassword: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifier, AppError>> {
    return this.resetPasswordRepository.resetPassword(email, newPassword, confirmationCode)
  }
}
