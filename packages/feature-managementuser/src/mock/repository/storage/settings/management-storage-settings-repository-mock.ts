import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementStorageSettingsPayload, toManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsRepository } from '@/repository/storage/settings/management-storage-settings-repository'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'

export interface ManagementStorageSettingsRepositoryMockConfig {
  initialSettings?: ManagementStorageSettings
  shouldFailGet?: boolean
}

export class ManagementStorageSettingsRepositoryMock implements ManagementStorageSettingsRepository {
  public refreshCallCount = 0
  public updateCallCount = 0
  private settings: ManagementStorageSettings
  private shouldFailGet: boolean
  private readonly listeners = new Set<(settings: ManagementStorageSettings | null) => void>()

  public constructor(config?: ManagementStorageSettingsRepositoryMockConfig) {
    this.settings = config?.initialSettings ?? toManagementStorageSettings(createTestManagementStorageSettingsPayload())
    this.shouldFailGet = config?.shouldFailGet ?? false
  }

  public async getManagementStorageSettings(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    if (this.shouldFailGet) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess(this.settings)
  }

  public async saveRemoteManagementStorageSettings(
    storageSettings: ManagementStorageSettings
  ): Promise<AppResult<ManagementStorageSettings, AppError>> {
    this.settings = storageSettings
    this.notifyListeners()
    return appResultSuccess(storageSettings)
  }

  public async resetRemoteManagementStorageSettings(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    this.settings = toManagementStorageSettings(createTestManagementStorageSettingsPayload())
    this.notifyListeners()
    return appResultSuccess(this.settings)
  }

  public async refreshManagementStorageSettings(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    this.refreshCallCount++
    if (this.shouldFailGet) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess(this.settings)
  }

  public async updateManagementStorageSettings(storageSettings: ManagementStorageSettings): Promise<void> {
    this.updateCallCount++
    this.settings = storageSettings
    this.notifyListeners()
  }

  public observeManagementStorageSettings(
    listener: (settings: ManagementStorageSettings | null) => void
  ): () => void {
    this.listeners.add(listener)
    listener(this.settings)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.settings)
    }
  }
}
