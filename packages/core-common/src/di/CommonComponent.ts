import { EncryptedSettings } from '../storage/EncryptedSettings'
import { CommonStorage } from '../storage/common/CommonStorage'
import { ExternalLauncher } from '../platform/externallauncher/ExternalLauncher'
import { DeviceInfoProvider, WebDeviceInfoProvider } from '../platform/deviceinfo/DeviceInfoProvider'
import { PlatformRepository } from '../platform/PlatformRepository'
import { HttpClient } from '../network/httpclient/HttpClient'
import { HttpClientConfigPlugin } from '../network/httpclient/HttpClientConfigPlugin'
import { AccessTokenProvider } from '../network/provider/AccessTokenProvider'
import { WebSocketService } from '../network/websocket/service/WebSocketService'
import { WebSocketMessageHandler } from '../network/websocket/messagehandler/WebSocketMessageHandler'
import { AppErrorParser } from '../error/parser/AppErrorParser'
import { AppErrorParserBuilder } from '../error/parser/AppErrorParserBuilder'
import { CommonErrorParser } from '../error/parser/CommonErrorParser'
import {
  CommonStorageModule,
  CommonPlatformModule,
  CommonRepositoryModule,
  CommonNetworkModule
} from './CommonModules'

/**
 * Configuration options required to instantiate {@link CommonComponent}.
 */
export interface CommonComponentConfig {
  /** Encrypted settings instance used for secure key-value storage. */
  encryptedSettings: EncryptedSettings
  /** Base HTTP URL for API calls. */
  baseUrl: string
  /** WebSocket endpoint path. */
  webSocketPath: string
  /** Access token provider for network authorization. */
  accessTokenProvider: AccessTokenProvider
  /** Optional custom device information provider. Defaults to {@link WebDeviceInfoProvider}. */
  deviceInfoProvider?: DeviceInfoProvider
  /** Optional application version string. Defaults to '1.0.0'. */
  appVersion?: string
  /** Optional array of HTTP client configuration plugins. */
  httpClientConfigPlugins?: HttpClientConfigPlugin[]
  /** Optional custom fetch implementation. */
  customFetch?: typeof fetch
  /** Optional custom WebSocket factory function. */
  webSocketFactory?: (url: string) => WebSocket
  /** Optional logger function for network and system diagnostics. */
  logger?: (msg: string) => void
}

/**
 * Core Dependency Injection container for common SDK services and repositories.
 */
export class CommonComponent {
  /** Encrypted key-value settings manager. */
  public readonly encryptedSettings: EncryptedSettings
  /** Common SDK storage provider. */
  public readonly commonStorage: CommonStorage
  /** Launcher for external links and system integrations. */
  public readonly externalLauncher: ExternalLauncher
  /** Device information metadata provider. */
  public readonly deviceInfoProvider: DeviceInfoProvider
  /** Repository for client platform capabilities. */
  public readonly platformRepository: PlatformRepository
  /** Pre-configured HTTP client instance. */
  public readonly httpClient: HttpClient
  /** WebSocket client service manager. */
  public readonly webSocketService: WebSocketService
  /** Base WebSocket message handler for framework frames. */
  public readonly commonWebSocketMessageHandler: WebSocketMessageHandler

  private _appErrorParser: AppErrorParser | null = null

  /**
   * Constructs a new {@link CommonComponent} DI container.
   *
   * @param config - Configuration options for initializing core services
   */
  public constructor(config: CommonComponentConfig) {
    this.encryptedSettings = config.encryptedSettings

    const storageModule = new CommonStorageModule(this.encryptedSettings)
    this.commonStorage = storageModule.commonStorage

    const platformModule = new CommonPlatformModule()
    this.externalLauncher = platformModule.externalLauncher

    this.deviceInfoProvider =
      config.deviceInfoProvider ??
      new WebDeviceInfoProvider(this.commonStorage, config.appVersion)

    const repositoryModule = new CommonRepositoryModule(
      this.deviceInfoProvider,
      this.externalLauncher
    )
    this.platformRepository = repositoryModule.platformRepository

    const networkModule = new CommonNetworkModule({
      baseUrl: config.baseUrl,
      webSocketPath: config.webSocketPath,
      httpClientConfigPlugins: config.httpClientConfigPlugins,
      accessTokenProvider: config.accessTokenProvider,
      deviceInfoProvider: this.deviceInfoProvider,
      customFetch: config.customFetch,
      webSocketFactory: config.webSocketFactory,
      logger: config.logger
    })

    this.httpClient = networkModule.httpClient
    this.webSocketService = networkModule.webSocketService
    this.commonWebSocketMessageHandler = networkModule.commonWebSocketMessageHandler
  }

  /**
   * Retrieves the initialized {@link AppErrorParser}.
   *
   * @returns Resolved application error parser
   * @throws Error if {@link init} has not been called prior to access
   */
  public get appErrorParser(): AppErrorParser {
    if (!this._appErrorParser) {
      throw new Error('AppErrorParser not initialized! Call init() first.')
    }
    return this._appErrorParser
  }

  /**
   * Initializes the Chain of Responsibility error parser.
   *
   * @param appErrorParserCommonParser - Fallback common error parser instance
   * @param appErrorParserSpecificParsers - Array of domain-specific error parsers
   */
  public init(
    appErrorParserCommonParser: AppErrorParser = new CommonErrorParser(),
    appErrorParserSpecificParsers: AppErrorParser[] = []
  ): void {
    this._appErrorParser = AppErrorParserBuilder.build(
      appErrorParserCommonParser,
      appErrorParserSpecificParsers
    )
  }
}
