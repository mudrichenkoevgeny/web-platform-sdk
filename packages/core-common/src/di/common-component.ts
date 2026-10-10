import type { EncryptedSettings } from '@/storage/encrypted-settings'
import type { CommonStorage } from '@/storage/common/common-storage'
import { EncryptedCommonStorage } from '@/storage/common/encrypted-common-storage'
import { getExternalLauncher } from '@/platform/external-launcher/external-launcher'
import type { ExternalLauncher } from '@/platform/external-launcher/external-launcher'
import { WebClientDeviceInfoProvider } from '@/platform/device-info/client-device-info-provider'
import type { ClientDeviceInfoProvider } from '@/platform/device-info/client-device-info-provider'
import { PlatformRepositoryImpl } from '@/platform/platform-repository'
import type { PlatformRepository } from "@/platform/platform-repository";
import { HttpClient } from '@/network/http-client/http-client'
import type { HttpClientConfigPlugin } from '@/network/http-client/http-client-config-plugin'
import type { AccessTokenProvider } from '@/network/provider/access-token-provider'
import type { WebSocketService } from '@/network/websocket/service/web-socket-service'
import { WebWebSocketService } from '@/network/websocket/service/web-web-socket-service'
import type { WebSocketMessageHandler } from '@/network/websocket/message-handler/web-socket-message-handler'
import { CommonWebSocketMessageHandler } from '@/network/websocket/message-handler/common-web-socket-message-handler'
import type { AppErrorParser } from '@/error/parser/app-error-parser'
import { AppErrorParserBuilder } from '@/error/parser/app-error-parser-builder'
import { CommonErrorParser } from '@/error/parser/common-error-parser'

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
  /** Optional custom client device information provider. Defaults to {@link WebClientDeviceInfoProvider}. */
  clientDeviceInfoProvider?: ClientDeviceInfoProvider
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
  /** Client device information metadata provider. */
  public readonly clientDeviceInfoProvider: ClientDeviceInfoProvider
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

    this.commonStorage = new EncryptedCommonStorage(this.encryptedSettings)
    this.externalLauncher = getExternalLauncher()

    this.clientDeviceInfoProvider =
      config.clientDeviceInfoProvider ??
      new WebClientDeviceInfoProvider(this.commonStorage, config.appVersion)

    this.platformRepository = new PlatformRepositoryImpl(
      this.clientDeviceInfoProvider,
      this.externalLauncher
    )

    this.httpClient = new HttpClient({
      baseUrl: config.baseUrl,
      clientDeviceInfoProvider: this.clientDeviceInfoProvider,
      plugins: config.httpClientConfigPlugins,
      customFetch: config.customFetch,
      logger: config.logger
    })

    this.commonWebSocketMessageHandler = new CommonWebSocketMessageHandler()

    this.webSocketService = new WebWebSocketService({
      baseUrl: config.baseUrl,
      webSocketPath: config.webSocketPath,
      accessTokenProvider: config.accessTokenProvider,
      clientDeviceInfoProvider: this.clientDeviceInfoProvider,
      webSocketFactory: config.webSocketFactory,
      logger: config.logger
    })
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
