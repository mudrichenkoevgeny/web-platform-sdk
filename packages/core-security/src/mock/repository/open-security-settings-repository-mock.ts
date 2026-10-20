import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestOpenSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenSecuritySettingsRepository } from '@/repository/open-security-settings-repository'
import type { OpenSecuritySettingsObserver } from '@/repository/open-security-settings-repository'
import { toOpenSecuritySettings, type OpenSecuritySettings } from '@/domain/model/open-security-settings'

/**
 * Configuration options for {@link OpenSecuritySettingsRepositoryMock}.
 */
export interface OpenSecuritySettingsRepositoryMockConfig {
  /** Initial settings payload. */
  initialSettings?: OpenSecuritySettings
  /** If true, getter and refresh will return AppError. */
  shouldFailGet?: boolean
}

/**
 * Mock implementation of {@link OpenSecuritySettingsRepository} for testing and Storybook.
 */
export class OpenSecuritySettingsRepositoryMock implements OpenSecuritySettingsRepository {
  public refreshCallCount = 0
  public updateCallCount = 0
  private settings: OpenSecuritySettings
  private shouldFailGet: boolean
  private readonly observers = new Set<OpenSecuritySettingsObserver>()

  public constructor(config?: OpenSecuritySettingsRepositoryMockConfig) {
    this.settings = config?.initialSettings ?? toOpenSecuritySettings(createTestOpenSecuritySettingsPayload())
    this.shouldFailGet = config?.shouldFailGet ?? false
  }

  public async getOpenSecuritySettings(): Promise<AppResult<OpenSecuritySettings, AppError>> {
    if (this.shouldFailGet) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess(this.settings)
  }

  public async refreshOpenSecuritySettings(): Promise<AppResult<OpenSecuritySettings, AppError>> {
    this.refreshCallCount++
    if (this.shouldFailGet) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess(this.settings)
  }

  public async updateOpenSecuritySettings(securitySettings: OpenSecuritySettings): Promise<void> {
    this.updateCallCount++
    this.settings = securitySettings
    for (const obs of this.observers) {
      obs(this.settings)
    }
  }

  public observeOpenSecuritySettings(observer: OpenSecuritySettingsObserver): () => void {
    this.observers.add(observer)
    observer(this.settings)
    return () => {
      this.observers.delete(observer)
    }
  }
}
