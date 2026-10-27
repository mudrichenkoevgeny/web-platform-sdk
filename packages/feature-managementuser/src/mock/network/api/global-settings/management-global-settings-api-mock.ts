import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGlobalSettingsPayload, OpenGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettingsApi } from '@/network/api/global-settings/management-global-settings-api'

/** Mock implementation of {@link ManagementGlobalSettingsApi}. */
export class ManagementGlobalSettingsApiMock implements ManagementGlobalSettingsApi {
  public openResult: AppResult<OpenGlobalSettingsPayload, AppError> = appResultFailure(CommonError.unknown())
  public getResult: AppResult<ManagementGlobalSettingsPayload, AppError> = appResultFailure(CommonError.unknown())
  public updateResult: AppResult<ManagementGlobalSettingsPayload, AppError> = appResultFailure(CommonError.unknown())
  public resetResult: AppResult<ManagementGlobalSettingsPayload, AppError> = appResultFailure(CommonError.unknown())

  public get getManagementGlobalSettingsResult(): AppResult<ManagementGlobalSettingsPayload, AppError> {
    return this.getResult
  }
  public set getManagementGlobalSettingsResult(val: AppResult<ManagementGlobalSettingsPayload, AppError>) {
    this.getResult = val
  }
  public get updateManagementGlobalSettingsResult(): AppResult<ManagementGlobalSettingsPayload, AppError> {
    return this.updateResult
  }
  public set updateManagementGlobalSettingsResult(val: AppResult<ManagementGlobalSettingsPayload, AppError>) {
    this.updateResult = val
  }
  public get resetManagementGlobalSettingsResult(): AppResult<ManagementGlobalSettingsPayload, AppError> {
    return this.resetResult
  }
  public set resetManagementGlobalSettingsResult(val: AppResult<ManagementGlobalSettingsPayload, AppError>) {
    this.resetResult = val
  }

  public async getOpenGlobalSettings(): Promise<AppResult<OpenGlobalSettingsPayload, AppError>> {
    return this.openResult
  }

  public async getManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettingsPayload, AppError>> {
    return this.getResult
  }

  public async updateManagementGlobalSettings(
    _request: ManagementGlobalSettingsPayload
  ): Promise<AppResult<ManagementGlobalSettingsPayload, AppError>> {
    return this.updateResult
  }

  public async resetManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettingsPayload, AppError>> {
    return this.resetResult
  }
}
