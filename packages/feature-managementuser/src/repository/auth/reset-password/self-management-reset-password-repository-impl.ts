import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OtpConfirmation, UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { ConfirmationType, toOtpConfirmation, toUserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import type {
  ConfirmationRepository,
  ResetPasswordApi,
  ResetPasswordRepository
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/**
 * Implements {@link ResetPasswordRepository} via {@link ResetPasswordApi}, using {@link ConfirmationRepository} for send-code cooldown state.
 */
export class SelfManagementResetPasswordRepositoryImpl implements ResetPasswordRepository {
  /**
   * Constructs a new {@link SelfManagementResetPasswordRepositoryImpl}.
   *
   * @param resetPasswordApi - HTTP endpoints for reset and confirmation send
   * @param confirmationRepository - Rate limiting for password-reset email confirmation sends
   */
  public constructor(
    private readonly resetPasswordApi: ResetPasswordApi,
    private readonly confirmationRepository: ConfirmationRepository
  ) {}

  public async resetPassword(
    email: string,
    newPassword: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    const result = await this.resetPasswordApi.resetPassword({
      email,
      new_password: newPassword,
      confirmation_code: confirmationCode
    })
    return mapSuccess(result, (response) => toUserIdentifierPrivate(response))
  }

  public async sendResetPasswordConfirmationToEmail(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.confirmationRepository.executeWithTimer(
      ConfirmationType.PASSWORD_RESET_EMAIL,
      email,
      async () => {
        const result = await this.resetPasswordApi.sendResetPasswordConfirmationToEmail({ email })
        return mapSuccess(result, (response) => toOtpConfirmation(response))
      }
    )
  }

  public getRemainingResetPasswordConfirmationDelayInSeconds(email: string): number {
    return this.confirmationRepository.getRemainingDelay(ConfirmationType.PASSWORD_RESET_EMAIL, email)
  }
}
