import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockRepository } from '@/repository/auth/unlock/UnlockRepository'

/** Unlocks an account using an email confirmation code. */
export class UnlockByEmailUseCase {
  /**
   * Constructs a new {@link UnlockByEmailUseCase}.
   *
   * @param unlockRepository - Account unlock repository
   */
  public constructor(private readonly unlockRepository: UnlockRepository) {}

  /**
   * Unlocks account via email OTP code.
   *
   * @param email - Target email
   * @param confirmationCode - Verification code
   * @returns AppResult success or AppError
   */
  public async execute(email: string, confirmationCode: string): Promise<AppResult<void, AppError>> {
    return this.unlockRepository.unlockByEmail(email, confirmationCode)
  }
}
