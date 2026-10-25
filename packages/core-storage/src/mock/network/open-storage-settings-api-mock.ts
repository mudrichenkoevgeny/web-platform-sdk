import type { OpenStorageSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { createTestOpenStorageSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettingsApi } from '../../network/api/storage-settings/open-storage-settings-api'

export class OpenStorageSettingsApiMock implements OpenStorageSettingsApi {
  public getOpenStorageSettingsCallCount = 0

  public constructor(
    private readonly mockPayload?: OpenStorageSettingsPayload,
    private readonly shouldFail: boolean = false
  ) {}

  public async getOpenStorageSettings(): Promise<AppResult<OpenStorageSettingsPayload, AppError>> {
    this.getOpenStorageSettingsCallCount++

    if (this.shouldFail) {
      return appResultFailure(CommonError.unknown())
    }

    const payload = this.mockPayload ?? createTestOpenStorageSettingsPayload()
    return appResultSuccess(payload)
  }
}
