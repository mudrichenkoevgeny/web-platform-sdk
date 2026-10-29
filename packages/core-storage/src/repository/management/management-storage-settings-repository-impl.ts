import type { AppError, AppResult, WebSocketService, SocketFrame } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  isFailure,
  appResultSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementStorageSettings
} from '@mudrichenkoevgeny/shared-foundation'
import {
  StorageWebSocketEventTypes,
  managementStorageSettingsPayloadSchema,
  toManagementStorageSettings
} from '@mudrichenkoevgeny/shared-foundation'
import type {
  ManagementStorageSettingsApi,
  UpdateManagementStorageSettingsRequest
} from '../../network/api/management/management-storage-settings-api'
import type { ManagementStorageSettingsStorage } from '../../storage/management/management-storage-settings-storage'
import type {
  ManagementStorageSettingsObserver,
  ManagementStorageSettingsRepository
} from './management-storage-settings-repository'

/**
 * Default implementation of {@link ManagementStorageSettingsRepository}.
 */
export class ManagementStorageSettingsRepositoryImpl implements ManagementStorageSettingsRepository {
  private readonly observers = new Set<ManagementStorageSettingsObserver>()

  /**
   * Constructs a new {@link ManagementStorageSettingsRepositoryImpl} instance.
   *
   * @param api - Management storage settings REST API client
   * @param storage - Encrypted storage cache for management storage settings
   * @param webSocketService - Optional WebSocket service for real-time updates
   */
  public constructor(
    private readonly api: ManagementStorageSettingsApi,
    private readonly storage: ManagementStorageSettingsStorage,
    private readonly webSocketService?: WebSocketService
  ) {
    this.startWebSocketObservation()
  }

  /**
   * Retrieves management storage settings from local encrypted storage or fetches from API if not cached.
   *
   * @returns AppResult containing cached or fetched {@link ManagementStorageSettings}
   */
  public async getSettings(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    const cachedResult = await this.storage.getSettings()
    if (cachedResult.success && cachedResult.data) {
      return appResultSuccess(cachedResult.data)
    }

    return this.refreshSettings()
  }

  /**
   * Bypasses local cache, fetches fresh management storage settings from API, and updates local cache.
   *
   * @returns AppResult containing fresh {@link ManagementStorageSettings}
   */
  public async refreshSettings(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    const networkResult = await this.api.getSettings()

    if (isFailure(networkResult)) {
      return networkResult
    }

    await this.storage.saveSettings(networkResult.data)
    this.notifyObservers(networkResult.data)
    return networkResult
  }

  /**
   * Updates management storage settings via API and updates local cache upon success.
   *
   * @param request - DTO containing settings fields to update
   * @returns AppResult containing updated {@link ManagementStorageSettings}
   */
  public async updateSettings(
    request: UpdateManagementStorageSettingsRequest
  ): Promise<AppResult<ManagementStorageSettings, AppError>> {
    const networkResult = await this.api.updateSettings(request)

    if (isFailure(networkResult)) {
      return networkResult
    }

    await this.storage.saveSettings(networkResult.data)
    this.notifyObservers(networkResult.data)
    return networkResult
  }

  /**
   * Resets management storage settings to default values via API and clears local cache.
   *
   * @returns AppResult containing default {@link ManagementStorageSettings}
   */
  public async resetSettings(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    const networkResult = await this.api.resetSettings()

    if (isFailure(networkResult)) {
      return networkResult
    }

    await this.storage.saveSettings(networkResult.data)
    this.notifyObservers(networkResult.data)
    return networkResult
  }

  /**
   * Registers an observer callback triggered on live WebSocket or internal settings updates.
   *
   * @param observer - Callback function invoked with updated settings
   * @returns Unsubscribe cleanup function
   */
  public observeSettings(observer: ManagementStorageSettingsObserver): () => void {
    this.observers.add(observer)
    return () => {
      this.observers.delete(observer)
    }
  }

  private notifyObservers(settings: ManagementStorageSettings): void {
    for (const observer of this.observers) {
      observer(settings)
    }
  }

  private startWebSocketObservation(): void {
    if (!this.webSocketService) {
      return
    }

    this.webSocketService.observeEvents((frame: SocketFrame) => {
      if (
        frame.type ===
        StorageWebSocketEventTypes.MANAGEMENT_STORAGE_SETTINGS_UPDATED
      ) {
        try {
          if (frame.payload) {
            const payload = managementStorageSettingsPayloadSchema.parse(frame.payload)
            const settings = toManagementStorageSettings(payload)
            void this.storage.saveSettings(settings)
            this.notifyObservers(settings)
          }
        } catch {
          // Ignore invalid WebSocket payload
        }
      }
    })
  }
}
