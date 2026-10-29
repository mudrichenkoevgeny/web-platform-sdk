import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettingsStorage } from '../../../storage/open/open-storage-settings-storage'

export class OpenStorageSettingsStorageMock implements OpenStorageSettingsStorage {
  public mockGetSettingsResult?: AppResult<OpenStorageSettings | null, AppError>

  public async getSettings(): Promise<AppResult<OpenStorageSettings | null, AppError>> {
    return this.mockGetSettingsResult ?? appResultSuccess(null)
  }

  public async saveSettings(_settings: OpenStorageSettings): Promise<AppResult<void, AppError>> {
    return appResultSuccess(undefined)
  }

  public async clearSettings(): Promise<AppResult<void, AppError>> {
    return appResultSuccess(undefined)
  }
}
