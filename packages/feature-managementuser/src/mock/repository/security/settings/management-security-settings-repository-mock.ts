import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementSecuritySettingsPayload, toManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettingsRepository } from '@/repository/security/settings/management-security-settings-repository'

/** Mock implementation of {@link ManagementSecuritySettingsRepository}. */
export class ManagementSecuritySettingsRepositoryMock implements ManagementSecuritySettingsRepository {
  private settings: ManagementSecuritySettings
  private readonly listeners = new Set<(settings: ManagementSecuritySettings | null) => void>()

  public resultProvider: () => Promise<AppResult<ManagementSecuritySettings, AppError>> = async () =>
    appResultSuccess(this.settings)

  public saveResultProvider: (securitySettings: ManagementSecuritySettings) => Promise<AppResult<ManagementSecuritySettings, AppError>> = async (securitySettings) =>
    appResultSuccess(securitySettings)

  public resetResultProvider: () => Promise<AppResult<ManagementSecuritySettings, AppError>> = async () =>
    this.resultProvider()

  public constructor(initialSettings?: ManagementSecuritySettings | null) {
    this.settings = initialSettings ?? toManagementSecuritySettings(createTestManagementSecuritySettingsPayload())
  }

  public async getManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettings, AppError>> {
    return this.resultProvider()
  }

  public async saveRemoteManagementSecuritySettings(
    securitySettings: ManagementSecuritySettings
  ): Promise<AppResult<ManagementSecuritySettings, AppError>> {
    const result = await this.saveResultProvider(securitySettings)
    if (result.success) {
      this.settings = result.data
      this.notifyListeners()
    }
    return result
  }

  public async refreshManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettings, AppError>> {
    return this.resultProvider()
  }

  public async updateManagementSecuritySettings(securitySettings: ManagementSecuritySettings): Promise<void> {
    this.settings = securitySettings
    this.notifyListeners()
  }

  public async resetRemoteManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettings, AppError>> {
    const result = await this.resetResultProvider()
    if (result.success) {
      this.settings = result.data
      this.notifyListeners()
    }
    return result
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

  public emit(settings: ManagementSecuritySettings): void {
    this.settings = settings
    this.notifyListeners()
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.settings)
    }
  }
}
