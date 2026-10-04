import { AppError, AppResult, appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { LoginRepository } from '@/repository/auth/login/LoginRepository'
import { AuthData } from '@mudrichenkoevgeny/shared-foundation'
import { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Mock implementation of {@link LoginRepository}.
 */
export class LoginRepositoryMock implements LoginRepository {
  public lastEmail: string | null = null
  public lastPassword: string | null = null
  public lastPhoneNumber: string | null = null
  public lastConfirmationCode: string | null = null
  public lastAuthProvider: UserAuthProvider | null = null
  public lastToken: string | null = null
  public lastMfaToken: string | null = null
  public lastCode: string | null = null

  public authDataResultProvider: () => Promise<AppResult<AuthData, AppError>> = async () =>
    appResultFailure(CommonError.contractViolation(new Error('No mock AuthData provided.')))

  public otpConfirmationResultProvider: () => Promise<AppResult<OtpConfirmation, AppError>> = async () =>
    appResultFailure(CommonError.contractViolation(new Error('No mock OtpConfirmation provided.')))

  public remainingDelayProvider: (phoneNumber: string) => number = () => 0

  public async loginByEmail(email: string, password: string): Promise<AppResult<AuthData, AppError>> {
    this.lastEmail = email
    this.lastPassword = password
    return this.authDataResultProvider()
  }

  public async loginByPhone(phoneNumber: string, confirmationCode: string): Promise<AppResult<AuthData, AppError>> {
    this.lastPhoneNumber = phoneNumber
    this.lastConfirmationCode = confirmationCode
    return this.authDataResultProvider()
  }

  public async loginByExternalAuthProvider(
    authProvider: UserAuthProvider,
    externalProviderToken: string
  ): Promise<AppResult<AuthData, AppError>> {
    this.lastAuthProvider = authProvider
    this.lastToken = externalProviderToken
    return this.authDataResultProvider()
  }

  public async loginByTotp(mfaToken: string, code: string): Promise<AppResult<AuthData, AppError>> {
    this.lastMfaToken = mfaToken
    this.lastCode = code
    return this.authDataResultProvider()
  }

  public async loginByTotpRecoveryCode(mfaToken: string, code: string): Promise<AppResult<AuthData, AppError>> {
    this.lastMfaToken = mfaToken
    this.lastCode = code
    return this.authDataResultProvider()
  }

  public async sendLoginConfirmationToPhone(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>> {
    this.lastPhoneNumber = phoneNumber
    return this.otpConfirmationResultProvider()
  }

  public getRemainingLoginConfirmationDelayInSeconds(phoneNumber: string): number {
    return this.remainingDelayProvider(phoneNumber)
  }
}
