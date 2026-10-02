import { EncryptedSettings } from '../storage/EncryptedSettings'
import { CommonStorage } from '../storage/common/CommonStorage'
import { EncryptedCommonStorage } from '../storage/common/EncryptedCommonStorage'
import { ExternalLauncher, getExternalLauncher } from '../platform/externallauncher/ExternalLauncher'
import { DeviceInfoProvider } from '../platform/deviceinfo/DeviceInfoProvider'
import { PlatformRepository, PlatformRepositoryImpl } from '../platform/PlatformRepository'
import { HttpClient } from '../network/httpclient/HttpClient'
import { HttpClientConfigPlugin } from '../network/httpclient/HttpClientConfigPlugin'
import { AccessTokenProvider } from '../network/provider/AccessTokenProvider'
import { WebSocketService } from '../network/websocket/service/WebSocketService'
import { WebWebSocketService } from '../network/websocket/service/WebWebSocketService'
import { WebSocketMessageHandler } from '../network/websocket/messagehandler/WebSocketMessageHandler'
import { CommonWebSocketMessageHandler } from '../network/websocket/messagehandler/CommonWebSocketMessageHandler'

/**
 * Module responsible for instantiating storage dependencies.
 */
export class CommonStorageModule {
  /** Initialized common storage instance. */
  public readonly commonStorage: CommonStorage

  /**
   * Constructs a new {@link CommonStorageModule}.
   *
   * @param encryptedSettings - Encrypted settings store
   */
  public constructor(encryptedSettings: EncryptedSettings) {
    this.commonStorage = new EncryptedCommonStorage(encryptedSettings)
  }
}

/**
 * Module responsible for instantiating platform integration services.
 */
export class CommonPlatformModule {
  /** External launcher service instance. */
  public readonly externalLauncher: ExternalLauncher

  /**
   * Constructs a new {@link CommonPlatformModule}.
   */
  public constructor() {
    this.externalLauncher = getExternalLauncher()
  }
}

/**
 * Module responsible for assembling platform repositories.
 */
export class CommonRepositoryModule {
  /** Platform repository implementation instance. */
  public readonly platformRepository: PlatformRepository

  /**
   * Constructs a new {@link CommonRepositoryModule}.
   *
   * @param deviceInfoProvider - Device information provider
   * @param externalLauncher - External launcher service
   */
  public constructor(
    deviceInfoProvider: DeviceInfoProvider,
    externalLauncher: ExternalLauncher
  ) {
    this.platformRepository = new PlatformRepositoryImpl(deviceInfoProvider, externalLauncher)
  }
}

/**
 * Configuration options for {@link CommonNetworkModule}.
 */
export interface CommonNetworkModuleConfig {
  /** Base URL for HTTP REST API requests. */
  baseUrl: string
  /** WebSocket endpoint path. */
  webSocketPath: string
  /** Optional HTTP client configuration plugins. */
  httpClientConfigPlugins?: HttpClientConfigPlugin[]
  /** Access token provider for network authorization. */
  accessTokenProvider: AccessTokenProvider
  /** Device information provider. */
  deviceInfoProvider: DeviceInfoProvider
  /** Optional custom fetch implementation. */
  customFetch?: typeof fetch
  /** Optional custom WebSocket constructor factory. */
  webSocketFactory?: (url: string) => WebSocket
  /** Optional logging callback function. */
  logger?: (msg: string) => void
}

/**
 * Module responsible for constructing network clients and services.
 */
export class CommonNetworkModule {
  /** Configured HTTP client instance. */
  public readonly httpClient: HttpClient
  /** Base WebSocket message handler. */
  public readonly commonWebSocketMessageHandler: WebSocketMessageHandler
  /** WebSocket service instance. */
  public readonly webSocketService: WebSocketService

  /**
   * Constructs a new {@link CommonNetworkModule}.
   *
   * @param config - Configuration options for network services
   */
  public constructor(config: CommonNetworkModuleConfig) {
    this.httpClient = new HttpClient({
      baseUrl: config.baseUrl,
      deviceInfoProvider: config.deviceInfoProvider,
      plugins: config.httpClientConfigPlugins,
      customFetch: config.customFetch,
      logger: config.logger
    })

    this.commonWebSocketMessageHandler = new CommonWebSocketMessageHandler()

    this.webSocketService = new WebWebSocketService({
      baseUrl: config.baseUrl,
      webSocketPath: config.webSocketPath,
      accessTokenProvider: config.accessTokenProvider,
      deviceInfoProvider: config.deviceInfoProvider,
      webSocketFactory: config.webSocketFactory,
      logger: config.logger
    })
  }
}
