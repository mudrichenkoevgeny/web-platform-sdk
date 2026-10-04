import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { IdentifierRepository } from '@/repository/identifier/IdentifierRepository'
import { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'

/** Triggers a confirmation challenge for email association. */
export class SendAddEmailIdentifierConfirmationUseCase {
  /**
   * Constructs a new {@link SendAddEmailIdentifierConfirmationUseCase}.
   *
   * @param identifierRepository - Identifier repository
   */
  public constructor(private readonly identifierRepository: IdentifierRepository) {}

  /**
   * Sends email association OTP.
   *
   * @param email - Target email
   * @returns OtpConfirmation or AppError
   */
  public async execute(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.identifierRepository.sendAddEmailIdentifierConfirmation(email)
  }
}
