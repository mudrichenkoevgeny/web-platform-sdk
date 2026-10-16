import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuthDataPayload,
  LoginByEmailRequest,
  LoginByExternalAuthProviderRequest,
  LoginByPhoneRequest,
  OtpConfirmationPayload,
  SendConfirmationToPhoneRequest,
  UserAuthProvider,
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

  public async loginByEmail(email: string, password: string): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastLoginByEmailRequest = { email, password }
    return this.loginByEmailResult
  }

  public async loginByPhone(phoneNumber: string, confirmationCode: string): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastLoginByPhoneRequest = { phone_number: phoneNumber, confirmation_code: confirmationCode }
    return this.loginByPhoneResult
  }

  public async loginByExternalAuthProvider(
    authProvider: UserAuthProvider,
    externalProviderToken: string
  ): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastLoginByExternalAuthProviderRequest = { auth_provider: authProvider, external_provider_token: externalProviderToken }
    return this.loginByExternalAuthProviderResult
  }

  public async loginByTotp(mfaToken: string, code: string): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastLoginByTotpRequest = { mfa_token: mfaToken, totp_code: code }
    return this.loginByTotpResult
  }

  public async loginByTotpRecoveryCode(mfaToken: string, code: string): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastLoginByTotpRecoveryCodeRequest = { mfa_token: mfaToken, totp_code: code }
    return this.loginByTotpRecoveryCodeResult
  }

  public async sendLoginConfirmationToPhone(
    phoneNumber: string
  ): Promise<AppResult<OtpConfirmationPayload, AppError>> {
    this.lastSendLoginConfirmationToPhoneRequest = { phone_number: phoneNumber }
    return this.sendLoginConfirmationToPhoneResult
  }
}
