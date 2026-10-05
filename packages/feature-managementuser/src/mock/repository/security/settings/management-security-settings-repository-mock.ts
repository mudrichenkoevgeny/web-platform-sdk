import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettingsRepository } from '@/repository/security/settings/management-security-settings-repository'

/** Mock implementation of {@link ManagementSecuritySettingsRepository}. */
export class ManagementSecuritySettingsRepositoryMock implements ManagementSecuritySettingsRepository {
  private settings: ManagementSecuritySettings | null = null
  private readonly listeners = new Set<(settings: ManagementSecuritySettings | null) => void>()

  public getManagementSecuritySettingsResult: AppResult<ManagementSecuritySettings, AppError> | null = null
  public refreshManagementSecuritySettingsResult: AppResult<ManagementSecuritySettings, AppError> | null = null
  public saveRemoteSecuritySettingsResult: AppResult<void, AppError> | null = null
  public resetRemoteSecuritySettingsResult: AppResult<ManagementSecuritySettings, AppError> | null = null

  public constructor(initialSettings?: ManagementSecuritySettings | null) {
    if (initialSettings) {
      this.settings = initialSettings
    }
  }

  public async getManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettings, AppError>> {
    if (this.getManagementSecuritySettingsResult) {
      return this.getManagementSecuritySettingsResult
    }
    if (this.settings) {
      return appResultSuccess(this.settings)
    }
    return appResultSuccess({} as ManagementSecuritySettings)
  }

  public async saveRemoteManagementSecuritySettings(
    securitySettings: ManagementSecuritySettings
  ): Promise<AppResult<void, AppError>> {
    if (this.saveRemoteSecuritySettingsResult) {
      return this.saveRemoteSecuritySettingsResult
    }
    this.settings = securitySettings
    this.notifyListeners()
    return appResultSuccess(undefined)
  }

  public async refreshManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettings, AppError>> {
    if (this.refreshManagementSecuritySettingsResult) {
      return this.refreshManagementSecuritySettingsResult
    }
    return this.getManagementSecuritySettings()
  }

  public async updateManagementSecuritySettings(securitySettings: ManagementSecuritySettings): Promise<void> {
    this.settings = securitySettings
    this.notifyListeners()
  }

  public async resetRemoteManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettings, AppError>> {
    if (this.resetRemoteSecuritySettingsResult) {
      return this.resetRemoteSecuritySettingsResult
    }
    return this.getManagementSecuritySettings()
  }

  public observeManagementSecuritySettings(
    listener: (settings: ManagementSecuritySettings | null) => void
  ): () => void {
    this.listeners.add(listener)
    listener(this.settings)
    return () => {
      this.listeners.delete(listener)
    }
  }

  public emit(settings: ManagementSecuritySettings | null): void {
    this.settings = settings
    this.notifyListeners()
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.settings)
    }
  }
}
