import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettingsRepository } from '@/repository/global-settings/management-global-settings-repository'

/** Mock implementation of {@link ManagementGlobalSettingsRepository}. */
export class ManagementGlobalSettingsRepositoryMock implements ManagementGlobalSettingsRepository {
  private settings: ManagementGlobalSettings | null = null
  private readonly listeners = new Set<(settings: ManagementGlobalSettings | null) => void>()

  public getManagementGlobalSettingsResult: AppResult<ManagementGlobalSettings, AppError> | null = null
  public refreshManagementGlobalSettingsResult: AppResult<ManagementGlobalSettings, AppError> | null = null
  public saveRemoteGlobalSettingsResult: AppResult<void, AppError> | null = null
  public resetRemoteGlobalSettingsResult: AppResult<ManagementGlobalSettings, AppError> | null = null

  public constructor(initialSettings?: ManagementGlobalSettings | null) {
    if (initialSettings) {
      this.settings = initialSettings
    }
  }

  public async getManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettings, AppError>> {
    if (this.getManagementGlobalSettingsResult) {
      return this.getManagementGlobalSettingsResult
    }
    if (this.settings) {
      return appResultSuccess(this.settings)
    }
    return appResultSuccess({} as ManagementGlobalSettings)
  }

  public async saveRemoteManagementGlobalSettings(
    globalSettings: ManagementGlobalSettings
  ): Promise<AppResult<void, AppError>> {
    if (this.saveRemoteGlobalSettingsResult) {
      return this.saveRemoteGlobalSettingsResult
    }
    this.settings = globalSettings
    this.notifyListeners()
    return appResultSuccess(undefined)
  }

  public async refreshManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettings, AppError>> {
    if (this.refreshManagementGlobalSettingsResult) {
      return this.refreshManagementGlobalSettingsResult
    }
    return this.getManagementGlobalSettings()
  }

  public async updateManagementGlobalSettings(globalSettings: ManagementGlobalSettings): Promise<void> {
    this.settings = globalSettings
    this.notifyListeners()
  }

  public async resetRemoteManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettings, AppError>> {
    if (this.resetRemoteGlobalSettingsResult) {
      return this.resetRemoteGlobalSettingsResult
    }
    return this.getManagementGlobalSettings()
  }

  public observeManagementGlobalSettings(listener: (settings: ManagementGlobalSettings | null) => void): () => void {
    this.listeners.add(listener)
    listener(this.settings)
    return () => {
      this.listeners.delete(listener)
    }
  }

  public emit(settings: ManagementGlobalSettings | null): void {
    this.settings = settings
    this.notifyListeners()
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.settings)
    }
  }
}
