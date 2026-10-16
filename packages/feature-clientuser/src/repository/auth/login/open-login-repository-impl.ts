import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AuthData, OtpConfirmation, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { ConfirmationType, toAuthData, toOtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import type { ConfirmationRepository, LoginRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenLoginApi } from '@/network/api/auth/login/open-login-api'

/**
 * Implements {@link LoginRepository} using {@link OpenLoginApi} and {@link ConfirmationRepository} for throttled phone confirmation sends.
 */
export class OpenLoginRepositoryImpl implements LoginRepository {
  /**
   * Constructs a new {@link OpenLoginRepositoryImpl}.
   *
   * @param openLoginApi - HTTP endpoints for login variants
   * @param confirmationRepository - Client-side cooldown manager
   */
  public constructor(
    private readonly openLoginApi: OpenLoginApi,
    private readonly confirmationRepository: ConfirmationRepository
  ) {}

  public async loginByEmail(email: string, password: string): Promise<AppResult<AuthData, AppError>> {
    const result = await this.openLoginApi.loginByEmail(email, password)
    return mapSuccess(result, (authDataPayload) => toAuthData(authDataPayload))
  }

  public async loginByPhone(phoneNumber: string, confirmationCode: string): Promise<AppResult<AuthData, AppError>> {
    const result = await this.openLoginApi.loginByPhone(phoneNumber, confirmationCode)
    return mapSuccess(result, (authDataPayload) => toAuthData(authDataPayload))
  }

  public async loginByExternalAuthProvider(
    authProvider: UserAuthProvider,
    externalProviderToken: string
  ): Promise<AppResult<AuthData, AppError>> {
    const result = await this.openLoginApi.loginByExternalAuthProvider(authProvider, externalProviderToken)
    return mapSuccess(result, (authDataPayload) => toAuthData(authDataPayload))
  }

  public async loginByTotp(mfaToken: string, code: string): Promise<AppResult<AuthData, AppError>> {
    const result = await this.openLoginApi.loginByTotp(mfaToken, code)
    return mapSuccess(result, (authDataPayload) => toAuthData(authDataPayload))
  }

  public async loginByTotpRecoveryCode(mfaToken: string, code: string): Promise<AppResult<AuthData, AppError>> {
    const result = await this.openLoginApi.loginByTotpRecoveryCode(mfaToken, code)
    return mapSuccess(result, (authDataPayload) => toAuthData(authDataPayload))
  }

  public async sendLoginConfirmationToPhone(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.confirmationRepository.executeWithTimer(
      ConfirmationType.LOGIN_PHONE,
      phoneNumber,
      async () => {
        const result = await this.openLoginApi.sendLoginConfirmationToPhone(phoneNumber)
        return mapSuccess(result, (response) => toOtpConfirmation(response))
      }
    )
  }

  public getRemainingLoginConfirmationDelayInSeconds(phoneNumber: string): number {
    return this.confirmationRepository.getRemainingDelay(ConfirmationType.LOGIN_PHONE, phoneNumber)
  }
}
