import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettingsRepository } from '@/repository/global-settings/management-global-settings-repository'

/** Mock implementation of {@link ManagementGlobalSettingsRepository}. */
export class ManagementGlobalSettingsRepositoryMock implements ManagementGlobalSettingsRepository {
  private settings: ManagementGlobalSettings
  private readonly listeners = new Set<(settings: ManagementGlobalSettings | null) => void>()

  public resultProvider: () => Promise<AppResult<ManagementGlobalSettings, AppError>> = async () =>
    appResultSuccess(this.settings)

  public saveResultProvider: (globalSettings: ManagementGlobalSettings) => Promise<AppResult<ManagementGlobalSettings, AppError>> = async (globalSettings) =>
    appResultSuccess(globalSettings)

  public resetResultProvider: () => Promise<AppResult<ManagementGlobalSettings, AppError>> = async () =>
    this.resultProvider()

  public constructor(initialSettings?: ManagementGlobalSettings | null) {
    this.settings = initialSettings ?? createTestManagementGlobalSettings()
  }

  public async getManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettings, AppError>> {
    return this.resultProvider()
  }

  public async saveRemoteManagementGlobalSettings(
    globalSettings: ManagementGlobalSettings
  ): Promise<AppResult<ManagementGlobalSettings, AppError>> {
    const result = await this.saveResultProvider(globalSettings)
    if (result.success) {
      this.settings = result.data
      this.notifyListeners()
    }
    return result
  }

  public async refreshManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettings, AppError>> {
    return this.resultProvider()
  }

  public async updateManagementGlobalSettings(globalSettings: ManagementGlobalSettings): Promise<void> {
    this.settings = globalSettings
    this.notifyListeners()
  }

  public async resetRemoteManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettings, AppError>> {
    const result = await this.resetResultProvider()
    if (result.success) {
      this.settings = result.data
      this.notifyListeners()
    }
    return result
  }

  public observeManagementGlobalSettings(listener: (settings: ManagementGlobalSettings | null) => void): () => void {
    this.listeners.add(listener)
    listener(this.settings)
    return () => {
      this.listeners.delete(listener)
    }
  }

  public emit(settings: ManagementGlobalSettings): void {
    this.settings = settings
    this.notifyListeners()
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.settings)
    }
  }
}
