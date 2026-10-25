import { appResultSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult, AppError, WebSocketService, SocketFrame } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { openStorageSettingsPayloadSchema, toOpenStorageSettings, type OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettingsRepository, OpenStorageSettingsObserver } from './open-storage-settings-repository'
import type { OpenStorageSettingsApi } from '../../network/api/storage-settings/open-storage-settings-api'
import type { OpenStorageSettingsStorage } from '../../storage/storage-settings/open-storage-settings-storage'
import { StorageWebSocketEventTypes } from '../../network/contract/storage-web-socket-event-types'

/**
 * Implementation of {@link OpenStorageSettingsRepository} handling API fetch, encrypted storage, and WebSocket updates.
 */
export class OpenStorageSettingsRepositoryImpl implements OpenStorageSettingsRepository {
  private inMemorySettings: OpenStorageSettings | null = null
  private readonly observers = new Set<OpenStorageSettingsObserver>()
  private initializationPromise: Promise<void> | null = null

  public constructor(
    private readonly api: OpenStorageSettingsApi,
    private readonly storage: OpenStorageSettingsStorage,
    private readonly webSocketService: WebSocketService,
    private readonly logger?: (msg: string) => void
  ) {
    this.startWebSocketObservation()
    this.initializationPromise = this.preloadCache()
  }

  public async getOpenStorageSettings(): Promise<AppResult<OpenStorageSettings, AppError>> {
    if (this.inMemorySettings) {
      return appResultSuccess(this.inMemorySettings)
    }

    if (this.initializationPromise) {
      await this.initializationPromise
      if (this.inMemorySettings) {
        return appResultSuccess(this.inMemorySettings)
      }
    }

    return this.refreshOpenStorageSettingsInternal()
  }

  public async refreshOpenStorageSettings(): Promise<AppResult<OpenStorageSettings, AppError>> {
    return this.refreshOpenStorageSettingsInternal()
  }

  public async updateOpenStorageSettings(storageSettings: OpenStorageSettings): Promise<void> {
    await this.applySettingsUpdate(storageSettings)
  }

  public observeOpenStorageSettings(observer: OpenStorageSettingsObserver): () => void {
    this.observers.add(observer)
    observer(this.inMemorySettings)
    return () => {
      this.observers.delete(observer)
    }
  }

  private async preloadCache(): Promise<void> {
    try {
      const cached = await this.storage.getOpenStorageSettings()
      if (cached && !this.inMemorySettings) {
        this.inMemorySettings = cached
        this.notifyObservers(cached)
      }
    } catch (e) {
      this.logger?.(`OpenStorageSettingsRepositoryImpl: Preload failed - ${String(e)}`)
    } finally {
      this.initializationPromise = null
    }
  }

  private async refreshOpenStorageSettingsInternal(): Promise<AppResult<OpenStorageSettings, AppError>> {
    const response = await this.api.getOpenStorageSettings()
    return mapSuccess(response, (payload) => {
      const settings = toOpenStorageSettings(payload)
      void this.applySettingsUpdate(settings)
      return settings
    })
  }

  private async applySettingsUpdate(settings: OpenStorageSettings): Promise<void> {
    this.inMemorySettings = settings
    this.notifyObservers(settings)
    try {
      await this.storage.updateOpenStorageSettings(settings)
    } catch (e) {
      this.logger?.(`OpenStorageSettingsRepositoryImpl: Storage update failed - ${String(e)}`)
    }
  }

  private notifyObservers(settings: OpenStorageSettings | null): void {
    for (const observer of this.observers) {
      try {
        observer(settings)
      } catch (e) {
        this.logger?.(`OpenStorageSettingsRepositoryImpl: Observer threw error - ${String(e)}`)
      }
    }
  }

  private startWebSocketObservation(): void {
    this.webSocketService.observeEvents((frame: SocketFrame) => {
      if (frame.type === StorageWebSocketEventTypes.OPEN_STORAGE_SETTINGS_UPDATED) {
        try {
          if (frame.payload) {
            const validationResult = openStorageSettingsPayloadSchema.safeParse(frame.payload)
            if (validationResult.success) {
              const settings = toOpenStorageSettings(validationResult.data)
              void this.applySettingsUpdate(settings)
            } else {
              this.logger?.('OpenStorageSettingsRepositoryImpl: Invalid WS payload schema')
            }
          }
        } catch (e) {
          this.logger?.(`OpenStorageSettingsRepositoryImpl: WS payload parsing failed - ${String(e)}`)
        }
      }
    })
  }
}
