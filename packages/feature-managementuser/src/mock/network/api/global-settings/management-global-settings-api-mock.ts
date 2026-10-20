import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettingsApi } from '@/network/api/global-settings/management-global-settings-api'

/** Mock implementation of {@link ManagementGlobalSettingsApi}. */
export class ManagementGlobalSettingsApiMock implements ManagementGlobalSettingsApi {
  public getResult: AppResult<ManagementGlobalSettingsPayload, AppError> = appResultFailure(CommonError.unknown())
  public updateResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())
  public resetResult: AppResult<ManagementGlobalSettingsPayload, AppError> = appResultFailure(CommonError.unknown())

  public get getManagementGlobalSettingsResult() {
    return this.getResult
  }
  public set getManagementGlobalSettingsResult(val: AppResult<ManagementGlobalSettingsPayload, AppError>) {
    this.getResult = val
  }
  public get updateManagementGlobalSettingsResult() {
    return this.updateResult
  }
  public set updateManagementGlobalSettingsResult(val: AppResult<void, AppError>) {
    this.updateResult = val
  }
  public get resetManagementGlobalSettingsResult() {
    return this.resetResult
  }
  public set resetManagementGlobalSettingsResult(val: AppResult<ManagementGlobalSettingsPayload, AppError>) {
    this.resetResult = val
  }

  public async getManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettingsPayload, AppError>> {
    return this.getResult
  }

  public async updateManagementGlobalSettings(
    _request: ManagementGlobalSettingsPayload
  ): Promise<AppResult<void, AppError>> {
    return this.updateResult
  }

  public async resetManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettingsPayload, AppError>> {
    return this.resetResult
  }
}
