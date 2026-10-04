import { AppResult, AppError, mapSuccess, WebSocketService, SocketFrame } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { openSecuritySettingsPayloadSchema } from '@mudrichenkoevgeny/shared-foundation'
import { OpenSecuritySettings, toOpenSecuritySettings } from '@/domain/model/OpenSecuritySettings'
import { OpenSecuritySettingsRepository, OpenSecuritySettingsObserver } from './OpenSecuritySettingsRepository'
import { OpenSecuritySettingsApi } from '@/network/securitysettings/OpenSecuritySettingsApi'
import { OpenSecuritySettingsStorage } from '@/storage/securitysettings/OpenSecuritySettingsStorage'
import { SecurityWebSocketEventTypes } from '@/network/contract/SecurityWebSocketEventTypes'

/**
 * Implementation of {@link OpenSecuritySettingsRepository} handling API fetch, encrypted storage, and WebSocket updates.
 */
export class OpenSecuritySettingsRepositoryImpl implements OpenSecuritySettingsRepository {
  private inMemorySettings: OpenSecuritySettings | null = null
  private readonly observers = new Set<OpenSecuritySettingsObserver>()
  private initializationPromise: Promise<void> | null = null

  /**
   * Constructs a new {@link OpenSecuritySettingsRepositoryImpl}.
   *
   * @param api - REST API client for open security settings
   * @param storage - Encrypted storage backend for settings persistence
   * @param webSocketService - WebSocket client for receiving real-time setting updates
   * @param logger - Optional diagnostic logger
   */
  public constructor(
    private readonly api: OpenSecuritySettingsApi,
    private readonly storage: OpenSecuritySettingsStorage,
    private readonly webSocketService: WebSocketService,
    private readonly logger?: (msg: string) => void
  ) {
    this.startWebSocketObservation()
    this.initializationPromise = this.preloadCache()
  }

  /**
   * Retrieves security settings from memory, storage, or network.
   *
   * @returns Resolved security settings result
   */
  public async getOpenSecuritySettings(): Promise<AppResult<OpenSecuritySettings, AppError>> {
    if (this.inMemorySettings) {
      return { success: true, data: this.inMemorySettings }
    }

    if (this.initializationPromise) {
      await this.initializationPromise
      if (this.inMemorySettings) {
        return { success: true, data: this.inMemorySettings }
      }
    }

    return this.refreshOpenSecuritySettingsInternal()
  }

  /**
   * Forces a refresh from the network and persists result.
   *
   * @returns Updated security settings result
   */
  public async refreshOpenSecuritySettings(): Promise<AppResult<OpenSecuritySettings, AppError>> {
    return this.refreshOpenSecuritySettingsInternal()
  }

  /**
   * Overwrites the active security settings (e.g. from WebSocket update).
   *
   * @param securitySettings - New active settings
   */
  public async updateOpenSecuritySettings(securitySettings: OpenSecuritySettings): Promise<void> {
    await this.applySettingsUpdate(securitySettings)
  }

  /**
   * Subscribes to updates of the security settings.
   *
   * @param observer - Callback
   * @returns Unsubscribe function
   */
  public observeOpenSecuritySettings(observer: OpenSecuritySettingsObserver): () => void {
    this.observers.add(observer)
    observer(this.inMemorySettings)
    return () => {
      this.observers.delete(observer)
    }
  }

  private async preloadCache(): Promise<void> {
    try {
      const cached = await this.storage.getOpenSecuritySettings()
      if (cached && !this.inMemorySettings) {
        this.inMemorySettings = cached
        this.notifyObservers(cached)
      }
    } catch (e) {
      this.logger?.(`OpenSecuritySettingsRepositoryImpl: Preload failed - ${String(e)}`)
    } finally {
      this.initializationPromise = null
    }
  }

  private async refreshOpenSecuritySettingsInternal(): Promise<AppResult<OpenSecuritySettings, AppError>> {
    const response = await this.api.getSecuritySettings()
    return mapSuccess(response, (payload) => {
      const settings = toOpenSecuritySettings(payload)
      void this.applySettingsUpdate(settings)
      return settings
    })
  }

  private async applySettingsUpdate(settings: OpenSecuritySettings): Promise<void> {
    this.inMemorySettings = settings
    this.notifyObservers(settings)
    try {
      await this.storage.updateOpenSecuritySettings(settings)
    } catch (e) {
      this.logger?.(`OpenSecuritySettingsRepositoryImpl: Storage update failed - ${String(e)}`)
    }
  }

  private notifyObservers(settings: OpenSecuritySettings | null): void {
    for (const observer of this.observers) {
      try {
        observer(settings)
      } catch (e) {
        this.logger?.(`OpenSecuritySettingsRepositoryImpl: Observer threw error - ${String(e)}`)
      }
    }
  }

  private startWebSocketObservation(): void {
    this.webSocketService.observeEvents((frame: SocketFrame) => {
      if (frame.type === SecurityWebSocketEventTypes.SECURITY_SETTINGS_UPDATED) {
        try {
          if (frame.payload) {
            const validationResult = openSecuritySettingsPayloadSchema.safeParse(frame.payload)
            if (validationResult.success) {
              const settings = toOpenSecuritySettings(validationResult.data)
              void this.applySettingsUpdate(settings)
            } else {
              this.logger?.('OpenSecuritySettingsRepositoryImpl: Invalid WS payload schema')
            }
          }
        } catch (e) {
          this.logger?.(`OpenSecuritySettingsRepositoryImpl: WS payload parsing failed - ${String(e)}`)
        }
      }
    })
  }
}
