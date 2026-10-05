import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuthDataPayload,
  LoginByEmailRequest,
  LoginByExternalAuthProviderRequest,
  LoginByPhoneRequest,
  OtpConfirmationPayload,
  SendConfirmationToPhoneRequest,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { OpenLoginApi } from '@/network/api/auth/login/open-login-api'

/**
 * Mock implementation of {@link OpenLoginApi}.
 */
export class OpenLoginApiMock implements OpenLoginApi {
  public loginByEmailResult: AppResult<AuthDataPayload, AppError> = appResultFailure(CommonError.unknown())
  public loginByPhoneResult: AppResult<AuthDataPayload, AppError> = appResultFailure(CommonError.unknown())
  public loginByExternalAuthProviderResult: AppResult<AuthDataPayload, AppError> = appResultFailure(CommonError.unknown())
  public loginByTotpResult: AppResult<AuthDataPayload, AppError> = appResultFailure(CommonError.unknown())
  public loginByTotpRecoveryCodeResult: AppResult<AuthDataPayload, AppError> = appResultFailure(CommonError.unknown())
  public sendLoginConfirmationToPhoneResult: AppResult<OtpConfirmationPayload, AppError> = appResultFailure(CommonError.unknown())

  public lastLoginByEmailRequest: LoginByEmailRequest | null = null
  public lastLoginByPhoneRequest: LoginByPhoneRequest | null = null
  public lastLoginByExternalAuthProviderRequest: LoginByExternalAuthProviderRequest | null = null
  public lastLoginByTotpRequest: VerifyTotpPayload | null = null
  public lastLoginByTotpRecoveryCodeRequest: VerifyTotpPayload | null = null
  public lastSendLoginConfirmationToPhoneRequest: SendConfirmationToPhoneRequest | null = null

  public async loginByEmail(request: LoginByEmailRequest): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastLoginByEmailRequest = request
    return this.loginByEmailResult
  }

  public async loginByPhone(request: LoginByPhoneRequest): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastLoginByPhoneRequest = request
    return this.loginByPhoneResult
  }

  public async loginByExternalAuthProvider(
    request: LoginByExternalAuthProviderRequest
  ): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastLoginByExternalAuthProviderRequest = request
    return this.loginByExternalAuthProviderResult
  }

  public async loginByTotp(request: VerifyTotpPayload): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastLoginByTotpRequest = request
    return this.loginByTotpResult
  }

  public async loginByTotpRecoveryCode(request: VerifyTotpPayload): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastLoginByTotpRecoveryCodeRequest = request
    return this.loginByTotpRecoveryCodeResult
  }

  public async sendLoginConfirmationToPhone(
    request: SendConfirmationToPhoneRequest
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    this.lastSendLoginConfirmationToPhoneRequest = request
    return this.sendLoginConfirmationToPhoneResult
  }
}
