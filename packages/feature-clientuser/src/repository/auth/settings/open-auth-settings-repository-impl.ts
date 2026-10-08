import { appResultSuccess, isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AppError,
  AppResult,
  SocketFrame,
  WebSocketService
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import {
  openAuthSettingsPayloadSchema,
  toOpenAuthSettings,
  UserWebSocketEventTypes
} from '@mudrichenkoevgeny/shared-foundation'
import type { OpenAuthSettingsRepository, OpenAuthSettingsStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenAuthSettingsApi } from '@/network/api/auth/settings/open-auth-settings-api'

/**
 * Implements {@link OpenAuthSettingsRepository} using {@link OpenAuthSettingsApi}, {@link OpenAuthSettingsStorage},
 * and {@link WebSocketService} for real-time updates.
 */
export class OpenAuthSettingsRepositoryImpl implements OpenAuthSettingsRepository {
  private cachedSettings: OpenAuthSettings | null = null
  private readonly listeners = new Set<(settings: OpenAuthSettings | null) => void>()
  private initializationPromise: Promise<void> | null = null
  private inFlightRefreshPromise: Promise<AppResult<OpenAuthSettings, AppError>> | null = null

  /**
   * Constructs a new {@link OpenAuthSettingsRepositoryImpl}.
   *
   * @param openAuthSettingsApi - Remote read endpoint for auth settings
   * @param openAuthSettingsStorage - Encrypted or local persistence for settings snapshots
   * @param webSocketService - Optional WebSocket service for receiving real-time event updates
   * @param logger - Optional diagnostic logger
   */
  public constructor(
    private readonly openAuthSettingsApi: OpenAuthSettingsApi,
    private readonly openAuthSettingsStorage: OpenAuthSettingsStorage,
    private readonly webSocketService?: WebSocketService,
    private readonly logger?: (msg: string) => void
  ) {
    this.startWebSocketObservation()
    this.initializationPromise = this.preloadCache()
  }

  public async getOpenAuthSettings(): Promise<AppResult<OpenAuthSettings, AppError>> {
    if (this.cachedSettings !== null) {
      return appResultSuccess(this.cachedSettings)
    }

    if (this.initializationPromise !== null) {
      await this.initializationPromise
      if (this.cachedSettings !== null) {
        return appResultSuccess(this.cachedSettings)
      }
    }

    return this.refreshOpenAuthSettings()
  }

  public async refreshOpenAuthSettings(): Promise<AppResult<OpenAuthSettings, AppError>> {
    if (this.inFlightRefreshPromise !== null) {
      return this.inFlightRefreshPromise
    }

    this.inFlightRefreshPromise = this.refreshOpenAuthSettingsInternal()
    try {
      return await this.inFlightRefreshPromise
    } finally {
      this.inFlightRefreshPromise = null
    }
  }

  public async updateOpenAuthSettings(authSettings: OpenAuthSettings): Promise<void> {
    await this.applySettingsUpdate(authSettings)
  }

  public observeOpenAuthSettings(listener: (settings: OpenAuthSettings | null) => void): () => void {
    this.listeners.add(listener)
    listener(this.cachedSettings)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private async preloadCache(): Promise<void> {
    try {
      const stored = await this.openAuthSettingsStorage.getOpenAuthSettings()
      if (stored !== null && this.cachedSettings === null) {
        this.cachedSettings = stored
        this.notifyListeners()
      }
    } catch (e) {
      this.logger?.(`OpenAuthSettingsRepositoryImpl: Preload cache failed - ${String(e)}`)
    } finally {
      this.initializationPromise = null
    }
  }

  private async refreshOpenAuthSettingsInternal(): Promise<AppResult<OpenAuthSettings, AppError>> {
    const result = await this.openAuthSettingsApi.getAuthSettings()
    const mapped = mapSuccess(result, (payload) => toOpenAuthSettings(payload))
    if (isSuccess(mapped)) {
      await this.applySettingsUpdate(mapped.data)
    }
    return mapped
  }

  private async applySettingsUpdate(authSettings: OpenAuthSettings): Promise<void> {
    this.cachedSettings = authSettings
    this.notifyListeners()
    try {
      await this.openAuthSettingsStorage.updateOpenAuthSettings(authSettings)
    } catch (e) {
      this.logger?.(`OpenAuthSettingsRepositoryImpl: Storage update failed - ${String(e)}`)
    }
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.cachedSettings)
      } catch (e) {
        this.logger?.(`OpenAuthSettingsRepositoryImpl: Listener error - ${String(e)}`)
      }
    }
  }

  private startWebSocketObservation(): void {
    if (!this.webSocketService) {
      return
    }

    this.webSocketService.observeEvents((frame: SocketFrame) => {
      if (frame.type === UserWebSocketEventTypes.OPEN_AUTH_SETTINGS_UPDATED) {
        try {
          if (frame.payload) {
            const validationResult = openAuthSettingsPayloadSchema.safeParse(frame.payload)
            if (validationResult.success) {
              const settings = toOpenAuthSettings(validationResult.data)
              void this.applySettingsUpdate(settings)
            } else {
              this.logger?.('OpenAuthSettingsRepositoryImpl: Invalid WS payload schema')
            }
          }
        } catch (e) {
          this.logger?.(`OpenAuthSettingsRepositoryImpl: WS event parsing failed - ${String(e)}`)
        }
      }
    })
  }
}
