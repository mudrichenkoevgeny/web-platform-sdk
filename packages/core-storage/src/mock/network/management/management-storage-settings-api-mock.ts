import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type {
  ManagementStorageSettings
} from '@mudrichenkoevgeny/shared-foundation'
import type {
  ManagementStorageSettingsApi,
  UpdateManagementStorageSettingsRequest
} from '../../../network/api/management/management-storage-settings-api'

export class ManagementStorageSettingsApiMock implements ManagementStorageSettingsApi {
  public mockGetSettingsResult?: AppResult<ManagementStorageSettings, AppError>
  public mockUpdateSettingsResult?: AppResult<ManagementStorageSettings, AppError>
  public mockResetSettingsResult?: AppResult<ManagementStorageSettings, AppError>

  public async getSettings(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.mockGetSettingsResult ?? appResultSuccess(createTestManagementStorageSettings())
  }

  public async updateSettings(_request: UpdateManagementStorageSettingsRequest): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.mockUpdateSettingsResult ?? appResultSuccess(createTestManagementStorageSettings())
  }

  public async resetSettings(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.mockResetSettingsResult ?? appResultSuccess(createTestManagementStorageSettings())
  }
}
