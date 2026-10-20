import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestOpenGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenGlobalSettingsRepository } from '@/repository/open-global-settings-repository'
import type { OpenGlobalSettingsObserver } from '@/repository/open-global-settings-repository'
import type { OpenGlobalSettings } from '@/domain/model/open-global-settings'

/**
 * Configuration options for {@link OpenGlobalSettingsRepositoryMock}.
 */
export interface OpenGlobalSettingsRepositoryMockConfig {
  /** Initial settings payload. */
  initialSettings?: OpenGlobalSettings
  /** If true, getter and refresh will return AppError. */
  shouldFailGet?: boolean
}

/**
 * Mock implementation of {@link OpenGlobalSettingsRepository} for testing and Storybook.
 */
export class OpenGlobalSettingsRepositoryMock implements OpenGlobalSettingsRepository {
  public getCallCount = 0
  public refreshCallCount = 0
  public updateCallCount = 0
  private settings: OpenGlobalSettings
  private shouldFailGet: boolean
  private readonly observers = new Set<OpenGlobalSettingsObserver>()

  public constructor(config?: OpenGlobalSettingsRepositoryMockConfig) {
    this.settings = config?.initialSettings ?? createTestOpenGlobalSettings()
    this.shouldFailGet = config?.shouldFailGet ?? false
  }

  public async getOpenGlobalSettings(): Promise<AppResult<OpenGlobalSettings, AppError>> {
    this.getCallCount++
    if (this.shouldFailGet) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess(this.settings)
  }

  public async refreshOpenGlobalSettings(): Promise<AppResult<OpenGlobalSettings, AppError>> {
    this.refreshCallCount++
    if (this.shouldFailGet) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess(this.settings)
  }

  public async updateOpenGlobalSettings(globalSettings: OpenGlobalSettings): Promise<void> {
    this.updateCallCount++
    this.settings = globalSettings
    for (const obs of this.observers) {
      obs(this.settings)
    }
  }

  public observeOpenGlobalSettings(observer: OpenGlobalSettingsObserver): () => void {
    this.observers.add(observer)
    observer(this.settings)
    return () => {
      this.observers.delete(observer)
    }
  }
}
