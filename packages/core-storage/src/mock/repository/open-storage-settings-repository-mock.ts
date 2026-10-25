import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettingsRepository, OpenStorageSettingsObserver } from '../../repository/storage-settings/open-storage-settings-repository'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import { createTestOpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'

export class OpenStorageSettingsRepositoryMock implements OpenStorageSettingsRepository {
  public getOpenStorageSettingsCallCount = 0
  public refreshOpenStorageSettingsCallCount = 0
  public currentSettings: OpenStorageSettings | null
  private readonly observers = new Set<OpenStorageSettingsObserver>()

  public constructor(
    initialSettings?: OpenStorageSettings | null,
    private readonly shouldFailGet: boolean = false,
    private readonly shouldFailRefresh: boolean = false
  ) {
    this.currentSettings = initialSettings !== undefined ? initialSettings : createTestOpenStorageSettings()
  }

  public async getOpenStorageSettings(): Promise<AppResult<OpenStorageSettings, AppError>> {
    this.getOpenStorageSettingsCallCount++
    if (this.shouldFailGet || !this.currentSettings) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess(this.currentSettings)
  }

  public async refreshOpenStorageSettings(): Promise<AppResult<OpenStorageSettings, AppError>> {
    this.refreshOpenStorageSettingsCallCount++
    if (this.shouldFailRefresh || !this.currentSettings) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess(this.currentSettings)
  }

  public async updateOpenStorageSettings(storageSettings: OpenStorageSettings): Promise<void> {
    this.currentSettings = storageSettings
    for (const observer of this.observers) {
      observer(storageSettings)
    }
  }

  public observeOpenStorageSettings(observer: OpenStorageSettingsObserver): () => void {
    this.observers.add(observer)
    observer(this.currentSettings)
    return () => {
      this.observers.delete(observer)
    }
  }
}
