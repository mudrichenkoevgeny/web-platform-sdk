import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuthDataPayload,
  LoginByEmailRequest,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { SelfManagementLoginApi } from '@/network/api/auth/login/self-management-login-api'

/** Mock implementation of {@link SelfManagementLoginApi}. */
export class SelfManagementLoginApiMock implements SelfManagementLoginApi {
  public loginByEmailResult: AppResult<AuthDataPayload, AppError> = appResultFailure(CommonError.unknown())
  public loginByTotpResult: AppResult<AuthDataPayload, AppError> = appResultFailure(CommonError.unknown())
  public loginByTotpRecoveryCodeResult: AppResult<AuthDataPayload, AppError> = appResultFailure(CommonError.unknown())

  public lastLoginByEmailRequest: LoginByEmailRequest | null = null
  public lastLoginByTotpRequest: VerifyTotpPayload | null = null
  public lastLoginByTotpRecoveryCodeRequest: VerifyTotpPayload | null = null

  public async loginByEmail(email: string, password: string): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastLoginByEmailRequest = { email, password }
    return this.loginByEmailResult
  }

  public async loginByTotp(mfaToken: string, code: string): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastLoginByTotpRequest = { mfa_token: mfaToken, totp_code: code }
    return this.loginByTotpResult
  }

  public async loginByTotpRecoveryCode(mfaToken: string, code: string): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastLoginByTotpRecoveryCodeRequest = { mfa_token: mfaToken, totp_code: code }
    return this.loginByTotpRecoveryCodeResult
  }
}
