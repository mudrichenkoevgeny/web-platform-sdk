import { appResultSuccess, isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AppError,
  AppResult,
  SocketFrame,
  WebSocketService
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import {
  managementStorageSettingsPayloadSchema,
  StorageWebSocketEventTypes,
  toManagementStorageSettings,
  toManagementStorageSettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsApi } from '@/network/api/storage/settings/management-storage-settings-api'
import type { ManagementStorageSettingsStorage } from '@/storage/storage-settings/management-storage-settings-storage'
import type { ManagementStorageSettingsRepository } from '@/repository/storage/settings/management-storage-settings-repository'

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
 * Implements {@link ManagementStorageSettingsRepository} managing an in-memory cache,
 * persistence via {@link ManagementStorageSettingsStorage}, remote HTTP via {@link ManagementStorageSettingsApi},
 * and live push updates via {@link WebSocketService}.
 */
export class ManagementStorageSettingsRepositoryImpl implements ManagementStorageSettingsRepository {
  private cachedSettings: ManagementStorageSettings | null = null
  private readonly listeners = new Set<(settings: ManagementStorageSettings | null) => void>()
  private readonly mutex = new AsyncMutex()
  private initializationPromise: Promise<void> | null = null

  /**
   * Constructs a new {@link ManagementStorageSettingsRepositoryImpl}.
   *
   * @param managementStorageSettingsApi - Remote REST endpoint
   * @param managementStorageSettingsStorage - Storage backend for persistent caching
   * @param webSocketService - Optional WebSocket client for real-time updates
   * @param logger - Optional diagnostic logger
   */
  public constructor(
    private readonly managementStorageSettingsApi: ManagementStorageSettingsApi,
    private readonly managementStorageSettingsStorage: ManagementStorageSettingsStorage,
    private readonly webSocketService?: WebSocketService,
    private readonly logger?: (msg: string) => void
  ) {
    this.startWebSocketObservation()
    this.initializationPromise = this.preloadCache()
  }

  public async getManagementStorageSettings(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    if (this.cachedSettings !== null) {
      return appResultSuccess(this.cachedSettings)
    }

    if (this.initializationPromise !== null) {
      await this.initializationPromise
      if (this.cachedSettings !== null) {
        return appResultSuccess(this.cachedSettings)
      }
    }

    return this.refreshManagementStorageSettings()
  }

  public async saveRemoteManagementStorageSettings(
    storageSettings: ManagementStorageSettings
  ): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.mutex.runExclusive(async () => {
      const payload = toManagementStorageSettingsPayload(storageSettings)
      const result = await this.managementStorageSettingsApi.updateManagementStorageSettings(payload)
      const mapped = mapSuccess(result, (responsePayload) => toManagementStorageSettings(responsePayload))
      if (isSuccess(mapped)) {
        await this.applySettingsUpdate(mapped.data)
      }
      return mapped
    })
  }

  public async resetRemoteManagementStorageSettings(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.mutex.runExclusive(async () => {
      const result = await this.managementStorageSettingsApi.resetManagementStorageSettings()
      const mapped = mapSuccess(result, (payload) => toManagementStorageSettings(payload))
      if (isSuccess(mapped)) {
        await this.applySettingsUpdate(mapped.data)
      }
      return mapped
    })
  }

  public async refreshManagementStorageSettings(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    return this.mutex.runExclusive(() => this.refreshManagementStorageSettingsInternal())
  }

  public async updateManagementStorageSettings(storageSettings: ManagementStorageSettings): Promise<void> {
    await this.mutex.runExclusive(() => this.applySettingsUpdate(storageSettings))
  }

  public observeManagementStorageSettings(
    listener: (settings: ManagementStorageSettings | null) => void
  ): () => void {
    this.listeners.add(listener)
    listener(this.cachedSettings)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private async preloadCache(): Promise<void> {
    try {
      const stored = await this.managementStorageSettingsStorage.getManagementStorageSettings()
      if (stored !== null && this.cachedSettings === null) {
        this.cachedSettings = stored
        this.notifyListeners()
      }
    } catch (e) {
      this.logger?.(`ManagementStorageSettingsRepositoryImpl: Preload failed - ${String(e)}`)
    } finally {
      this.initializationPromise = null
    }
  }

  private async refreshManagementStorageSettingsInternal(): Promise<AppResult<ManagementStorageSettings, AppError>> {
    const result = await this.managementStorageSettingsApi.getManagementStorageSettings()
    const mapped = mapSuccess(result, (payload) => toManagementStorageSettings(payload))
    if (isSuccess(mapped)) {
      await this.applySettingsUpdate(mapped.data)
    }
    return mapped
  }

  private async applySettingsUpdate(managementStorageSettings: ManagementStorageSettings): Promise<void> {
    this.cachedSettings = managementStorageSettings
    this.notifyListeners()
    try {
      await this.managementStorageSettingsStorage.updateManagementStorageSettings(managementStorageSettings)
    } catch (e) {
      this.logger?.(`ManagementStorageSettingsRepositoryImpl: Storage update failed - ${String(e)}`)
    }
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.cachedSettings)
      } catch (e) {
        this.logger?.(`ManagementStorageSettingsRepositoryImpl: Listener error - ${String(e)}`)
      }
    }
  }

  private startWebSocketObservation(): void {
    if (!this.webSocketService) {
      return
    }

    this.webSocketService.observeEvents((frame: SocketFrame) => {
      if (frame.type === StorageWebSocketEventTypes.MANAGEMENT_STORAGE_SETTINGS_UPDATED) {
        try {
          if (frame.payload) {
            const validationResult = managementStorageSettingsPayloadSchema.safeParse(frame.payload)
            if (validationResult.success) {
              const settings = toManagementStorageSettings(validationResult.data)
              void this.applySettingsUpdate(settings)
            } else {
              this.logger?.('ManagementStorageSettingsRepositoryImpl: Invalid WS payload schema')
            }
          }
        } catch (e) {
          this.logger?.(`ManagementStorageSettingsRepositoryImpl: WS event parsing failed - ${String(e)}`)
        }
      }
    })
  }
}
