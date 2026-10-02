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

export class CommonStorageModule {
  public readonly commonStorage: CommonStorage

  public constructor(encryptedSettings: EncryptedSettings) {
    this.commonStorage = new EncryptedCommonStorage(encryptedSettings)
  }
}

export class CommonPlatformModule {
  public readonly externalLauncher: ExternalLauncher

  public constructor() {
    this.externalLauncher = getExternalLauncher()
  }
}

export class CommonRepositoryModule {
  public readonly platformRepository: PlatformRepository

  public constructor(
    deviceInfoProvider: DeviceInfoProvider,
    externalLauncher: ExternalLauncher
  ) {
    this.platformRepository = new PlatformRepositoryImpl(deviceInfoProvider, externalLauncher)
  }
}

export interface CommonNetworkModuleConfig {
  baseUrl: string
  webSocketPath: string
  httpClientConfigPlugins?: HttpClientConfigPlugin[]
  accessTokenProvider: AccessTokenProvider
  deviceInfoProvider: DeviceInfoProvider
  customFetch?: typeof fetch
  webSocketFactory?: (url: string) => WebSocket
  logger?: (msg: string) => void
}

export class CommonNetworkModule {
  public readonly httpClient: HttpClient
  public readonly commonWebSocketMessageHandler: WebSocketMessageHandler
  public readonly webSocketService: WebSocketService

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
