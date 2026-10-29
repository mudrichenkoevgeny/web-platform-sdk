import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import type { UnlockRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { SelfManagementUnlockRepository } from './self-management-unlock-repository'

/**
 * Adapter converting {@link SelfManagementUnlockRepository} to the {@link UnlockRepository} contract.
 */
export class SelfManagementUnlockRepositoryAdapter implements UnlockRepository {
  /**
   * Constructs a new {@link SelfManagementUnlockRepositoryAdapter}.
   *
   * @param repository - Underlying self management unlock repository
   */
  public constructor(private readonly repository: SelfManagementUnlockRepository) {}

  /**
   * Sends an account unlock confirmation code (OTP) to the specified email address.
   *
   * @param email - Target email address
   * @returns AppResult containing {@link OtpConfirmation}
   */
  public async sendUnlockEmailConfirmation(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.repository.sendUnlockEmailConfirmation(email)
  }

  /**
   * Returns remaining cooldown delay in seconds before sending another unlock email.
   *
   * @param email - Target email address
   * @returns Delay in seconds
   */
  public getRemainingUnlockEmailConfirmationDelayInSeconds(email: string): number {
    return this.repository.getRemainingUnlockEmailConfirmationDelayInSeconds(email)
  }

  /**
   * Unlocks a temporarily locked account using an email confirmation code.
   *
   * @param email - User email
   * @param confirmationCode - OTP confirmation code
   * @returns AppResult containing void
   */
  public async unlockByEmail(email: string, confirmationCode: string): Promise<AppResult<void, AppError>> {
    return this.repository.unlockByEmail(email, confirmationCode)
  }

  /**
   * Unsupported in management contour.
   */
  public async sendUnlockPhoneConfirmation(_phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return appResultFailure(CommonError.unknown(false))
  }

  /**
   * Unsupported in management contour.
   */
  public getRemainingUnlockPhoneConfirmationDelayInSeconds(_phoneNumber: string): number {
    return 0
  }

  /**
   * Unsupported in management contour.
   */
  public async unlockByPhone(_phoneNumber: string, _confirmationCode: string): Promise<AppResult<void, AppError>> {
    return appResultFailure(CommonError.unknown(false))
  }

  /**
   * Unsupported in management contour.
   */
  public async unlockByExternalAuthProvider(_authProvider: string, _externalProviderToken: string): Promise<AppResult<void, AppError>> {
    return appResultFailure(CommonError.unknown(false))
  }
}
