import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuthDataPayload,
  LoginByEmailRequest,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { SelfManagementLoginApi } from '@/network/api/auth/login/SelfManagementLoginApi'

/** Mock implementation of {@link SelfManagementLoginApi}. */
export class SelfManagementLoginApiMock implements SelfManagementLoginApi {
  public loginByEmailResult: AppResult<AuthDataPayload, AppError> = appResultFailure(CommonError.unknown())
  public loginByTotpResult: AppResult<AuthDataPayload, AppError> = appResultFailure(CommonError.unknown())
  public loginByTotpRecoveryCodeResult: AppResult<AuthDataPayload, AppError> = appResultFailure(CommonError.unknown())

  public lastLoginByEmailRequest: LoginByEmailRequest | null = null
  public lastLoginByTotpRequest: VerifyTotpPayload | null = null
  public lastLoginByTotpRecoveryCodeRequest: VerifyTotpPayload | null = null

  public async loginByEmail(request: LoginByEmailRequest): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastLoginByEmailRequest = request
    return this.loginByEmailResult
  }

  public async loginByTotp(request: VerifyTotpPayload): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastLoginByTotpRequest = request
    return this.loginByTotpResult
  }

  public async loginByTotpRecoveryCode(request: VerifyTotpPayload): Promise<AppResult<AuthDataPayload, AppError>> {
    this.lastLoginByTotpRecoveryCodeRequest = request
    return this.loginByTotpRecoveryCodeResult
  }
}
