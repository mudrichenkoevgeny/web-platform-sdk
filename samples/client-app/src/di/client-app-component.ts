import {
  OpenRefreshTokenRoutes,
  OpenSessionRoutes,
  WebSocketContract
} from '@mudrichenkoevgeny/shared-foundation'
import {
  CommonComponent,
  EncryptedSettingsComponent
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AccessTokenProvider,
  EncryptedSettings
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  SecurityComponent,
  SecurityErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { SettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { ClientUserComponent } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'
import type {
  AuthStorage,
  UserAuthServices
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import {
  AuthHttpClientConfigPlugin,
  DefaultMfaChallengeHandler,
  DisabledGoogleAuthService,
  EncryptedAuthStorage,
  MfaStepUpHttpClientConfigPlugin,
  UserErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ClientAppUseCaseModule } from '@/di/client-app-use-case-module'
import type { SyncDataUseCase } from '@/usecase/sync-data-use-case'

export interface ClientAppComponentConfig {
  baseUrl: string
  authServices?: UserAuthServices
  appVersion?: string
  mockCommonComponent?: CommonComponent
  mockSettingsComponent?: SettingsComponent
  mockSecurityComponent?: SecurityComponent
  mockClientUserComponent?: ClientUserComponent
}

/**
 * Sample host root DI container: builds encrypted storage, CommonComponent,
 * SettingsComponent, SecurityComponent, and ClientUserComponent.
 */
export class ClientAppComponent {
  private _isInitialized = false

  public readonly encryptedSettingsComponent: EncryptedSettingsComponent
  public readonly encryptedSettings: EncryptedSettings
  public readonly authStorage: AuthStorage
  public readonly mfaChallengeHandler: DefaultMfaChallengeHandler
  public readonly commonComponent: CommonComponent
  public readonly settingsComponent: SettingsComponent
  public readonly securityComponent: SecurityComponent
  public readonly clientUserComponent: ClientUserComponent
  private readonly clientAppUseCaseModule: ClientAppUseCaseModule

  public constructor(config: ClientAppComponentConfig) {
    const authServices = config.authServices ?? {
      googleAuth: new DisabledGoogleAuthService()
    }

    this.encryptedSettingsComponent = new EncryptedSettingsComponent()
    this.encryptedSettings = this.encryptedSettingsComponent.encryptedSettings

    this.authStorage = new EncryptedAuthStorage(this.encryptedSettings)

    this.mfaChallengeHandler = new DefaultMfaChallengeHandler()

    if (
      config.mockCommonComponent &&
      config.mockSettingsComponent &&
      config.mockSecurityComponent &&
      config.mockClientUserComponent
    ) {
      this.commonComponent = config.mockCommonComponent
      this.settingsComponent = config.mockSettingsComponent
      this.securityComponent = config.mockSecurityComponent
      this.clientUserComponent = config.mockClientUserComponent
      this._isInitialized = true
    } else {
      const authHttpClientConfigPlugin = new AuthHttpClientConfigPlugin({
        baseUrl: config.baseUrl,
        authStorage: this.authStorage,
        refreshTokenRoute: OpenRefreshTokenRoutes.REFRESH_TOKEN,
        onSessionCleared: () => {
          this.clientUserComponent.userRepository.clearSession()
        }
      })

      const mfaStepUpHttpClientConfigPlugin = new MfaStepUpHttpClientConfigPlugin({
        baseUrl: config.baseUrl,
        reauthenticateRoute: OpenSessionRoutes.REAUTHENTICATE_SESSION,
        mfaChallengeHandler: this.mfaChallengeHandler,
        reauthenticateAction: (mfaToken, code) =>
          this.clientUserComponent.reauthenticateSessionUseCase.execute(mfaToken, code)
      })

      this.commonComponent = new CommonComponent({
        encryptedSettings: this.encryptedSettings,
        baseUrl: config.baseUrl,
        webSocketPath: WebSocketContract.WS_OPEN_REALTIME_PATH,
        accessTokenProvider: this.authStorage as unknown as AccessTokenProvider,
        httpClientConfigPlugins: [
          authHttpClientConfigPlugin,
          mfaStepUpHttpClientConfigPlugin
        ],
        appVersion: config.appVersion
      })

      this.settingsComponent = new SettingsComponent({
        webSocketService: this.commonComponent.webSocketService,
        httpClient: this.commonComponent.httpClient,
        encryptedSettings: this.encryptedSettings
      })

      this.securityComponent = new SecurityComponent({
        webSocketService: this.commonComponent.webSocketService,
        httpClient: this.commonComponent.httpClient,
        encryptedSettings: this.encryptedSettings
      })

      this.clientUserComponent = new ClientUserComponent({
        commonComponent: this.commonComponent,
        settingsComponent: this.settingsComponent,
        securityComponent: this.securityComponent,
        authStorage: this.authStorage,
        authServices
      })
    }

    this.clientAppUseCaseModule = new ClientAppUseCaseModule(
      this.clientUserComponent.refreshUserConfigurationUseCase
    )
  }

  /**
   * Indicates whether the application graph has been initialized.
   */
  public get isInitialized(): boolean {
    return this._isInitialized
  }

  /**
   * Atomic use case for refreshing full user state.
   */
  public get refreshUserConfigurationUseCase() {
    return this.clientUserComponent.refreshUserConfigurationUseCase
  }

  /**
   * Concurrent sync operation for all settings modules.
   */
  public get syncDataUseCase(): SyncDataUseCase {
    return this.clientAppUseCaseModule.syncDataUseCase
  }

  /**
   * Registers feature error parsers and the combined WebSocket handler list on the shared socket service,
   * then sets {@link isInitialized} to true. Safe to call once; subsequent calls are no-ops.
   */
  public init(): void {
    if (this._isInitialized) {
      return
    }

    this.commonComponent.init(undefined, [
      new SecurityErrorParser(),
      new UserErrorParser()
    ])

    const handlers = [
      this.commonComponent.commonWebSocketMessageHandler,
      this.settingsComponent.settingsWebSocketMessageHandler,
      this.securityComponent.securityWebSocketMessageHandler,
      this.clientUserComponent.userWebSocketMessageHandler
    ]

    this.commonComponent.webSocketService.updateWebSocketMessageHandlers(handlers)
    this._isInitialized = true
  }
}
