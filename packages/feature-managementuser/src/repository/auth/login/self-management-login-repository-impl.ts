import { appResultFailure, CommonError, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AuthData, OtpConfirmation, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { toAuthData } from '@mudrichenkoevgeny/shared-foundation'
import type { LoginRepository } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { SelfManagementLoginApi } from '@/network/api/auth/login/self-management-login-api'

/**
 * Implements {@link LoginRepository} using {@link SelfManagementLoginApi}.
 */
export class SelfManagementLoginRepositoryImpl implements LoginRepository {
  /**
   * Constructs a new {@link SelfManagementLoginRepositoryImpl}.
   *
   * @param selfManagementLoginApi - HTTP endpoints for management user login
   */
  public constructor(private readonly selfManagementLoginApi: SelfManagementLoginApi) {}

  public async loginByEmail(email: string, password: string): Promise<AppResult<AuthData, AppError>> {
    const result = await this.selfManagementLoginApi.loginByEmail({ email, password })
    return mapSuccess(result, (authDataPayload) => toAuthData(authDataPayload))
  }

  public async loginByPhone(
    _phoneNumber: string,
    _confirmationCode: string
  ): Promise<AppResult<AuthData, AppError>> {
    return this.methodNotSupported()
  }

  public async loginByExternalAuthProvider(
    _authProvider: UserAuthProvider,
    _externalProviderToken: string
  ): Promise<AppResult<AuthData, AppError>> {
    return this.methodNotSupported()
  }

  public async loginByTotp(mfaToken: string, code: string): Promise<AppResult<AuthData, AppError>> {
    const result = await this.selfManagementLoginApi.loginByTotp({
      mfa_token: mfaToken,
      totp_code: code
    })
    return mapSuccess(result, (authDataPayload) => toAuthData(authDataPayload))
  }

  public async loginByTotpRecoveryCode(mfaToken: string, code: string): Promise<AppResult<AuthData, AppError>> {
    const result = await this.selfManagementLoginApi.loginByTotpRecoveryCode({
      mfa_token: mfaToken,
      totp_code: code
    })
    return mapSuccess(result, (authDataPayload) => toAuthData(authDataPayload))
  }

  public async sendLoginConfirmationToPhone(_phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>> {
    return this.methodNotSupported()
  }

  public getRemainingLoginConfirmationDelayInSeconds(_phoneNumber: string): number {
    return 0
  }

  private methodNotSupported<T>(): AppResult<T, AppError> {
    return appResultFailure(
      CommonError.contractViolation(
        new Error('This authentication method is not supported in management context.')
      )
    )
  }
}
