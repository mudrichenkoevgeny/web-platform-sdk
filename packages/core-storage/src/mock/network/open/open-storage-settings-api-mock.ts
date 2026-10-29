import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestOpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettingsApi } from '../../../network/api/open/open-storage-settings-api'

export class OpenStorageSettingsApiMock implements OpenStorageSettingsApi {
  public mockGetSettingsResult?: AppResult<OpenStorageSettings, AppError>

  public async getSettings(): Promise<AppResult<OpenStorageSettings, AppError>> {
    return this.mockGetSettingsResult ?? appResultSuccess(createTestOpenStorageSettings())
  }
}
