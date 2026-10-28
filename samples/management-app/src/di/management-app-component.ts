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
import { StorageComponent, StorageErrorParser } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
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
  UserErrorParser,
  WebGoogleAuthService
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementAppUseCaseModule } from '@/di/management-app-use-case-module'
import type { SyncManagementDataUseCase } from '@/usecase/sync-management-data-use-case'

export interface ManagementAppComponentConfig {
  baseUrl: string
  googleClientId?: string
  compositeActionTypeParser: CompositeAuditActionTypeParser
  compositeResourceTypeParser: CompositeAuditResourceTypeParser
  compositeMetadataKeyParser: CompositeAuditMetadataKeyParser
  authServices?: UserAuthServices
  appVersion?: string
  apiVersion?: string
  mockCommonComponent?: CommonComponent
  mockSettingsComponent?: SettingsComponent
  mockSecurityComponent?: SecurityComponent
  mockStorageComponent?: StorageComponent
  mockManagementUserComponent?: ManagementUserComponent
}

/**
 * Sample management host root DI container: builds encrypted storage, CommonComponent,
 * SettingsComponent, SecurityComponent, StorageComponent, and ManagementUserComponent.
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
  public readonly storageComponent: StorageComponent
  public readonly managementUserComponent: ManagementUserComponent
  private readonly managementAppUseCaseModule: ManagementAppUseCaseModule

  public constructor(config: ManagementAppComponentConfig) {
    const googleClientId =
      config.googleClientId ??
      (typeof import.meta !== 'undefined'
        ? (import.meta.env.GOOGLE_WEB_CLIENT_ID ?? import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID ?? import.meta.env.VITE_GOOGLE_CLIENT_ID)
        : undefined)

    const googleAuth =
      config.authServices?.googleAuth ??
      (googleClientId && googleClientId.trim().length > 0
        ? new WebGoogleAuthService(googleClientId)
        : new DisabledGoogleAuthService())

    const authServices: UserAuthServices = {
      ...config.authServices,
      googleAuth
    }

    this.encryptedSettingsComponent = new EncryptedSettingsComponent()
    this.encryptedSettings = this.encryptedSettingsComponent.encryptedSettings

    this.authStorage = new EncryptedAuthStorage(this.encryptedSettings)

    this.mfaChallengeHandler = new DefaultMfaChallengeHandler()

    if (
      config.mockCommonComponent &&
      config.mockSettingsComponent &&
      config.mockSecurityComponent &&
      config.mockStorageComponent &&
      config.mockManagementUserComponent
    ) {
      this.commonComponent = config.mockCommonComponent
      this.settingsComponent = config.mockSettingsComponent
      this.securityComponent = config.mockSecurityComponent
      this.storageComponent = config.mockStorageComponent
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
          this.managementUserComponent.selfManagementSessionRepository.reauthenticateSession(mfaToken, code)
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
        appVersion: config.appVersion,
        apiVersion: config.apiVersion
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

      this.storageComponent = new StorageComponent({
        webSocketService: this.commonComponent.webSocketService,
        httpClient: this.commonComponent.httpClient,
        encryptedSettings: this.encryptedSettings
      })

      this.managementUserComponent = new ManagementUserComponent({
        commonComponent: this.commonComponent,
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
  public get refreshManagementUserConfigurationUseCase() {
    return this.managementUserComponent.refreshManagementUserConfigurationUseCase
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
      new UserErrorParser(),
      new StorageErrorParser()
    ])

    const handlers = [
      this.commonComponent.commonWebSocketMessageHandler,
      this.settingsComponent.settingsWebSocketMessageHandler,
      this.securityComponent.securityWebSocketMessageHandler,
      this.storageComponent.storageWebSocketMessageHandler,
      this.managementUserComponent.userWebSocketMessageHandler
    ]

    this.commonComponent.webSocketService.updateWebSocketMessageHandlers(handlers)
    this._isInitialized = true
  }
}
