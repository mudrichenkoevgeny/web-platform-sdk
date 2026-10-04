import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockRepository } from '@/repository/auth/unlock/UnlockRepository'

/** Unlocks an account using a phone confirmation code. */
export class UnlockByPhoneUseCase {
  /**
   * Constructs a new {@link UnlockByPhoneUseCase}.
   *
   * @param unlockRepository - Account unlock repository
   */
  public constructor(private readonly unlockRepository: UnlockRepository) {}

  /**
   * Unlocks account via phone OTP code.
   *
   * @param phoneNumber - Target phone number
   * @param confirmationCode - Verification code
   * @returns AppResult success or AppError
   */
  public async execute(phoneNumber: string, confirmationCode: string): Promise<AppResult<void, AppError>> {
    return this.unlockRepository.unlockByPhone(phoneNumber, confirmationCode)
  }
}
