import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { LoginRepository } from '@/repository/auth/login/LoginRepository'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Requests a login confirmation code to be sent to the given phone (subject to repository rate limits).
 */
export class SendLoginConfirmationToPhoneUseCase {
  /**
   * Constructs a new {@link SendLoginConfirmationToPhoneUseCase}.
   *
   * @param loginRepository - Login repository performing send and throttling
   */
  public constructor(private readonly loginRepository: LoginRepository) {}

  /**
   * Sends login OTP to target phone number.
   *
   * @param phoneNumber - Target phone
   * @returns OtpConfirmation on success or AppError
   */
  public async execute(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.loginRepository.sendLoginConfirmationToPhone(phoneNumber)
  }
}
