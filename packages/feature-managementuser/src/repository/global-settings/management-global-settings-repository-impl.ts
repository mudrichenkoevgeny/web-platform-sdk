import { appResultSuccess, isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AppError,
  AppResult,
  SocketFrame,
  WebSocketService
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import {
  managementGlobalSettingsPayloadSchema,
  SettingsWebSocketEventTypes,
  toManagementGlobalSettings,
  toManagementGlobalSettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettingsApi } from '@/network/api/global-settings/management-global-settings-api'
import type { ManagementGlobalSettingsStorage } from '@/storage/global-settings/management-global-settings-storage'
import type { ManagementGlobalSettingsRepository } from '@/repository/global-settings/management-global-settings-repository'

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
 * Implements {@link ManagementGlobalSettingsRepository} managing an in-memory cache,
 * persistence via {@link ManagementGlobalSettingsStorage}, remote HTTP via {@link ManagementGlobalSettingsApi},
 * and live push updates via {@link WebSocketService}.
 */
export class ManagementGlobalSettingsRepositoryImpl implements ManagementGlobalSettingsRepository {
  private cachedSettings: ManagementGlobalSettings | null = null
  private readonly listeners = new Set<(settings: ManagementGlobalSettings | null) => void>()
  private readonly mutex = new AsyncMutex()
  private initializationPromise: Promise<void> | null = null

  /**
   * Constructs a new {@link ManagementGlobalSettingsRepositoryImpl}.
   *
   * @param managementGlobalSettingsApi - Remote REST endpoint
   * @param managementGlobalSettingsStorage - Storage backend for persistent caching
   * @param webSocketService - Optional WebSocket client for real-time updates
   * @param logger - Optional diagnostic logger
   */
  public constructor(
    private readonly managementGlobalSettingsApi: ManagementGlobalSettingsApi,
    private readonly managementGlobalSettingsStorage: ManagementGlobalSettingsStorage,
    private readonly webSocketService?: WebSocketService,
    private readonly logger?: (msg: string) => void
  ) {
    this.startWebSocketObservation()
    this.initializationPromise = this.preloadCache()
  }

  public async getManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettings, AppError>> {
    if (this.cachedSettings !== null) {
      return appResultSuccess(this.cachedSettings)
    }

    if (this.initializationPromise !== null) {
      await this.initializationPromise
      if (this.cachedSettings !== null) {
        return appResultSuccess(this.cachedSettings)
      }
    }

    return this.refreshManagementGlobalSettings()
  }

  public async saveRemoteManagementGlobalSettings(
    globalSettings: ManagementGlobalSettings
  ): Promise<AppResult<ManagementGlobalSettings, AppError>> {
    return this.mutex.runExclusive(async () => {
      const payload = toManagementGlobalSettingsPayload(globalSettings)
      const result = await this.managementGlobalSettingsApi.updateManagementGlobalSettings(payload)
      const mapped = mapSuccess(result, (responsePayload) => toManagementGlobalSettings(responsePayload))
      if (isSuccess(mapped)) {
        await this.applySettingsUpdate(mapped.data)
      }
      return mapped
    })
  }

  public async resetRemoteManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettings, AppError>> {
    return this.mutex.runExclusive(async () => {
      const result = await this.managementGlobalSettingsApi.resetManagementGlobalSettings()
      const mapped = mapSuccess(result, (payload) => toManagementGlobalSettings(payload))
      if (isSuccess(mapped)) {
        await this.applySettingsUpdate(mapped.data)
      }
      return mapped
    })
  }

  public async refreshManagementGlobalSettings(): Promise<AppResult<ManagementGlobalSettings, AppError>> {
    return this.mutex.runExclusive(() => this.refreshManagementGlobalSettingsInternal())
  }

  public async updateManagementGlobalSettings(globalSettings: ManagementGlobalSettings): Promise<void> {
    await this.mutex.runExclusive(() => this.applySettingsUpdate(globalSettings))
  }

  public observeManagementGlobalSettings(
    listener: (settings: ManagementGlobalSettings | null) => void
  ): () => void {
    this.listeners.add(listener)
    listener(this.cachedSettings)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private async preloadCache(): Promise<void> {
    try {
      const stored = await this.managementGlobalSettingsStorage.getManagementGlobalSettings()
      if (stored !== null && this.cachedSettings === null) {
        this.cachedSettings = stored
        this.notifyListeners()
      }
    } catch (e) {
      this.logger?.(`ManagementGlobalSettingsRepositoryImpl: Preload failed - ${String(e)}`)
    } finally {
      this.initializationPromise = null
    }
  }

  private async refreshManagementGlobalSettingsInternal(): Promise<AppResult<ManagementGlobalSettings, AppError>> {
    const result = await this.managementGlobalSettingsApi.getManagementGlobalSettings()
    const mapped = mapSuccess(result, (payload) => toManagementGlobalSettings(payload))
    if (isSuccess(mapped)) {
      await this.applySettingsUpdate(mapped.data)
    }
    return mapped
  }

  private async applySettingsUpdate(managementGlobalSettings: ManagementGlobalSettings): Promise<void> {
    this.cachedSettings = managementGlobalSettings
    this.notifyListeners()
    try {
      await this.managementGlobalSettingsStorage.updateManagementGlobalSettings(managementGlobalSettings)
    } catch (e) {
      this.logger?.(`ManagementGlobalSettingsRepositoryImpl: Storage update failed - ${String(e)}`)
    }
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.cachedSettings)
      } catch (e) {
        this.logger?.(`ManagementGlobalSettingsRepositoryImpl: Listener error - ${String(e)}`)
      }
    }
  }

  private startWebSocketObservation(): void {
    if (!this.webSocketService) {
      return
    }

    this.webSocketService.observeEvents((frame: SocketFrame) => {
      if (frame.type === SettingsWebSocketEventTypes.MANAGEMENT_GLOBAL_SETTINGS_UPDATED) {
        try {
          if (frame.payload) {
            const validationResult = managementGlobalSettingsPayloadSchema.safeParse(frame.payload)
            if (validationResult.success) {
              const settings = toManagementGlobalSettings(validationResult.data)
              void this.applySettingsUpdate(settings)
            } else {
              this.logger?.('ManagementGlobalSettingsRepositoryImpl: Invalid WS payload schema')
            }
          }
        } catch (e) {
          this.logger?.(`ManagementGlobalSettingsRepositoryImpl: WS event parsing failed - ${String(e)}`)
        }
      }
    })
  }
}
