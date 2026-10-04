import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { RegistrationRepository } from '@/repository/auth/registration/RegistrationRepository'
import { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Sends a registration confirmation code to sign-up email address.
 */
export class SendRegistrationConfirmationToEmailUseCase {
  /**
   * Constructs a new {@link SendRegistrationConfirmationToEmailUseCase}.
   *
   * @param registrationRepository - Registration repository
   */
  public constructor(private readonly registrationRepository: RegistrationRepository) {}

  /**
   * Sends confirmation code to email.
   *
   * @param email - Target email
   * @returns OtpConfirmation on success or AppError
   */
  public async execute(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.registrationRepository.sendRegistrationConfirmationToEmail(email)
  }
}
