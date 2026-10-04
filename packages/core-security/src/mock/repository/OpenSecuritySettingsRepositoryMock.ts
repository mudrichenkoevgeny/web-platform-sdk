import { CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult, AppError } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { OpenSecuritySettingsRepository } from '@/repository/OpenSecuritySettingsRepository'
import type { OpenSecuritySettingsObserver } from "@/repository/OpenSecuritySettingsRepository";
import type { OpenSecuritySettings } from '@/domain/model/OpenSecuritySettings'
import { openSecuritySettingsMock } from '@/domain/model/OpenSecuritySettingsMock'
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
    this.settings = config?.initialSettings ?? openSecuritySettingsMock()
    this.shouldFailGet = config?.shouldFailGet ?? false
  }

  public async getOpenSecuritySettings(): Promise<AppResult<OpenSecuritySettings, AppError>> {
    if (this.shouldFailGet) {
      return { success: false, error: CommonError.unknown() }
    }
    return { success: true, data: this.settings }
  }

  public async refreshOpenSecuritySettings(): Promise<AppResult<OpenSecuritySettings, AppError>> {
    this.refreshCallCount++
    if (this.shouldFailGet) {
      return { success: false, error: CommonError.unknown() }
    }
    return { success: true, data: this.settings }
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
