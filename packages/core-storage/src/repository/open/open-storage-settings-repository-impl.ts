import type { AppError, AppResult, WebSocketService, SocketFrame } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  isFailure,
  appResultSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import {
  StorageWebSocketEventTypes,
  openStorageSettingsPayloadSchema,
  toOpenStorageSettings
} from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettingsApi } from '../../network/api/open/open-storage-settings-api'
import type { OpenStorageSettingsStorage } from '../../storage/open/open-storage-settings-storage'
import type {
  OpenStorageSettingsObserver,
  OpenStorageSettingsRepository
} from './open-storage-settings-repository'

/**
 * Default implementation of {@link OpenStorageSettingsRepository}.
 */
export class OpenStorageSettingsRepositoryImpl implements OpenStorageSettingsRepository {
  private readonly observers = new Set<OpenStorageSettingsObserver>()

  /**
   * Constructs a new {@link OpenStorageSettingsRepositoryImpl}.
   *
   * @param api - REST API client for open storage settings
   * @param storage - Encrypted local storage cache
   * @param webSocketService - Optional WebSocket service for real-time updates
   */
  public constructor(
    private readonly api: OpenStorageSettingsApi,
    private readonly storage: OpenStorageSettingsStorage,
    private readonly webSocketService?: WebSocketService
  ) {
    this.startWebSocketObservation()
  }

  /**
   * Retrieves open storage settings from local storage or network if missing.
   *
   * @returns A promise resolving to an {@link AppResult} containing {@link OpenStorageSettings} or {@link AppError}
   */
  public async getSettings(): Promise<AppResult<OpenStorageSettings, AppError>> {
    const cachedResult = await this.storage.getSettings()
    if (cachedResult.success && cachedResult.data) {
      return appResultSuccess(cachedResult.data)
    }

    return this.refreshSettings()
  }

  /**
   * Forces a fresh fetch of open storage settings from the server and caches the result.
   *
   * @returns A promise resolving to an {@link AppResult} containing fresh {@link OpenStorageSettings} or {@link AppError}
   */
  public async refreshSettings(): Promise<AppResult<OpenStorageSettings, AppError>> {
    const networkResult = await this.api.getSettings()

    if (isFailure(networkResult)) {
      return networkResult
    }

    await this.storage.saveSettings(networkResult.data)
    this.notifyObservers(networkResult.data)
    return networkResult
  }

  /**
   * Updates cached open storage settings in local encrypted storage.
   *
   * @param settings - Updated open storage settings domain model
   */
  public async updateOpenStorageSettings(settings: OpenStorageSettings): Promise<void> {
    await this.storage.saveSettings(settings)
    this.notifyObservers(settings)
  }

  /**
   * Registers an observer callback triggered on live WebSocket settings updates.
   *
   * @param observer - Callback function invoked with updated settings
   * @returns Unsubscribe cleanup function
   */
  public observeOpenStorageSettings(observer: OpenStorageSettingsObserver): () => void {
    this.observers.add(observer)
    return () => {
      this.observers.delete(observer)
    }
  }

  private notifyObservers(settings: OpenStorageSettings): void {
    for (const observer of this.observers) {
      observer(settings)
    }
  }

  private startWebSocketObservation(): void {
    if (!this.webSocketService) {
      return
    }

    this.webSocketService.observeEvents((frame: SocketFrame) => {
      if (frame.type === StorageWebSocketEventTypes.OPEN_STORAGE_SETTINGS_UPDATED) {
        try {
          if (frame.payload) {
            const payload = openStorageSettingsPayloadSchema.parse(frame.payload)
            const settings = toOpenStorageSettings(payload)
            void this.storage.saveSettings(settings)
            this.notifyObservers(settings)
          }
        } catch {
          // Ignore invalid WebSocket payload silently
        }
      }
    })
  }
}
