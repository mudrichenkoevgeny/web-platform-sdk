import { AppResult, AppError, mapSuccess, WebSocketService, SocketFrame } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { openGlobalSettingsPayloadSchema } from '@mudrichenkoevgeny/shared-foundation'
import { OpenGlobalSettings, toOpenGlobalSettings } from '../domain/model/OpenGlobalSettings'
import { OpenGlobalSettingsRepository, OpenGlobalSettingsObserver } from './OpenGlobalSettingsRepository'
import { OpenGlobalSettingsApi } from '../network/globalsettings/OpenGlobalSettingsApi'
import { OpenGlobalSettingsStorage } from '../storage/globalsettings/OpenGlobalSettingsStorage'
import { SettingsWebSocketEventTypes } from '../network/contract/SettingsWebSocketEventTypes'

/**
 * Implementation of {@link OpenGlobalSettingsRepository} handling API fetch, encrypted storage, and WebSocket updates.
 */
export class OpenGlobalSettingsRepositoryImpl implements OpenGlobalSettingsRepository {
  private inMemorySettings: OpenGlobalSettings | null = null
  private readonly observers = new Set<OpenGlobalSettingsObserver>()
  private initializationPromise: Promise<void> | null = null

  /**
   * Constructs a new {@link OpenGlobalSettingsRepositoryImpl}.
   *
   * @param api - REST API client for open global settings
   * @param storage - Encrypted storage backend for settings persistence
   * @param webSocketService - WebSocket client for receiving real-time setting updates
   * @param logger - Optional diagnostic logger
   */
  public constructor(
    private readonly api: OpenGlobalSettingsApi,
    private readonly storage: OpenGlobalSettingsStorage,
    private readonly webSocketService: WebSocketService,
    private readonly logger?: (msg: string) => void
  ) {
    this.startWebSocketObservation()
    this.initializationPromise = this.preloadCache()
  }

  /**
   * Retrieves global settings from memory, storage, or network.
   *
   * @returns Resolved global settings result
   */
  public async getOpenGlobalSettings(): Promise<AppResult<OpenGlobalSettings, AppError>> {
    if (this.inMemorySettings) {
      return { success: true, data: this.inMemorySettings }
    }

    if (this.initializationPromise) {
      await this.initializationPromise
      if (this.inMemorySettings) {
        return { success: true, data: this.inMemorySettings }
      }
    }

    return this.refreshOpenGlobalSettingsInternal()
  }

  /**
   * Forces a refresh from the network and persists result.
   *
   * @returns Updated global settings result
   */
  public async refreshOpenGlobalSettings(): Promise<AppResult<OpenGlobalSettings, AppError>> {
    return this.refreshOpenGlobalSettingsInternal()
  }

  /**
   * Overwrites the active global settings (e.g. from WebSocket update).
   *
   * @param globalSettings - New active settings
   */
  public async updateOpenGlobalSettings(globalSettings: OpenGlobalSettings): Promise<void> {
    await this.applySettingsUpdate(globalSettings)
  }

  /**
   * Subscribes to updates of the global settings.
   *
   * @param observer - Callback
   * @returns Unsubscribe function
   */
  public observeOpenGlobalSettings(observer: OpenGlobalSettingsObserver): () => void {
    this.observers.add(observer)
    observer(this.inMemorySettings)
    return () => {
      this.observers.delete(observer)
    }
  }

  private async preloadCache(): Promise<void> {
    try {
      const cached = await this.storage.getOpenGlobalSettings()
      if (cached && !this.inMemorySettings) {
        this.inMemorySettings = cached
        this.notifyObservers(cached)
      }
    } catch (e) {
      this.logger?.(`OpenGlobalSettingsRepositoryImpl: Preload failed - ${String(e)}`)
    } finally {
      this.initializationPromise = null
    }
  }

  private async refreshOpenGlobalSettingsInternal(): Promise<AppResult<OpenGlobalSettings, AppError>> {
    const response = await this.api.getOpenGlobalSettings()
    return mapSuccess(response, (payload) => {
      const settings = toOpenGlobalSettings(payload)
      void this.applySettingsUpdate(settings)
      return settings
    })
  }

  private async applySettingsUpdate(settings: OpenGlobalSettings): Promise<void> {
    this.inMemorySettings = settings
    this.notifyObservers(settings)
    try {
      await this.storage.updateOpenGlobalSettings(settings)
    } catch (e) {
      this.logger?.(`OpenGlobalSettingsRepositoryImpl: Storage update failed - ${String(e)}`)
    }
  }

  private notifyObservers(settings: OpenGlobalSettings | null): void {
    for (const observer of this.observers) {
      try {
        observer(settings)
      } catch (e) {
        this.logger?.(`OpenGlobalSettingsRepositoryImpl: Observer threw error - ${String(e)}`)
      }
    }
  }

  private startWebSocketObservation(): void {
    this.webSocketService.observeEvents((frame: SocketFrame) => {
      if (frame.type === SettingsWebSocketEventTypes.GLOBAL_SETTINGS_UPDATED) {
        try {
          if (frame.payload) {
            const validationResult = openGlobalSettingsPayloadSchema.safeParse(frame.payload)
            if (validationResult.success) {
              const settings = toOpenGlobalSettings(validationResult.data)
              void this.applySettingsUpdate(settings)
            } else {
              this.logger?.('OpenGlobalSettingsRepositoryImpl: Invalid WS payload schema')
            }
          }
        } catch (e) {
          this.logger?.(`OpenGlobalSettingsRepositoryImpl: WS payload parsing failed - ${String(e)}`)
        }
      }
    })
  }
}
