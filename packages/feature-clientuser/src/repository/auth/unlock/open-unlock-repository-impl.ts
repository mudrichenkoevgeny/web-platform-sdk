import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import { ConfirmationType, toOtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import { ConfirmationRepository, UnlockRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenUnlockApi } from '@/network/api/auth/unlock/open-unlock-api'

/**
 * Implements {@link UnlockRepository} using {@link OpenUnlockApi} and {@link ConfirmationRepository} for rate limiting.
 */
export class OpenUnlockRepositoryImpl implements UnlockRepository {
  /**
   * Constructs a new {@link OpenUnlockRepositoryImpl}.
   *
   * @param openUnlockApi - Account unlock HTTP endpoints
   * @param confirmationRepository - Cooldown manager for OTP confirmation requests
   */
  public constructor(
    private readonly openUnlockApi: OpenUnlockApi,
    private readonly confirmationRepository: ConfirmationRepository
  ) {}

  public async sendUnlockEmailConfirmation(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.confirmationRepository.executeWithTimer(
      ConfirmationType.UNLOCK_EMAIL,
      email,
      async () => {
        const result = await this.openUnlockApi.sendUnlockEmailConfirmation({ email })
        return mapSuccess(result, (payload) => toOtpConfirmation(payload))
      }
    )
  }

  public getRemainingUnlockEmailConfirmationDelayInSeconds(email: string): number {
    return this.confirmationRepository.getRemainingDelay(ConfirmationType.UNLOCK_EMAIL, email)
  }

  public async unlockByEmail(email: string, confirmationCode: string): Promise<AppResult<void, AppError>> {
    return this.openUnlockApi.unlockByEmail({
      email,
      confirmation_code: confirmationCode
    })
  }

  public async sendUnlockPhoneConfirmation(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.confirmationRepository.executeWithTimer(
      ConfirmationType.UNLOCK_PHONE,
      phoneNumber,
      async () => {
        const result = await this.openUnlockApi.sendUnlockPhoneConfirmation({ phone_number: phoneNumber })
        return mapSuccess(result, (payload) => toOtpConfirmation(payload))
      }
    )
  }

  public getRemainingUnlockPhoneConfirmationDelayInSeconds(phoneNumber: string): number {
    return this.confirmationRepository.getRemainingDelay(ConfirmationType.UNLOCK_PHONE, phoneNumber)
  }

  public async unlockByPhone(phoneNumber: string, confirmationCode: string): Promise<AppResult<void, AppError>> {
    return this.openUnlockApi.unlockByPhone({
      phone_number: phoneNumber,
      confirmation_code: confirmationCode
    })
  }

  public async unlockByExternalAuthProvider(
    authProvider: string,
    externalProviderToken: string
  ): Promise<AppResult<void, AppError>> {
    return this.openUnlockApi.unlockByExternalAuthProvider({
      auth_provider: authProvider,
      external_provider_token: externalProviderToken
    })
  }
}
