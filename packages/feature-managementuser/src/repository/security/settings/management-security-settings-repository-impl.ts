import { appResultSuccess, isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AppError,
  AppResult,
  SocketFrame,
  WebSocketService
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import {
  managementSecuritySettingsPayloadSchema,
  SecurityWebSocketEventTypes,
  toManagementSecuritySettings,
  toManagementSecuritySettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSecuritySettingsApi } from '@/network/api/security/settings/management-security-settings-api'
import type { ManagementSecuritySettingsStorage } from '@/storage/security-settings/management-security-settings-storage'
import type { ManagementSecuritySettingsRepository } from '@/repository/security/settings/management-security-settings-repository'

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
 * Implements {@link ManagementSecuritySettingsRepository} managing an in-memory cache,
 * persistence via {@link ManagementSecuritySettingsStorage}, remote HTTP via {@link ManagementSecuritySettingsApi},
 * and live push updates via {@link WebSocketService}.
 */
export class ManagementSecuritySettingsRepositoryImpl implements ManagementSecuritySettingsRepository {
  private cachedSettings: ManagementSecuritySettings | null = null
  private readonly listeners = new Set<(settings: ManagementSecuritySettings | null) => void>()
  private readonly mutex = new AsyncMutex()
  private initializationPromise: Promise<void> | null = null

  /**
   * Constructs a new {@link ManagementSecuritySettingsRepositoryImpl}.
   *
   * @param managementSecuritySettingsApi - Remote REST endpoint
   * @param managementSecuritySettingsStorage - Storage backend for persistent caching
   * @param webSocketService - Optional WebSocket client for real-time updates
   * @param logger - Optional diagnostic logger
   */
  public constructor(
    private readonly managementSecuritySettingsApi: ManagementSecuritySettingsApi,
    private readonly managementSecuritySettingsStorage: ManagementSecuritySettingsStorage,
    private readonly webSocketService?: WebSocketService,
    private readonly logger?: (msg: string) => void
  ) {
    this.startWebSocketObservation()
    this.initializationPromise = this.preloadCache()
  }

  public async getManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettings, AppError>> {
    if (this.cachedSettings !== null) {
      return appResultSuccess(this.cachedSettings)
    }

    if (this.initializationPromise !== null) {
      await this.initializationPromise
      if (this.cachedSettings !== null) {
        return appResultSuccess(this.cachedSettings)
      }
    }

    return this.refreshManagementSecuritySettings()
  }

  public async saveRemoteManagementSecuritySettings(
    securitySettings: ManagementSecuritySettings
  ): Promise<AppResult<ManagementSecuritySettings, AppError>> {
    return this.mutex.runExclusive(async () => {
      const payload = toManagementSecuritySettingsPayload(securitySettings)
      const result = await this.managementSecuritySettingsApi.updateManagementSecuritySettings(payload)
      const mapped = mapSuccess(result, (responsePayload) => toManagementSecuritySettings(responsePayload))
      if (isSuccess(mapped)) {
        await this.applySettingsUpdate(mapped.data)
      }
      return mapped
    })
  }

  public async resetRemoteManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettings, AppError>> {
    return this.mutex.runExclusive(async () => {
      const result = await this.managementSecuritySettingsApi.resetManagementSecuritySettings()
      const mapped = mapSuccess(result, (payload) => toManagementSecuritySettings(payload))
      if (isSuccess(mapped)) {
        await this.applySettingsUpdate(mapped.data)
      }
      return mapped
    })
  }

  public async refreshManagementSecuritySettings(): Promise<AppResult<ManagementSecuritySettings, AppError>> {
    return this.mutex.runExclusive(() => this.refreshManagementSecuritySettingsInternal())
  }

  public async updateManagementSecuritySettings(securitySettings: ManagementSecuritySettings): Promise<void> {
    await this.mutex.runExclusive(() => this.applySettingsUpdate(securitySettings))
  }

  public observeManagementSecuritySettings(
    listener: (settings: ManagementSecuritySettings | null) => void
  ): () => void {
    this.listeners.add(listener)
    listener(this.cachedSettings)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private async preloadCache(): Promise<void> {
    try {
      const stored = await this.managementSecuritySettingsStorage.getManagementSecuritySettings()
      if (stored !== null && this.cachedSettings === null) {
        this.cachedSettings = stored
        this.notifyListeners()
      }
    } catch (e) {
      this.logger?.(`ManagementSecuritySettingsRepositoryImpl: Preload failed - ${String(e)}`)
    } finally {
      this.initializationPromise = null
    }
  }

  private async refreshManagementSecuritySettingsInternal(): Promise<AppResult<ManagementSecuritySettings, AppError>> {
    const result = await this.managementSecuritySettingsApi.getManagementSecuritySettings()
    const mapped = mapSuccess(result, (payload) => toManagementSecuritySettings(payload))
    if (isSuccess(mapped)) {
      await this.applySettingsUpdate(mapped.data)
    }
    return mapped
  }

  private async applySettingsUpdate(managementSecuritySettings: ManagementSecuritySettings): Promise<void> {
    this.cachedSettings = managementSecuritySettings
    this.notifyListeners()
    try {
      await this.managementSecuritySettingsStorage.updateManagementSecuritySettings(managementSecuritySettings)
    } catch (e) {
      this.logger?.(`ManagementSecuritySettingsRepositoryImpl: Storage update failed - ${String(e)}`)
    }
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.cachedSettings)
      } catch (e) {
        this.logger?.(`ManagementSecuritySettingsRepositoryImpl: Listener error - ${String(e)}`)
      }
    }
  }

  private startWebSocketObservation(): void {
    if (!this.webSocketService) {
      return
    }

    this.webSocketService.observeEvents((frame: SocketFrame) => {
      if (frame.type === SecurityWebSocketEventTypes.MANAGEMENT_SECURITY_SETTINGS_UPDATED) {
        try {
          if (frame.payload) {
            const validationResult = managementSecuritySettingsPayloadSchema.safeParse(frame.payload)
            if (validationResult.success) {
              const settings = toManagementSecuritySettings(validationResult.data)
              void this.applySettingsUpdate(settings)
            } else {
              this.logger?.('ManagementSecuritySettingsRepositoryImpl: Invalid WS payload schema')
            }
          }
        } catch (e) {
          this.logger?.(`ManagementSecuritySettingsRepositoryImpl: WS event parsing failed - ${String(e)}`)
        }
      }
    })
  }
}
