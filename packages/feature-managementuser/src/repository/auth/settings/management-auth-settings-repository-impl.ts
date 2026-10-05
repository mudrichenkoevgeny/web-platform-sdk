import { appResultSuccess, isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AppError,
  AppResult,
  SocketFrame,
  WebSocketService
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import {
  managementAuthSettingsPayloadSchema,
  toManagementAuthSettings,
  toManagementAuthSettingsPayload,
  UserWebSocketEventTypes
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettingsApi } from '@/network/api/auth/settings/management-auth-settings-api'
import type { ManagementAuthSettingsStorage } from '@/storage/auth/settings/management-auth-settings-storage'
import type { ManagementAuthSettingsRepository } from '@/repository/auth/settings/management-auth-settings-repository'

class AsyncMutex {
  private queue: Promise<unknown> = Promise.resolve()

  public async runExclusive<T>(task: () => Promise<T>): Promise<T> {
    const res = this.queue.then(
      () => task(),
      () => task()
    )
    this.queue = res.catch(() => {})
    return res
  }
}

/**
 * Implements {@link ManagementAuthSettingsRepository} with an in-memory snapshot, persistence
 * via {@link ManagementAuthSettingsStorage}, HTTP via {@link ManagementAuthSettingsApi}, and live updates from {@link WebSocketService}.
 */
export class ManagementAuthSettingsRepositoryImpl implements ManagementAuthSettingsRepository {
  private cachedSettings: ManagementAuthSettings | null = null
  private readonly listeners = new Set<(settings: ManagementAuthSettings | null) => void>()
  private readonly mutex = new AsyncMutex()
  private initializationPromise: Promise<void> | null = null

  /**
   * Constructs a new {@link ManagementAuthSettingsRepositoryImpl}.
   *
   * @param managementAuthSettingsApi - Remote REST endpoint for management auth settings
   * @param managementAuthSettingsStorage - Encrypted or local persistence for settings snapshots
   * @param webSocketService - Optional WebSocket service for receiving real-time updates
   * @param logger - Optional diagnostic logger
   */
  public constructor(
    private readonly managementAuthSettingsApi: ManagementAuthSettingsApi,
    private readonly managementAuthSettingsStorage: ManagementAuthSettingsStorage,
    private readonly webSocketService?: WebSocketService,
    private readonly logger?: (msg: string) => void
  ) {
    this.startWebSocketObservation()
    this.initializationPromise = this.preloadCache()
  }

  public async getManagementAuthSettings(): Promise<AppResult<ManagementAuthSettings, AppError>> {
    if (this.cachedSettings !== null) {
      return appResultSuccess(this.cachedSettings)
    }

    if (this.initializationPromise !== null) {
      await this.initializationPromise
      if (this.cachedSettings !== null) {
        return appResultSuccess(this.cachedSettings)
      }
    }

    return this.refreshManagementAuthSettings()
  }

  public async saveRemoteManagementAuthSettings(
    authSettings: ManagementAuthSettings
  ): Promise<AppResult<void, AppError>> {
    return this.mutex.runExclusive(async () => {
      const payload = toManagementAuthSettingsPayload(authSettings)
      const result = await this.managementAuthSettingsApi.updateManagementAuthSettings(payload)
      if (isSuccess(result)) {
        await this.applySettingsUpdate(authSettings)
      }
      return result
    })
  }

  public async resetRemoteManagementAuthSettings(): Promise<AppResult<ManagementAuthSettings, AppError>> {
    return this.mutex.runExclusive(async () => {
      const result = await this.managementAuthSettingsApi.resetManagementAuthSettings()
      const mapped = mapSuccess(result, (payload) => toManagementAuthSettings(payload))
      if (isSuccess(mapped)) {
        await this.applySettingsUpdate(mapped.data)
      }
      return mapped
    })
  }

  public async refreshManagementAuthSettings(): Promise<AppResult<ManagementAuthSettings, AppError>> {
    return this.mutex.runExclusive(() => this.refreshManagementAuthSettingsInternal())
  }

  public async updateManagementAuthSettings(authSettings: ManagementAuthSettings): Promise<void> {
    await this.mutex.runExclusive(() => this.applySettingsUpdate(authSettings))
  }

  public observeManagementAuthSettings(listener: (settings: ManagementAuthSettings | null) => void): () => void {
    this.listeners.add(listener)
    listener(this.cachedSettings)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private async preloadCache(): Promise<void> {
    try {
      const stored = await this.managementAuthSettingsStorage.getManagementAuthSettings()
      if (stored !== null && this.cachedSettings === null) {
        this.cachedSettings = stored
        this.notifyListeners()
      }
    } catch (e) {
      this.logger?.(`ManagementAuthSettingsRepositoryImpl: Preload failed - ${String(e)}`)
    } finally {
      this.initializationPromise = null
    }
  }

  private async refreshManagementAuthSettingsInternal(): Promise<AppResult<ManagementAuthSettings, AppError>> {
    const result = await this.managementAuthSettingsApi.getManagementAuthSettings()
    const mapped = mapSuccess(result, (payload) => toManagementAuthSettings(payload))
    if (isSuccess(mapped)) {
      await this.applySettingsUpdate(mapped.data)
    }
    return mapped
  }

  private async applySettingsUpdate(managementAuthSettings: ManagementAuthSettings): Promise<void> {
    this.cachedSettings = managementAuthSettings
    this.notifyListeners()
    try {
      await this.managementAuthSettingsStorage.updateManagementAuthSettings(managementAuthSettings)
    } catch (e) {
      this.logger?.(`ManagementAuthSettingsRepositoryImpl: Storage update failed - ${String(e)}`)
    }
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.cachedSettings)
      } catch (e) {
        this.logger?.(`ManagementAuthSettingsRepositoryImpl: Listener error - ${String(e)}`)
      }
    }
  }

  private startWebSocketObservation(): void {
    if (!this.webSocketService) {
      return
    }

    this.webSocketService.observeEvents((frame: SocketFrame) => {
      if (frame.type === UserWebSocketEventTypes.MANAGEMENT_AUTH_SETTINGS_UPDATED) {
        try {
          if (frame.payload) {
            const validationResult = managementAuthSettingsPayloadSchema.safeParse(frame.payload)
            if (validationResult.success) {
              const settings = toManagementAuthSettings(validationResult.data)
              void this.updateManagementAuthSettings(settings)
            } else {
              this.logger?.('ManagementAuthSettingsRepositoryImpl: Invalid WS payload schema')
            }
          }
        } catch (e) {
          this.logger?.(`ManagementAuthSettingsRepositoryImpl: WS event parsing failed - ${String(e)}`)
        }
      }
    })
  }
}
