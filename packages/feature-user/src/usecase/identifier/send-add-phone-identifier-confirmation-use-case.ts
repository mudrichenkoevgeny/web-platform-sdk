import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { IdentifierRepository } from '@/repository/identifier/IdentifierRepository'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'

/** Triggers a confirmation challenge for phone association. */
export class SendAddPhoneIdentifierConfirmationUseCase {
  /**
   * Constructs a new {@link SendAddPhoneIdentifierConfirmationUseCase}.
   *
   * @param identifierRepository - Identifier repository
   */
  public constructor(private readonly identifierRepository: IdentifierRepository) {}

  /**
   * Sends phone association OTP.
   *
   * @param phoneNumber - Target phone number
   * @returns OtpConfirmation or AppError
   */
  public async execute(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.identifierRepository.sendAddPhoneIdentifierConfirmation(phoneNumber)
  }
}
