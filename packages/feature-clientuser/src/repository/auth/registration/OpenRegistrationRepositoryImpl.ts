import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AuthData, OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import { ConfirmationType, toAuthData, toOtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import { ConfirmationRepository, RegistrationRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { RegistrationApi } from '@/network/api/auth/registration/RegistrationApi'

/**
 * Implements {@link RegistrationRepository} using {@link RegistrationApi} and {@link ConfirmationRepository} for throttled confirmation sends.
 */
export class OpenRegistrationRepositoryImpl implements RegistrationRepository {
  /**
   * Constructs a new {@link OpenRegistrationRepositoryImpl}.
   *
   * @param registrationApi - Registration and send-confirmation HTTP endpoints
   * @param confirmationRepository - Client-side cooldown manager
   */
  public constructor(
    private readonly registrationApi: RegistrationApi,
    private readonly confirmationRepository: ConfirmationRepository
  ) {}

  public async registerByEmail(
    email: string,
    password: string,
    confirmationCode: string
  ): Promise<AppResult<AuthData, AppError>> {
    const result = await this.registrationApi.registerByEmail({
      email,
      password,
      confirmation_code: confirmationCode
    })
    return mapSuccess(result, (authDataPayload) => toAuthData(authDataPayload))
  }

  public async sendRegistrationConfirmationToEmail(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.confirmationRepository.executeWithTimer(
      ConfirmationType.REGISTRATION_EMAIL,
      email,
      async () => {
        const result = await this.registrationApi.sendRegistrationConfirmationToEmail({ email })
        return mapSuccess(result, (response) => toOtpConfirmation(response))
      }
    )
  }

  public getRemainingRegistrationConfirmationDelayInSeconds(email: string): number {
    return this.confirmationRepository.getRemainingDelay(ConfirmationType.REGISTRATION_EMAIL, email)
  }
}
