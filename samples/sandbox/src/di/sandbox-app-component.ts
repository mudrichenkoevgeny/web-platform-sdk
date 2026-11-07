import {
  CommonComponent,
  EncryptedSettingsComponent
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SecurityComponent, SecurityErrorParser } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { SettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { StorageComponent, StorageErrorParser } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { ClientUserComponent } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'
import type { AuthStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import {
  AuthHttpClientConfigPlugin,
  DefaultMfaChallengeHandler,
  DisabledGoogleAuthService,
  EncryptedAuthStorage,
  MfaStepUpHttpClientConfigPlugin,
  UserErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { OpenRefreshTokenRoutes, OpenSessionRoutes, WebSocketContract } from '@mudrichenkoevgeny/shared-foundation'

export interface SandboxAppComponentConfig {
  baseUrl: string
  appVersion?: string
  apiVersion?: string
}

/**
 * Root DI container for the Sandbox host application.
 */
export class SandboxAppComponent {
  private isInitialized = false

  public readonly encryptedSettingsComponent: EncryptedSettingsComponent
  public readonly encryptedSettings: EncryptedSettings
  public readonly authStorage: AuthStorage
  public readonly mfaChallengeHandler: DefaultMfaChallengeHandler
  public readonly commonComponent: CommonComponent
  public readonly settingsComponent: SettingsComponent
  public readonly securityComponent: SecurityComponent
  public readonly storageComponent: StorageComponent
  public readonly clientUserComponent: ClientUserComponent

  public constructor(config: SandboxAppComponentConfig) {
    this.encryptedSettingsComponent = new EncryptedSettingsComponent()
    this.encryptedSettings = this.encryptedSettingsComponent.encryptedSettings
    this.authStorage = new EncryptedAuthStorage(this.encryptedSettings)
    this.mfaChallengeHandler = new DefaultMfaChallengeHandler()

    const authPlugin = new AuthHttpClientConfigPlugin(
      this.authStorage,
      OpenRefreshTokenRoutes.POST_REFRESH_TOKEN,
      [OpenSessionRoutes.DELETE_REVOKE_CURRENT_SESSION]
    )

    const mfaStepUpPlugin = new MfaStepUpHttpClientConfigPlugin(this.mfaChallengeHandler)

    this.commonComponent = new CommonComponent({
      baseUrl: config.baseUrl,
      webSocketPath: WebSocketContract.ENDPOINT_PATH,
      encryptedSettings: this.encryptedSettings,
      accessTokenProvider: this.authStorage,
      httpClientConfigPlugins: [authPlugin, mfaStepUpPlugin],
      appVersion: config.appVersion ?? '1.0.0',
      apiVersion: config.apiVersion ?? '1.0.0'
    })

    this.settingsComponent = new SettingsComponent({
      commonComponent: this.commonComponent
    })

    this.securityComponent = new SecurityComponent({
      commonComponent: this.commonComponent
    })

    this.storageComponent = new StorageComponent({
      commonComponent: this.commonComponent
    })

    this.clientUserComponent = new ClientUserComponent({
      commonComponent: this.commonComponent,
      openGlobalSettingsRepository: this.settingsComponent.openGlobalSettingsRepository,
      openSecuritySettingsRepository: this.securityComponent.openSecuritySettingsRepository,
      openStorageSettingsRepository: this.storageComponent.openStorageSettingsRepository,
      authStorage: this.authStorage,
      authServices: {
        googleAuthService: new DisabledGoogleAuthService()
      }
    })
  }

  /**
   * Asynchronously initializes DI singletons and registers WebSocket handlers.
   */
  public async init(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    await this.commonComponent.init()
    await this.clientUserComponent.init()
    this.isInitialized = true
  }
}
