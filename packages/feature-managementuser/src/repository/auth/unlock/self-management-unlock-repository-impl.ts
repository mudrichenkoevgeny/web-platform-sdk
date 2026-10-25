import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import { ConfirmationType, toOtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import type { ConfirmationRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { SelfManagementUnlockApi } from '@/network/api/auth/unlock/self-management-unlock-api'
import type { SelfManagementUnlockRepository } from './self-management-unlock-repository'

/**
 * Implements {@link SelfManagementUnlockRepository} using {@link SelfManagementUnlockApi} and {@link ConfirmationRepository}.
 */
export class SelfManagementUnlockRepositoryImpl implements SelfManagementUnlockRepository {
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
        const result = await this.selfManagementUnlockApi.sendUnlockEmailConfirmation(email)
        return mapSuccess(result, (payload) => toOtpConfirmation(payload))
      }
    )
  }

  public getRemainingUnlockEmailConfirmationDelayInSeconds(email: string): number {
    return this.confirmationRepository.getRemainingDelay(ConfirmationType.UNLOCK_EMAIL, email)
  }

  public async unlockByEmail(email: string, confirmationCode: string): Promise<AppResult<void, AppError>> {
    return this.selfManagementUnlockApi.unlockByEmail(email, confirmationCode)
  }
}
