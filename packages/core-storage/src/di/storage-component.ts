import type { EncryptedSettings, HttpClient, WebSocketService } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettingsStorage } from '@/storage/open/open-storage-settings-storage'
import { EncryptedOpenStorageSettingsStorage } from '@/storage/open/encrypted-open-storage-settings-storage'
import type { ManagementStorageSettingsStorage } from '@/storage/management/management-storage-settings-storage'
import { EncryptedManagementStorageSettingsStorage } from '@/storage/management/encrypted-management-storage-settings-storage'
import type { OpenStorageSettingsApi } from '@/network/api/open/open-storage-settings-api'
import { FetchOpenStorageSettingsApi } from '@/network/api/open/fetch-open-storage-settings-api'
import type { ManagementStorageSettingsApi } from '@/network/api/management/management-storage-settings-api'
import { FetchManagementStorageSettingsApi } from '@/network/api/management/fetch-management-storage-settings-api'
import type { OpenStorageSettingsRepository } from '@/repository/open/open-storage-settings-repository'
import { OpenStorageSettingsRepositoryImpl } from '@/repository/open/open-storage-settings-repository-impl'
import type { ManagementStorageSettingsRepository } from '@/repository/management/management-storage-settings-repository'
import { ManagementStorageSettingsRepositoryImpl } from '@/repository/management/management-storage-settings-repository-impl'
import { GetOpenStorageSettingsUseCase } from '@/usecase/open/get-open-storage-settings-use-case'
import { RefreshOpenStorageSettingsUseCase } from '@/usecase/open/refresh-open-storage-settings-use-case'
import { ObserveOpenStorageSettingsUseCase } from '@/usecase/open/observe-open-storage-settings-use-case'
import { GetManagementStorageSettingsUseCase } from '@/usecase/management/get-management-storage-settings-use-case'
import { RefreshManagementStorageSettingsUseCase } from '@/usecase/management/refresh-management-storage-settings-use-case'
import { ResetManagementStorageSettingsUseCase } from '@/usecase/management/reset-management-storage-settings-use-case'
import { UpdateManagementStorageSettingsUseCase } from '@/usecase/management/update-management-storage-settings-use-case'
import { ObserveManagementStorageSettingsUseCase } from '@/usecase/management/observe-management-storage-settings-use-case'
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
  /** Optional mock overrides for tests. */
  managementStorageSettingsApi?: ManagementStorageSettingsApi
  /** Optional mock overrides for tests. */
  managementStorageSettingsStorage?: ManagementStorageSettingsStorage
}

/**
 * Root dependency injection container for `core-storage` module.
 *
 * Assembles storage, networking, repositories, and settings-related use cases.
 */
export class StorageComponent {
  /** Core persistence interface for open storage settings. */
  public readonly storageSettingsStorage: OpenStorageSettingsStorage
  /** Core persistence interface for management storage settings. */
  public readonly managementStorageSettingsStorage: ManagementStorageSettingsStorage
  /** HTTP REST client API for open storage settings. */
  public readonly openStorageSettingsApi: OpenStorageSettingsApi
  /** HTTP REST client API for management storage settings. */
  public readonly managementStorageSettingsApi: ManagementStorageSettingsApi
  /** Central repository for open storage settings. */
  public readonly storageSettingsRepository: OpenStorageSettingsRepository
  /** Central repository for management storage settings. */
  public readonly managementStorageSettingsRepository: ManagementStorageSettingsRepository
  /** Use case for retrieving current open storage settings. */
  public readonly getOpenStorageSettingsUseCase: GetOpenStorageSettingsUseCase
  /** Use case for forcing a network refresh of open storage settings. */
  public readonly refreshOpenStorageSettingsUseCase: RefreshOpenStorageSettingsUseCase
  /** Use case for observing live open storage settings changes. */
  public readonly observeOpenStorageSettingsUseCase: ObserveOpenStorageSettingsUseCase
  /** Use case for retrieving current management storage settings. */
  public readonly getManagementStorageSettingsUseCase: GetManagementStorageSettingsUseCase
  /** Use case for forcing a network refresh of management storage settings. */
  public readonly refreshManagementStorageSettingsUseCase: RefreshManagementStorageSettingsUseCase
  /** Use case for resetting management storage settings. */
  public readonly resetManagementStorageSettingsUseCase: ResetManagementStorageSettingsUseCase
  /** Use case for updating management storage settings. */
  public readonly updateManagementStorageSettingsUseCase: UpdateManagementStorageSettingsUseCase
  /** Use case for observing live management storage settings changes. */
  public readonly observeManagementStorageSettingsUseCase: ObserveManagementStorageSettingsUseCase
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

    this.managementStorageSettingsStorage =
      config.managementStorageSettingsStorage ??
      new EncryptedManagementStorageSettingsStorage(config.encryptedSettings)

    this.openStorageSettingsApi =
      config.openStorageSettingsApi ??
      new FetchOpenStorageSettingsApi(config.httpClient)

    this.managementStorageSettingsApi =
      config.managementStorageSettingsApi ??
      new FetchManagementStorageSettingsApi(config.httpClient)

    this.storageSettingsRepository = new OpenStorageSettingsRepositoryImpl(
      this.openStorageSettingsApi,
      this.storageSettingsStorage,
      config.webSocketService
    )

    this.managementStorageSettingsRepository = new ManagementStorageSettingsRepositoryImpl(
      this.managementStorageSettingsApi,
      this.managementStorageSettingsStorage,
      config.webSocketService
    )

    this.getOpenStorageSettingsUseCase = new GetOpenStorageSettingsUseCase(
      this.storageSettingsRepository
    )

    this.refreshOpenStorageSettingsUseCase = new RefreshOpenStorageSettingsUseCase(
      this.storageSettingsRepository
    )

    this.observeOpenStorageSettingsUseCase = new ObserveOpenStorageSettingsUseCase(
      this.storageSettingsRepository
    )

    this.getManagementStorageSettingsUseCase = new GetManagementStorageSettingsUseCase(
      this.managementStorageSettingsRepository
    )

    this.refreshManagementStorageSettingsUseCase = new RefreshManagementStorageSettingsUseCase(
      this.managementStorageSettingsRepository
    )

    this.resetManagementStorageSettingsUseCase = new ResetManagementStorageSettingsUseCase(
      this.managementStorageSettingsRepository
    )

    this.updateManagementStorageSettingsUseCase = new UpdateManagementStorageSettingsUseCase(
      this.managementStorageSettingsRepository
    )

    this.observeManagementStorageSettingsUseCase = new ObserveManagementStorageSettingsUseCase(
      this.managementStorageSettingsRepository
    )

    this.storageWebSocketMessageHandler = new StorageWebSocketMessageHandler()
  }
}
