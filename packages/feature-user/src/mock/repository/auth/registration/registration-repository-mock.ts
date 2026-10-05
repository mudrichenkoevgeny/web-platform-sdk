import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { RegistrationRepository } from '@/repository/auth/registration/RegistrationRepository'
import type { AuthData } from '@mudrichenkoevgeny/shared-foundation'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
/**
 * Mock implementation of {@link RegistrationRepository}.
 */
export class RegistrationRepositoryMock implements RegistrationRepository {
  public lastEmail: string | null = null
  public lastPassword: string | null = null
  public lastConfirmationCode: string | null = null

  public authDataResultProvider: () => Promise<AppResult<AuthData, AppError>> = async () =>
    appResultFailure(CommonError.contractViolation(new Error('No mock AuthData provided.')))

  public otpConfirmationResultProvider: () => Promise<AppResult<OtpConfirmation, AppError>> = async () =>
    appResultFailure(CommonError.contractViolation(new Error('No mock OtpConfirmation provided.')))

  public remainingDelayProvider: (email: string) => number = () => 0

  public async registerByEmail(
    email: string,
    password: string,
    confirmationCode: string
  ): Promise<AppResult<AuthData, AppError>> {
    this.lastEmail = email
    this.lastPassword = password
    this.lastConfirmationCode = confirmationCode
    return this.authDataResultProvider()
  }

  public async sendRegistrationConfirmationToEmail(email: string): Promise<AppResult<OtpConfirmation, AppError>> {
    this.lastEmail = email
    return this.otpConfirmationResultProvider()
  }

  public getRemainingRegistrationConfirmationDelayInSeconds(email: string): number {
    return this.remainingDelayProvider(email)
  }
}
