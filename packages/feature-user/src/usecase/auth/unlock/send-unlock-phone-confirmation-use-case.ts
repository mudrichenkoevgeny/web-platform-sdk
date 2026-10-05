import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UnlockRepository } from '@/repository/auth/unlock/UnlockRepository'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'

/** Sends an account unlock confirmation code to the target phone number. */
export class SendUnlockPhoneConfirmationUseCase {
  /**
   * Constructs a new {@link SendUnlockPhoneConfirmationUseCase}.
   *
   * @param unlockRepository - Account unlock repository
   */
  public constructor(private readonly unlockRepository: UnlockRepository) {}

  /**
   * Sends phone unlock confirmation code.
   *
   * @param phoneNumber - Target phone number
   * @returns OtpConfirmation or AppError
   */
  public async execute(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.unlockRepository.sendUnlockPhoneConfirmation(phoneNumber)
  }
}
