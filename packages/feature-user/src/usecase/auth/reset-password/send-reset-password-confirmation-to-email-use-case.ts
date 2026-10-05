import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ResetPasswordRepository } from '@/repository/auth/reset-password/reset-password-repository'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Sends a password-reset confirmation to account email.
 */
export class SendResetPasswordConfirmationToEmailUseCase {
  /**
   * Constructs a new {@link SendResetPasswordConfirmationToEmailUseCase}.
   *
   * @param resetPasswordRepository - Password recovery repository
   */
  public constructor(private readonly resetPasswordRepository: ResetPasswordRepository) {}

  /**
   * Sends password reset confirmation code to email.
   *
   * @param email - Target email
   * @returns OtpConfirmation on success or AppError
   */
  public async execute(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.resetPasswordRepository.sendResetPasswordConfirmationToEmail(email)
  }
}
