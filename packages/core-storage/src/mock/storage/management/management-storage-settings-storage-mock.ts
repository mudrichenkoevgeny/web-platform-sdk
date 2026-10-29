import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsStorage } from '../../../storage/management/management-storage-settings-storage'

export class ManagementStorageSettingsStorageMock implements ManagementStorageSettingsStorage {
  public mockGetSettingsResult?: AppResult<ManagementStorageSettings | null, AppError>

  public async getSettings(): Promise<AppResult<ManagementStorageSettings | null, AppError>> {
    return this.mockGetSettingsResult ?? appResultSuccess(null)
  }

  public async saveSettings(_settings: ManagementStorageSettings): Promise<AppResult<void, AppError>> {
    return appResultSuccess(undefined)
  }

  public async clearSettings(): Promise<AppResult<void, AppError>> {
    return appResultSuccess(undefined)
  }
}
