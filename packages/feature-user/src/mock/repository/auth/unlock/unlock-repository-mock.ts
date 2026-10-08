import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { UnlockRepository } from '@/repository/auth/unlock/unlock-repository'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
/**
 * Mock implementation of {@link UnlockRepository}.
 */
export class UnlockRepositoryMock implements UnlockRepository {
  public sendUnlockEmailConfirmationResult: AppResult<OtpConfirmation, AppError> = appResultSuccess({
    retryAfterSeconds: 0,
    numberOfSymbols: 6,
    expirationSeconds: 300
  })
  public remainingEmailDelaySeconds = 0
  public unlockByEmailResult: AppResult<void, AppError> = appResultSuccess(undefined)

  public sendUnlockPhoneConfirmationResult: AppResult<OtpConfirmation, AppError> = appResultSuccess({
    retryAfterSeconds: 0,
    numberOfSymbols: 6,
    expirationSeconds: 300
  })
  public remainingPhoneDelaySeconds = 0
  public unlockByPhoneResult: AppResult<void, AppError> = appResultSuccess(undefined)

  public unlockByExternalAuthProviderResult: AppResult<void, AppError> = appResultSuccess(undefined)

  public lastEmail: string | null = null
  public lastPhoneNumber: string | null = null
  public lastConfirmationCode: string | null = null
  public lastAuthProvider: string | null = null
  public lastExternalProviderToken: string | null = null

  public async sendUnlockEmailConfirmation(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    this.lastEmail = email
    return this.sendUnlockEmailConfirmationResult
  }

  public getRemainingUnlockEmailConfirmationDelayInSeconds(): number {
    return this.remainingEmailDelaySeconds
  }

  public async unlockByEmail(email: string, confirmationCode: string): Promise<AppResult<void, AppError>> {
    this.lastEmail = email
    this.lastConfirmationCode = confirmationCode
    return this.unlockByEmailResult
  }

  public async sendUnlockPhoneConfirmation(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>> {
    this.lastPhoneNumber = phoneNumber
    return this.sendUnlockPhoneConfirmationResult
  }

  public getRemainingUnlockPhoneConfirmationDelayInSeconds(): number {
    return this.remainingPhoneDelaySeconds
  }

  public async unlockByPhone(phoneNumber: string, confirmationCode: string): Promise<AppResult<void, AppError>> {
    this.lastPhoneNumber = phoneNumber
    this.lastConfirmationCode = confirmationCode
    return this.unlockByPhoneResult
  }

  public async unlockByExternalAuthProvider(
    authProvider: string,
    externalProviderToken: string
  ): Promise<AppResult<void, AppError>> {
    this.lastAuthProvider = authProvider
    this.lastExternalProviderToken = externalProviderToken
    return this.unlockByExternalAuthProviderResult
  }
}
