import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestOpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type {
  OpenStorageSettingsObserver,
  OpenStorageSettingsRepository
} from '../../../repository/open/open-storage-settings-repository'

export class OpenStorageSettingsRepositoryMock implements OpenStorageSettingsRepository {
  public mockGetSettingsResult?: AppResult<OpenStorageSettings, AppError>
  public mockRefreshSettingsResult?: AppResult<OpenStorageSettings, AppError>

  public async getSettings(): Promise<AppResult<OpenStorageSettings, AppError>> {
    return this.mockGetSettingsResult ?? appResultSuccess(createTestOpenStorageSettings())
  }

  public async refreshSettings(): Promise<AppResult<OpenStorageSettings, AppError>> {
    return this.mockRefreshSettingsResult ?? appResultSuccess(createTestOpenStorageSettings())
  }

  public async updateOpenStorageSettings(_settings: OpenStorageSettings): Promise<void> {}

  public observeOpenStorageSettings(_observer: OpenStorageSettingsObserver): () => void {
    return () => {}
  }
}
