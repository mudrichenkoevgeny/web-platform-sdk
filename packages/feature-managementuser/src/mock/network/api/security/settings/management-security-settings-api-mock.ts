import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettingsPayload, OpenSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettingsApi } from '@/network/api/security/settings/management-security-settings-api'

/** Mock implementation of {@link ManagementSecuritySettingsApi}. */
export class ManagementSecuritySettingsApiMock implements ManagementSecuritySettingsApi {
  public openResult: AppResult<OpenSecuritySettingsPayload, AppError> = appResultFailure(CommonError.unknown())
  public getResult: AppResult<ManagementSecuritySettingsPayload, AppError> = appResultFailure(CommonError.unknown())
  public updateResult: AppResult<ManagementSecuritySettingsPayload, AppError> = appResultFailure(CommonError.unknown())
  public resetResult: AppResult<ManagementSecuritySettingsPayload, AppError> = appResultFailure(CommonError.unknown())

  public get getManagementSecuritySettingsResult() {
    return this.getResult
  }
  public set getManagementSecuritySettingsResult(val: AppResult<ManagementSecuritySettingsPayload, AppError>) {
    this.getResult = val
  }
  public get updateManagementSecuritySettingsResult() {
    return this.updateResult
  }
  public set updateManagementSecuritySettingsResult(val: AppResult<ManagementSecuritySettingsPayload, AppError>) {
    this.updateResult = val
  }
  public get resetManagementSecuritySettingsResult() {
    return this.resetResult
  }
  public set resetManagementSecuritySettingsResult(val: AppResult<ManagementSecuritySettingsPayload, AppError>) {
    this.resetResult = val
  }

  public async getOpenSecuritySettings(): Promise<AppResult<OpenSecuritySettingsPayload, AppError>> {
    return this.openResult
  }

  public async getManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettingsPayload, AppError>> {
    return this.getResult
  }

  public async updateManagementSecuritySettings(
    _request: ManagementSecuritySettingsPayload
  ): Promise<AppResult<ManagementSecuritySettingsPayload, AppError>> {
    return this.updateResult
  }

  public async resetManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettingsPayload, AppError>> {
    return this.resetResult
  }
}
