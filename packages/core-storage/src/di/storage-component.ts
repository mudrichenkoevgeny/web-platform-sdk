import type { EncryptedSettings, HttpClient, WebSocketService } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettingsStorage } from '@/storage/storage-settings/open-storage-settings-storage'
import { EncryptedOpenStorageSettingsStorage } from '@/storage/storage-settings/encrypted-open-storage-settings-storage'
import type { OpenStorageSettingsApi } from '@/network/api/storage-settings/open-storage-settings-api'
import { FetchOpenStorageSettingsApi } from '@/network/api/storage-settings/fetch-open-storage-settings-api'
import type { OpenStorageSettingsRepository } from '@/repository/storage-settings/open-storage-settings-repository'
import { OpenStorageSettingsRepositoryImpl } from '@/repository/storage-settings/open-storage-settings-repository-impl'
import { GetOpenStorageSettingsUseCase } from '@/usecase/storage-settings/get-open-storage-settings-use-case'
import { RefreshOpenStorageSettingsUseCase } from '@/usecase/storage-settings/refresh-open-storage-settings-use-case'
import { StorageWebSocketMessageHandler } from '@/network/websocket/message-handler/storage-web-socket-message-handler'

/**
 * Configuration options required to instantiate {@link StorageComponent}.
 */
export interface StorageComponentConfig {
  /** Global WebSocket service. */
  webSocketService: WebSocketService
  /** Pre-configured HTTP client for REST calls. */
  httpClient: HttpClient
  /** Encrypted storage backend. */
  encryptedSettings: EncryptedSettings
  /** Optional mock overrides for tests. */
  openStorageSettingsApi?: OpenStorageSettingsApi
  /** Optional mock overrides for tests. */
  openStorageSettingsStorage?: OpenStorageSettingsStorage
}

/**
 * Root dependency injection container for `core-storage` module.
 *
 * Assembles storage, networking, repositories, and settings-related use cases.
 */
export class StorageComponent {
  /** Core persistence interface for open storage settings. */
  public readonly storageSettingsStorage: OpenStorageSettingsStorage
  /** HTTP REST client API for open storage settings. */
  public readonly openStorageSettingsApi: OpenStorageSettingsApi
  /** Central repository for open storage settings. */
  public readonly storageSettingsRepository: OpenStorageSettingsRepository
  /** Use case for retrieving current open storage settings. */
  public readonly getOpenStorageSettingsUseCase: GetOpenStorageSettingsUseCase
  /** Use case for forcing a network refresh of open storage settings. */
  public readonly refreshOpenStorageSettingsUseCase: RefreshOpenStorageSettingsUseCase
  /** Handler offered to the shared WebSocket pipeline. */
  public readonly storageWebSocketMessageHandler: StorageWebSocketMessageHandler

  /**
   * Constructs a new {@link StorageComponent}.
   *
   * @param config - Container configuration holding global SDK dependencies
   */
  public constructor(config: StorageComponentConfig) {
    this.storageSettingsStorage =
      config.openStorageSettingsStorage ??
      new EncryptedOpenStorageSettingsStorage(config.encryptedSettings)

    this.openStorageSettingsApi =
      config.openStorageSettingsApi ??
      new FetchOpenStorageSettingsApi(config.httpClient)

    this.storageSettingsRepository = new OpenStorageSettingsRepositoryImpl(
      this.openStorageSettingsApi,
      this.storageSettingsStorage,
      config.webSocketService
    )

    this.getOpenStorageSettingsUseCase = new GetOpenStorageSettingsUseCase(
      this.storageSettingsRepository
    )

    this.refreshOpenStorageSettingsUseCase = new RefreshOpenStorageSettingsUseCase(
      this.storageSettingsRepository
    )

    this.storageWebSocketMessageHandler = new StorageWebSocketMessageHandler()
  }
}
