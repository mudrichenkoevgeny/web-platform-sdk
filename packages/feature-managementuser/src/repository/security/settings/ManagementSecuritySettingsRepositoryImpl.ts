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
import type { ManagementSecuritySettingsApi } from '@/network/api/security/settings/ManagementSecuritySettingsApi'
import type { ManagementSecuritySettingsStorage } from '@/storage/securitysettings/ManagementSecuritySettingsStorage'
import type { ManagementSecuritySettingsRepository } from '@/repository/security/settings/ManagementSecuritySettingsRepository'

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
 * Implementation of {@link ManagementSecuritySettingsRepository} backing in-memory flow, {@link ManagementSecuritySettingsStorage},
 * REST updates via {@link ManagementSecuritySettingsApi}, and WebSocket events for live changes.
 */
export class ManagementSecuritySettingsRepositoryImpl implements ManagementSecuritySettingsRepository {
  private cachedSettings: ManagementSecuritySettings | null = null
  private readonly listeners = new Set<(settings: ManagementSecuritySettings | null) => void>()
  private readonly mutex = new AsyncMutex()
  private initializationPromise: Promise<void> | null = null

  /**
   * Constructs a new {@link ManagementSecuritySettingsRepositoryImpl}.
   *
   * @param managementSecuritySettingsApi - Remote REST endpoint for management security settings
   * @param managementSecuritySettingsStorage - Encrypted or local persistence for settings snapshots
   * @param webSocketService - Optional WebSocket service for receiving real-time updates
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
  ): Promise<AppResult<void, AppError>> {
    return this.mutex.runExclusive(async () => {
      const payload = toManagementSecuritySettingsPayload(securitySettings)
      const result = await this.managementSecuritySettingsApi.updateManagementSecuritySettings(payload)
      if (isSuccess(result)) {
        await this.applySettingsUpdate(securitySettings)
      }
      return result
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

  private async applySettingsUpdate(securitySettings: ManagementSecuritySettings): Promise<void> {
    this.cachedSettings = securitySettings
    this.notifyListeners()
    try {
      await this.managementSecuritySettingsStorage.updateManagementSecuritySettings(securitySettings)
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
              void this.updateManagementSecuritySettings(settings)
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
