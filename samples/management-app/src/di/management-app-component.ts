import {
  CompositeAuditActionTypeParser,
  CompositeAuditMetadataKeyParser,
  CompositeAuditResourceTypeParser,
  SelfManagementRefreshTokenRoutes,
  SelfManagementSessionRoutes,
  WebSocketContract
} from '@mudrichenkoevgeny/shared-foundation'
import {
  CommonComponent,
  EncryptedSettingsComponent
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  EncryptedSettings
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  SecurityComponent,
  SecurityErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { SettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { ManagementUserComponent } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
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
import { ManagementAppUseCaseModule } from '@/di/management-app-use-case-module'
import type { SyncManagementDataUseCase } from '@/usecase/sync-management-data-use-case'

export interface ManagementAppComponentConfig {
  baseUrl: string
  compositeActionTypeParser: CompositeAuditActionTypeParser
  compositeResourceTypeParser: CompositeAuditResourceTypeParser
  compositeMetadataKeyParser: CompositeAuditMetadataKeyParser
  authServices?: UserAuthServices
  appVersion?: string
  mockCommonComponent?: CommonComponent
  mockSettingsComponent?: SettingsComponent
  mockSecurityComponent?: SecurityComponent
  mockManagementUserComponent?: ManagementUserComponent
}

/**
 * Sample management host root DI container: builds encrypted storage, CommonComponent,
 * SettingsComponent, SecurityComponent, and ManagementUserComponent.
 */
export class ManagementAppComponent {
  private _isInitialized = false

  public readonly encryptedSettingsComponent: EncryptedSettingsComponent
  public readonly encryptedSettings: EncryptedSettings
  public readonly authStorage: AuthStorage
  public readonly mfaChallengeHandler: DefaultMfaChallengeHandler
  public readonly commonComponent: CommonComponent
  public readonly settingsComponent: SettingsComponent
  public readonly securityComponent: SecurityComponent
  public readonly managementUserComponent: ManagementUserComponent
  private readonly managementAppUseCaseModule: ManagementAppUseCaseModule

  public constructor(config: ManagementAppComponentConfig) {
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
      config.mockManagementUserComponent
    ) {
      this.commonComponent = config.mockCommonComponent
      this.settingsComponent = config.mockSettingsComponent
      this.securityComponent = config.mockSecurityComponent
      this.managementUserComponent = config.mockManagementUserComponent
      this._isInitialized = true
    } else {
      const authHttpClientConfigPlugin = new AuthHttpClientConfigPlugin({
        baseUrl: config.baseUrl,
        authStorage: this.authStorage,
        refreshTokenRoute: SelfManagementRefreshTokenRoutes.REFRESH_TOKEN,
        onSessionCleared: () => {
          this.managementUserComponent.selfManagementUserRepository.clearSession()
        }
      })

      const mfaStepUpHttpClientConfigPlugin = new MfaStepUpHttpClientConfigPlugin({
        baseUrl: config.baseUrl,
        reauthenticateRoute: SelfManagementSessionRoutes.REAUTHENTICATE_SESSION,
        mfaChallengeHandler: this.mfaChallengeHandler,
        reauthenticateAction: (mfaToken, code) =>
          this.managementUserComponent.reauthenticateSessionUseCase.execute(mfaToken, code)
      })

      this.commonComponent = new CommonComponent({
        encryptedSettings: this.encryptedSettings,
        baseUrl: config.baseUrl,
        webSocketPath: WebSocketContract.WS_MANAGEMENT_REALTIME_PATH,
        accessTokenProvider: this.authStorage,
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

      this.managementUserComponent = new ManagementUserComponent({
        commonComponent: this.commonComponent,
        settingsComponent: this.settingsComponent,
        securityComponent: this.securityComponent,
        authStorage: this.authStorage,
        authServices,
        compositeActionTypeParser: config.compositeActionTypeParser,
        compositeResourceTypeParser: config.compositeResourceTypeParser,
        compositeMetadataKeyParser: config.compositeMetadataKeyParser
      })
    }

    this.managementAppUseCaseModule = new ManagementAppUseCaseModule(
      this.managementUserComponent.refreshManagementGlobalSettingsUseCase,
      this.managementUserComponent.refreshManagementSecuritySettingsUseCase,
      this.managementUserComponent.refreshManagementAuthSettingsUseCase
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
    return this.managementUserComponent.refreshUserConfigurationUseCase
  }

  /**
   * Concurrent sync operation for all settings modules.
   */
  public get syncManagementDataUseCase(): SyncManagementDataUseCase {
    return this.managementAppUseCaseModule.syncManagementDataUseCase
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
      this.managementUserComponent.userWebSocketMessageHandler
    ]

    this.commonComponent.webSocketService.updateWebSocketMessageHandlers(handlers)
    this._isInitialized = true
  }
}
