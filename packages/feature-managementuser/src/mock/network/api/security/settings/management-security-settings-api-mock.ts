import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettingsApi } from '@/network/api/security/settings/ManagementSecuritySettingsApi'

/** Mock implementation of {@link ManagementSecuritySettingsApi}. */
export class ManagementSecuritySettingsApiMock implements ManagementSecuritySettingsApi {
  public getResult: AppResult<ManagementSecuritySettingsPayload, AppError> = appResultFailure(CommonError.unknown())
  public updateResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())
  public resetResult: AppResult<ManagementSecuritySettingsPayload, AppError> = appResultFailure(CommonError.unknown())

  public async getManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettingsPayload, AppError>> {
    return this.getResult
  }

  public async updateManagementSecuritySettings(
    _request: ManagementSecuritySettingsPayload
  ): Promise<AppResult<void, AppError>> {
    return this.updateResult
  }

  public async resetManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettingsPayload, AppError>> {
    return this.resetResult
  }
}
