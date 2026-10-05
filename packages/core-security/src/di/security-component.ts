import type { EncryptedSettings, HttpClient, WebSocketService } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenSecuritySettingsStorage } from '@/storage/security-settings/open-security-settings-storage'
import { EncryptedOpenSecuritySettingsStorage } from '@/storage/security-settings/encrypted-open-security-settings-storage'
import type { OpenSecuritySettingsApi } from '@/network/security-settings/open-security-settings-api'
import { FetchOpenSecuritySettingsApi } from '@/network/security-settings/fetch-open-security-settings-api'
import type { OpenSecuritySettingsRepository } from '@/repository/open-security-settings-repository'
import { OpenSecuritySettingsRepositoryImpl } from '@/repository/open-security-settings-repository-impl'
import { PasswordPolicyValidator } from '@/domain/model/password-policy-validator'
import { RefreshOpenSecuritySettingsUseCase } from '@/usecase/refresh-open-security-settings-use-case'
import { ValidatePasswordUseCase } from '@/usecase/validate-password-use-case'
import { SecurityWebSocketMessageHandler } from '@/network/websocket/message-handler/security-web-socket-message-handler'

/**
 * Configuration options required to instantiate {@link SecurityComponent}.
 */
export interface SecurityComponentConfig {
  /** Global WebSocket service. */
  webSocketService: WebSocketService
  /** Pre-configured HTTP client for REST calls. */
  httpClient: HttpClient
  /** Encrypted storage backend. */
  encryptedSettings: EncryptedSettings
  /** Optional mock overrides for tests. */
  openSecuritySettingsApi?: OpenSecuritySettingsApi
  /** Optional mock overrides for tests. */
  openSecuritySettingsStorage?: OpenSecuritySettingsStorage
  /** Optional mock overrides for tests. */
  passwordPolicyValidator?: PasswordPolicyValidator
}

/**
 * Root dependency injection container for `core-security` module.
 *
 * Assembles storage, networking, repositories, and password policy validation.
 */
export class SecurityComponent {
  /** Core persistence interface for open security settings. */
  public readonly securitySettingsStorage: OpenSecuritySettingsStorage
  /** HTTP REST client API for open security settings. */
  public readonly openSecuritySettingsApi: OpenSecuritySettingsApi
  /** Central repository for open security settings. */
  public readonly securitySettingsRepository: OpenSecuritySettingsRepository
  /** Pure domain logic password policy validator. */
  public readonly passwordPolicyValidator: PasswordPolicyValidator
  /** Use case for forcing a network refresh of settings. */
  public readonly refreshSecuritySettingsUseCase: RefreshOpenSecuritySettingsUseCase
  /** Use case for validating password candidate strings against active policy. */
  public readonly validatePasswordUseCase: ValidatePasswordUseCase
  /** Handler offered to the shared WebSocket pipeline. */
  public readonly securityWebSocketMessageHandler: SecurityWebSocketMessageHandler

  /**
   * Constructs a new {@link SecurityComponent}.
   *
   * @param config - Container configuration holding global SDK dependencies
   */
  public constructor(config: SecurityComponentConfig) {
    this.securitySettingsStorage =
      config.openSecuritySettingsStorage ??
      new EncryptedOpenSecuritySettingsStorage(config.encryptedSettings)

    this.passwordPolicyValidator =
      config.passwordPolicyValidator ?? new PasswordPolicyValidator()

    this.openSecuritySettingsApi =
      config.openSecuritySettingsApi ??
      new FetchOpenSecuritySettingsApi(config.httpClient)

    this.securitySettingsRepository = new OpenSecuritySettingsRepositoryImpl(
      this.openSecuritySettingsApi,
      this.securitySettingsStorage,
      config.webSocketService
    )

    this.refreshSecuritySettingsUseCase = new RefreshOpenSecuritySettingsUseCase(
      this.securitySettingsRepository
    )

    this.validatePasswordUseCase = new ValidatePasswordUseCase(
      this.securitySettingsRepository,
      this.passwordPolicyValidator
    )

    this.securityWebSocketMessageHandler = new SecurityWebSocketMessageHandler()
  }
}
