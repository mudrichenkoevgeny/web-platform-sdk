import type { ManagementStorageSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { createTestManagementStorageSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettingsApi } from '@/network/api/storage/settings/management-storage-settings-api'

export class ManagementStorageSettingsApiMock implements ManagementStorageSettingsApi {
  public getSettingsCallCount = 0
  public updateSettingsCallCount = 0
  public resetSettingsCallCount = 0

  public constructor(
    private readonly mockPayload?: ManagementStorageSettingsPayload,
    private readonly shouldFail: boolean = false
  ) {}

  public async getManagementStorageSettings(): Promise<AppResult<ManagementStorageSettingsPayload, AppError>> {
    this.getSettingsCallCount++
    if (this.shouldFail) {
      return appResultFailure(CommonError.unknown())
    }
    const payload = this.mockPayload ?? createTestManagementStorageSettingsPayload()
    return appResultSuccess(payload)
  }

  public async updateManagementStorageSettings(
    settings: ManagementStorageSettingsPayload
  ): Promise<AppResult<ManagementStorageSettingsPayload, AppError>> {
    this.updateSettingsCallCount++
    if (this.shouldFail) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess(settings)
  }

  public async resetManagementStorageSettings(): Promise<AppResult<ManagementStorageSettingsPayload, AppError>> {
    this.resetSettingsCallCount++
    if (this.shouldFail) {
      return appResultFailure(CommonError.unknown())
    }
    const payload = this.mockPayload ?? createTestManagementStorageSettingsPayload()
    return appResultSuccess(payload)
  }
}
