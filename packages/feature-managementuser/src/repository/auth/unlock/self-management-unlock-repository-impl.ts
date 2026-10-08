import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import { ConfirmationType, toOtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import type { ConfirmationRepository, UnlockRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { SelfManagementUnlockApi } from '@/network/api/auth/unlock/self-management-unlock-api'

/**
 * Implements {@link UnlockRepository} using {@link SelfManagementUnlockApi} and {@link ConfirmationRepository} for rate limiting.
 */
export class SelfManagementUnlockRepositoryImpl implements UnlockRepository {
  /**
   * Constructs a new {@link SelfManagementUnlockRepositoryImpl}.
   *
   * @param selfManagementUnlockApi - Account unlock HTTP endpoints for management users
   * @param confirmationRepository - Cooldown manager for OTP confirmation requests
   */
  public constructor(
    private readonly selfManagementUnlockApi: SelfManagementUnlockApi,
    private readonly confirmationRepository: ConfirmationRepository
  ) {}

  public async sendUnlockEmailConfirmation(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.confirmationRepository.executeWithTimer(
      ConfirmationType.UNLOCK_EMAIL,
      email,
      async () => {
        const result = await this.selfManagementUnlockApi.sendUnlockEmailConfirmation({ email })
        return mapSuccess(result, (payload) => toOtpConfirmation(payload))
      }
    )
  }

  public getRemainingUnlockEmailConfirmationDelayInSeconds(email: string): number {
    return this.confirmationRepository.getRemainingDelay(ConfirmationType.UNLOCK_EMAIL, email)
  }

  public async unlockByEmail(email: string, confirmationCode: string): Promise<AppResult<void, AppError>> {
    return this.selfManagementUnlockApi.unlockByEmail({
      email,
      confirmation_code: confirmationCode
    })
  }

  public async sendUnlockPhoneConfirmation(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.confirmationRepository.executeWithTimer(
      ConfirmationType.UNLOCK_PHONE,
      phoneNumber,
      async () => {
        const result = await this.selfManagementUnlockApi.sendUnlockPhoneConfirmation({ phone_number: phoneNumber })
        return mapSuccess(result, (payload) => toOtpConfirmation(payload))
      }
    )
  }

  public getRemainingUnlockPhoneConfirmationDelayInSeconds(phoneNumber: string): number {
    return this.confirmationRepository.getRemainingDelay(ConfirmationType.UNLOCK_PHONE, phoneNumber)
  }

  public async unlockByPhone(phoneNumber: string, confirmationCode: string): Promise<AppResult<void, AppError>> {
    return this.selfManagementUnlockApi.unlockByPhone({
      phone_number: phoneNumber,
      confirmation_code: confirmationCode
    })
  }

  public async unlockByExternalAuthProvider(
    authProvider: string,
    externalProviderToken: string
  ): Promise<AppResult<void, AppError>> {
    return this.selfManagementUnlockApi.unlockByExternalAuthProvider({
      auth_provider: authProvider,
      external_provider_token: externalProviderToken
    })
  }
}
