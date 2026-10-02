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

export interface CommonComponentConfig {
  encryptedSettings: EncryptedSettings
  baseUrl: string
  webSocketPath: string
  accessTokenProvider: AccessTokenProvider
  deviceInfoProvider?: DeviceInfoProvider
  appVersion?: string
  httpClientConfigPlugins?: HttpClientConfigPlugin[]
  customFetch?: typeof fetch
  webSocketFactory?: (url: string) => WebSocket
  logger?: (msg: string) => void
}

export class CommonComponent {
  public readonly encryptedSettings: EncryptedSettings
  public readonly commonStorage: CommonStorage
  public readonly externalLauncher: ExternalLauncher
  public readonly deviceInfoProvider: DeviceInfoProvider
  public readonly platformRepository: PlatformRepository
  public readonly httpClient: HttpClient
  public readonly webSocketService: WebSocketService
  public readonly commonWebSocketMessageHandler: WebSocketMessageHandler

  private _appErrorParser: AppErrorParser | null = null

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

  public get appErrorParser(): AppErrorParser {
    if (!this._appErrorParser) {
      throw new Error('AppErrorParser not initialized! Call init() first.')
    }
    return this._appErrorParser
  }

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
