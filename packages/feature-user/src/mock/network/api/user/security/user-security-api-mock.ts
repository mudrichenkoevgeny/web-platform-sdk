import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type {
  TotpRecoveryCodesPayload,
  TotpSetupPayload,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { UserSecurityApi } from '@/network/api/user/security/user-security-api'
/**
 * Mock implementation of {@link UserSecurityApi}.
 */
export class UserSecurityApiMock implements UserSecurityApi {
  public setupTotpResult: AppResult<TotpSetupPayload, AppError> = appResultFailure(CommonError.unknown())
  public enableTotpResult: AppResult<TotpRecoveryCodesPayload, AppError> = appResultFailure(CommonError.unknown())
  public disableTotpResult: AppResult<void, AppError> = appResultSuccess(undefined)
  public getRecoveryCodesResult: AppResult<TotpRecoveryCodesPayload, AppError> = appResultFailure(CommonError.unknown())
  public regenerateRecoveryCodesResult: AppResult<TotpRecoveryCodesPayload, AppError> = appResultFailure(CommonError.unknown())

  public lastEnableTotpRequest: VerifyTotpPayload | null = null

  /** Mocks TOTP setup. */
  public async setupTotp(): Promise<AppResult<TotpSetupPayload, AppError>> {
    return this.setupTotpResult
  }

  /** Mocks enabling TOTP. */
  public async enableTotp(request: VerifyTotpPayload): Promise<AppResult<TotpRecoveryCodesPayload, AppError>> {
    this.lastEnableTotpRequest = request
    return this.enableTotpResult
  }

  /** Mocks disabling TOTP. */
  public async disableTotp(): Promise<AppResult<void, AppError>> {
    return this.disableTotpResult
  }

  /** Mocks retrieving recovery codes. */
  public async getRecoveryCodes(): Promise<AppResult<TotpRecoveryCodesPayload, AppError>> {
    return this.getRecoveryCodesResult
  }

  /** Mocks regenerating recovery codes. */
  public async regenerateRecoveryCodes(): Promise<AppResult<TotpRecoveryCodesPayload, AppError>> {
    return this.regenerateRecoveryCodesResult
  }
}
