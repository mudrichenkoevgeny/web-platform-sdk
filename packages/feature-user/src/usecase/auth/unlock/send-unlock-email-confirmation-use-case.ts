import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UnlockRepository } from '@/repository/auth/unlock/UnlockRepository'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'

/** Sends an account unlock confirmation code to the target email. */
export class SendUnlockEmailConfirmationUseCase {
  /**
   * Constructs a new {@link SendUnlockEmailConfirmationUseCase}.
   *
   * @param unlockRepository - Account unlock repository
   */
  public constructor(private readonly unlockRepository: UnlockRepository) {}

  /**
   * Sends email unlock confirmation code.
   *
   * @param email - Target email
   * @returns OtpConfirmation or AppError
   */
  public async execute(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.unlockRepository.sendUnlockEmailConfirmation(email)
  }
}
