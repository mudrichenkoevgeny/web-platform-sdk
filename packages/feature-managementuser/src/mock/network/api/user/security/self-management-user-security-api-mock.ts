import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  TotpRecoveryCodesPayload,
  TotpSetupPayload,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { UserSecurityApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/** Mock implementation of {@link UserSecurityApi} for self management. */
export class SelfManagementUserSecurityApiMock implements UserSecurityApi {
  public setupTotpResult: AppResult<TotpSetupPayload, AppError> = appResultFailure(CommonError.unknown())
  public enableTotpResult: AppResult<TotpRecoveryCodesPayload, AppError> = appResultFailure(CommonError.unknown())
  public disableTotpResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())
  public getRecoveryCodesResult: AppResult<TotpRecoveryCodesPayload, AppError> = appResultFailure(CommonError.unknown())
  public regenerateRecoveryCodesResult: AppResult<TotpRecoveryCodesPayload, AppError> = appResultFailure(CommonError.unknown())

  public async setupTotp(): Promise<AppResult<TotpSetupPayload, AppError>> {
    return this.setupTotpResult
  }

  public async enableTotp(_request: VerifyTotpPayload): Promise<AppResult<TotpRecoveryCodesPayload, AppError>> {
    return this.enableTotpResult
  }

  public async disableTotp(): Promise<AppResult<void, AppError>> {
    return this.disableTotpResult
  }

  public async getRecoveryCodes(): Promise<AppResult<TotpRecoveryCodesPayload, AppError>> {
    return this.getRecoveryCodesResult
  }

  public async regenerateRecoveryCodes(): Promise<AppResult<TotpRecoveryCodesPayload, AppError>> {
    return this.regenerateRecoveryCodesResult
  }
}
