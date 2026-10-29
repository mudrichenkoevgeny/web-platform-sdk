import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type {
  ManagementStorageSettings
} from '@mudrichenkoevgeny/shared-foundation'
import type {
  UpdateManagementStorageSettingsRequest
} from '../../../network/api/management/management-storage-settings-api'
import type {
  ManagementStorageSettingsObserver,
  ManagementStorageSettingsRepository
} from '../../../repository/management/management-storage-settings-repository'

export class ManagementStorageSettingsRepositoryMock implements ManagementStorageSettingsRepository {
  public mockGetSettingsResult?: AppResult<ManagementStorageSettings, AppError>
  public mockRefreshSettingsResult?: AppResult<ManagementStorageSettings, AppError>
  public mockUpdateSettingsResult?: AppResult<ManagementStorageSettings, AppError>
  public mockResetSettingsResult?: AppResult<ManagementStorageSettings, AppError>

  public async getSettings(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.mockGetSettingsResult ?? appResultSuccess(createTestManagementStorageSettings())
  }

  public async refreshSettings(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.mockRefreshSettingsResult ?? appResultSuccess(createTestManagementStorageSettings())
  }

  public async updateSettings(_request: UpdateManagementStorageSettingsRequest): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.mockUpdateSettingsResult ?? appResultSuccess(createTestManagementStorageSettings())
  }

  public async resetSettings(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.mockResetSettingsResult ?? appResultSuccess(createTestManagementStorageSettings())
  }

  public observeSettings(_observer: ManagementStorageSettingsObserver): () => void {
    return () => {}
  }
}
