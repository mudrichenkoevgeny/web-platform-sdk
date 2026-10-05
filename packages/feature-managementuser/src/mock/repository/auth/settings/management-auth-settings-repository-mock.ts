import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettingsRepository } from '@/repository/auth/settings/management-auth-settings-repository'

/** Mock implementation of {@link ManagementAuthSettingsRepository}. */
export class ManagementAuthSettingsRepositoryMock implements ManagementAuthSettingsRepository {
  private authSettings: ManagementAuthSettings | null = null
  private readonly listeners = new Set<(settings: ManagementAuthSettings | null) => void>()

  public resultProvider: () => Promise<AppResult<ManagementAuthSettings, AppError>> = async () => {
    if (this.authSettings) {
      return appResultSuccess(this.authSettings)
    }
    return appResultFailure(
      CommonError.contractViolation(
        'No mock settings provided. Call emit() or updateManagementAuthSettings() first.'
      )
    )
  }

  public saveResultProvider: () => Promise<AppResult<void, AppError>> = async () => appResultSuccess(undefined)

  public resetResultProvider: () => Promise<AppResult<ManagementAuthSettings, AppError>> = async () =>
    this.resultProvider()

  public async getManagementAuthSettings(): Promise<AppResult<ManagementAuthSettings, AppError>> {
    return this.resultProvider()
  }

  public async refreshManagementAuthSettings(): Promise<AppResult<ManagementAuthSettings, AppError>> {
    return this.resultProvider()
  }

  public async resetRemoteManagementAuthSettings(): Promise<AppResult<ManagementAuthSettings, AppError>> {
    const result = await this.resetResultProvider()
    if (result.success) {
      this.authSettings = result.data
      this.notifyListeners()
    }
    return result
  }

  public async saveRemoteManagementAuthSettings(
    authSettings: ManagementAuthSettings
  ): Promise<AppResult<void, AppError>> {
    const result = await this.saveResultProvider()
    if (result.success) {
      this.authSettings = authSettings
      this.notifyListeners()
    }
    return result
  }

  public async updateManagementAuthSettings(authSettings: ManagementAuthSettings): Promise<void> {
    this.authSettings = authSettings
    this.notifyListeners()
  }

  public observeManagementAuthSettings(listener: (settings: ManagementAuthSettings | null) => void): () => void {
    this.listeners.add(listener)
    listener(this.authSettings)
    return () => {
      this.listeners.delete(listener)
    }
  }

  public emit(authSettings: ManagementAuthSettings): void {
    this.authSettings = authSettings
    this.notifyListeners()
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.authSettings)
    }
  }
}
