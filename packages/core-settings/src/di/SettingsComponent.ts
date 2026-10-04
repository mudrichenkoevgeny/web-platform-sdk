import type { EncryptedSettings, HttpClient, WebSocketService } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenGlobalSettingsStorage } from '@/storage/globalsettings/OpenGlobalSettingsStorage'
import { EncryptedOpenGlobalSettingsStorage } from '@/storage/globalsettings/EncryptedOpenGlobalSettingsStorage'
import type { OpenGlobalSettingsApi } from '@/network/globalsettings/OpenGlobalSettingsApi'
import { FetchOpenGlobalSettingsApi } from '@/network/globalsettings/FetchOpenGlobalSettingsApi'
import type { OpenGlobalSettingsRepository } from '@/repository/OpenGlobalSettingsRepository'
import { OpenGlobalSettingsRepositoryImpl } from '@/repository/OpenGlobalSettingsRepositoryImpl'
import { GetOpenGlobalSettingsUseCase } from '@/usecase/GetOpenGlobalSettingsUseCase'
import { RefreshOpenGlobalSettingsUseCase } from '@/usecase/RefreshOpenGlobalSettingsUseCase'
import { SettingsWebSocketMessageHandler } from '@/network/websockets/messagehandler/SettingsWebSocketMessageHandler'

/**
 * Configuration options required to instantiate {@link SettingsComponent}.
 */
export interface SettingsComponentConfig {
  /** Global WebSocket service. */
  webSocketService: WebSocketService
  /** Pre-configured HTTP client for REST calls. */
  httpClient: HttpClient
  /** Encrypted storage backend. */
  encryptedSettings: EncryptedSettings
  /** Optional mock overrides for tests. */
  openGlobalSettingsApi?: OpenGlobalSettingsApi
  /** Optional mock overrides for tests. */
  openGlobalSettingsStorage?: OpenGlobalSettingsStorage
}

/**
 * Root dependency injection container for `core-settings` module.
 *
 * Assembles storage, networking, repositories, and settings-related use cases.
 */
export class SettingsComponent {
  /** Core persistence interface for open global settings. */
  public readonly globalSettingsStorage: OpenGlobalSettingsStorage
  /** HTTP REST client API for open global settings. */
  public readonly openGlobalSettingsApi: OpenGlobalSettingsApi
  /** Central repository for open global settings. */
  public readonly globalSettingsRepository: OpenGlobalSettingsRepository
  /** Use case for retrieving current global settings. */
  public readonly getOpenGlobalSettingsUseCase: GetOpenGlobalSettingsUseCase
  /** Use case for forcing a network refresh of settings. */
  public readonly refreshOpenGlobalSettingsUseCase: RefreshOpenGlobalSettingsUseCase
  /** Handler offered to the shared WebSocket pipeline. */
  public readonly settingsWebSocketMessageHandler: SettingsWebSocketMessageHandler

  /**
   * Constructs a new {@link SettingsComponent}.
   *
   * @param config - Container configuration holding global SDK dependencies
   */
  public constructor(config: SettingsComponentConfig) {
    this.globalSettingsStorage =
      config.openGlobalSettingsStorage ??
      new EncryptedOpenGlobalSettingsStorage(config.encryptedSettings)

    this.openGlobalSettingsApi =
      config.openGlobalSettingsApi ??
      new FetchOpenGlobalSettingsApi(config.httpClient)

    this.globalSettingsRepository = new OpenGlobalSettingsRepositoryImpl(
      this.openGlobalSettingsApi,
      this.globalSettingsStorage,
      config.webSocketService
    )

    this.getOpenGlobalSettingsUseCase = new GetOpenGlobalSettingsUseCase(
      this.globalSettingsRepository
    )

    this.refreshOpenGlobalSettingsUseCase = new RefreshOpenGlobalSettingsUseCase(
      this.globalSettingsRepository
    )

    this.settingsWebSocketMessageHandler = new SettingsWebSocketMessageHandler()
  }
}
