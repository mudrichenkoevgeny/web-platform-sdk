import type {
  CommonComponent,
  EncryptedSettings,
  HttpClient,
  SecurityComponent,
  SettingsComponent,
  WebSocketService
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementAuthSettingsApi } from '@/network/api/auth/settings/management-auth-settings-api'
import { FetchManagementAuthSettingsApi } from '@/network/api/auth/settings/fetch-management-auth-settings-api'
import type { ManagementAuthSettingsStorage } from '@/storage/auth/settings/management-auth-settings-storage'
import { EncryptedManagementAuthSettingsStorage } from '@/storage/auth/settings/encrypted-management-auth-settings-storage'
import type { ManagementAuthSettingsRepository } from '@/repository/auth/settings/management-auth-settings-repository'
import { ManagementAuthSettingsRepositoryImpl } from '@/repository/auth/settings/management-auth-settings-repository-impl'
import type { ManagementGlobalSettingsApi } from '@/network/api/global-settings/management-global-settings-api'
import { FetchManagementGlobalSettingsApi } from '@/network/api/global-settings/fetch-management-global-settings-api'
import type { ManagementGlobalSettingsStorage } from '@/storage/global-settings/management-global-settings-storage'
import { EncryptedManagementGlobalSettingsStorage } from '@/storage/global-settings/encrypted-management-global-settings-storage'
import type { ManagementGlobalSettingsRepository } from '@/repository/global-settings/management-global-settings-repository'
import { ManagementGlobalSettingsRepositoryImpl } from '@/repository/global-settings/management-global-settings-repository-impl'
import type { ManagementSecuritySettingsApi } from '@/network/api/security/settings/management-security-settings-api'
import { FetchManagementSecuritySettingsApi } from '@/network/api/security/settings/fetch-management-security-settings-api'
import type { ManagementSecuritySettingsStorage } from '@/storage/security-settings/management-security-settings-storage'
import { EncryptedManagementSecuritySettingsStorage } from '@/storage/security-settings/encrypted-management-security-settings-storage'
import type { ManagementSecuritySettingsRepository } from '@/repository/security/settings/management-security-settings-repository'
import { ManagementSecuritySettingsRepositoryImpl } from '@/repository/security/settings/management-security-settings-repository-impl'
import type { ManagementStorageSettingsApi } from '@/network/api/storage/settings/management-storage-settings-api'
import { FetchManagementStorageSettingsApi } from '@/network/api/storage/settings/fetch-management-storage-settings-api'
import type { ManagementStorageSettingsStorage } from '@/storage/storage-settings/management-storage-settings-storage'
import { EncryptedManagementStorageSettingsStorage } from '@/storage/storage-settings/encrypted-management-storage-settings-storage'
import type { ManagementStorageSettingsRepository } from '@/repository/storage/settings/management-storage-settings-repository'
import { ManagementStorageSettingsRepositoryImpl } from '@/repository/storage/settings/management-storage-settings-repository-impl'

import type { SelfManagementLoginApi } from '@/network/api/auth/login/self-management-login-api'
import { FetchSelfManagementLoginApi } from '@/network/api/auth/login/fetch-self-management-login-api'
import type { SelfManagementLoginRepository } from '@/repository/auth/login/self-management-login-repository'
import { SelfManagementLoginRepositoryImpl } from '@/repository/auth/login/self-management-login-repository-impl'
import type { SelfManagementRefreshTokenApi } from '@/network/api/auth/refresh-token/self-management-refresh-token-api'
import { FetchSelfManagementRefreshTokenApi } from '@/network/api/auth/refresh-token/fetch-self-management-refresh-token-api'
import type { SelfManagementRefreshTokenRepository } from '@/repository/auth/refresh-token/self-management-refresh-token-repository'
import { SelfManagementRefreshTokenRepositoryImpl } from '@/repository/auth/refresh-token/self-management-refresh-token-repository-impl'
import type { SelfManagementResetPasswordApi } from '@/network/api/auth/reset-password/self-management-reset-password-api'
import { FetchSelfManagementResetPasswordApi } from '@/network/api/auth/reset-password/fetch-self-management-reset-password-api'
import type { SelfManagementResetPasswordRepository } from '@/repository/auth/reset-password/self-management-reset-password-repository'
import { SelfManagementResetPasswordRepositoryImpl } from '@/repository/auth/reset-password/self-management-reset-password-repository-impl'
import type { SelfManagementUnlockApi } from '@/network/api/auth/unlock/self-management-unlock-api'
import { FetchSelfManagementUnlockApi } from '@/network/api/auth/unlock/fetch-self-management-unlock-api'
import type { SelfManagementUnlockRepository } from '@/repository/auth/unlock/self-management-unlock-repository'
import { SelfManagementUnlockRepositoryImpl } from '@/repository/auth/unlock/self-management-unlock-repository-impl'

import type { ManagementUserConfigurationApi } from '@/network/api/configuration/management-user-configuration-api'
import { FetchManagementUserConfigurationApi } from '@/network/api/configuration/fetch-management-user-configuration-api'
import type { ManagementUserConfigurationRepository } from '@/repository/configuration/management-user-configuration-repository'
import { ManagementUserConfigurationRepositoryImpl } from '@/repository/configuration/management-user-configuration-repository-impl'

import type { ManagementIdentifierApi } from '@/network/api/identifier/management-identifier-api'
import { FetchManagementIdentifierApi } from '@/network/api/identifier/fetch-management-identifier-api'
import type { ManagementIdentifierRepository } from '@/repository/identifier/management-identifier-repository'
import { ManagementIdentifierRepositoryImpl } from '@/repository/identifier/management-identifier-repository-impl'
import type { SelfManagementIdentifiersApi } from '@/network/api/identifier/self-management-identifiers-api'
import { FetchSelfManagementIdentifiersApi } from '@/network/api/identifier/fetch-self-management-identifiers-api'
import type { SelfManagementIdentifierRepository } from '@/repository/identifier/self-management-identifier-repository'
import { SelfManagementIdentifierRepositoryImpl } from '@/repository/identifier/self-management-identifier-repository-impl'

import type { ManagementSessionApi } from '@/network/api/session/management-session-api'
import { FetchManagementSessionApi } from '@/network/api/session/fetch-management-session-api'
import type { ManagementSessionRepository } from '@/repository/session/management-session-repository'
import { ManagementSessionRepositoryImpl } from '@/repository/session/management-session-repository-impl'
import type { SelfManagementSessionApi } from '@/network/api/session/self-management-session-api'
import { FetchSelfManagementSessionApi } from '@/network/api/session/fetch-self-management-session-api'
import type { SelfManagementSessionRepository } from '@/repository/session/self-management-session-repository'
import { SelfManagementSessionRepositoryImpl } from '@/repository/session/self-management-session-repository-impl'

import type { ManagementAuditApi } from '@/network/api/audit/management-audit-api'
import { FetchManagementAuditApi } from '@/network/api/audit/fetch-management-audit-api'
import type { ManagementAuditRepository } from '@/repository/audit/management-audit-repository'
import { ManagementAuditRepositoryImpl } from '@/repository/audit/management-audit-repository-impl'

import type { ManagementUserSecurityApi } from '@/network/api/user/security/management-user-security-api'
import { FetchManagementUserSecurityApi } from '@/network/api/user/security/fetch-management-user-security-api'
import type { ManagementUserSecurityRepository } from '@/repository/user/security/management-user-security-repository'
import { ManagementUserSecurityRepositoryImpl } from '@/repository/user/security/management-user-security-repository-impl'
import type { SelfManagementUserSecurityApi } from '@/network/api/user/security/self-management-user-security-api'
import { FetchSelfManagementUserSecurityApi } from '@/network/api/user/security/fetch-self-management-user-security-api'
import type { SelfManagementUserSecurityRepository } from '@/repository/user/security/self-management-user-security-repository'
import { SelfManagementUserSecurityRepositoryImpl } from '@/repository/user/security/self-management-user-security-repository-impl'

import type { ManagementUserApi } from '@/network/api/user/management-user-api'
import { FetchManagementUserApi } from '@/network/api/user/fetch-management-user-api'
import type { ManagementUserRepository } from '@/repository/user/management-user-repository'
import { ManagementUserRepositoryImpl } from '@/repository/user/management-user-repository-impl'
import type { SelfManagementUserApi } from '@/network/api/user/self-management-user-api'
import { FetchSelfManagementUserApi } from '@/network/api/user/fetch-self-management-user-api'
import type { SelfManagementUserRepository } from '@/repository/user/self-management-user-repository'
import { SelfManagementUserRepositoryImpl } from '@/repository/user/self-management-user-repository-impl'

import type { ManagementStorageApi } from '@/network/api/storage/management-storage-api'
import { FetchManagementStorageApi } from '@/network/api/storage/fetch-management-storage-api'
import type { ManagementStorageRepository } from '@/repository/storage/management-storage-repository'
import { ManagementStorageRepositoryImpl } from '@/repository/storage/management-storage-repository-impl'
import type { SelfManagementStorageApi } from '@/network/api/storage/self-management-storage-api'
import { FetchSelfManagementStorageApi } from '@/network/api/storage/fetch-self-management-storage-api'
import type { SelfManagementStorageRepository } from '@/repository/storage/self-management-storage-repository'
import { SelfManagementStorageRepositoryImpl } from '@/repository/storage/self-management-storage-repository-impl'

import { GetAuditEventUseCase } from '@/usecase/audit/get-audit-event-use-case'
import { GetAuditEventsUseCase } from '@/usecase/audit/get-audit-events-use-case'

import { GetManagementAuthSettingsUseCase } from '@/usecase/auth/settings/get-management-auth-settings-use-case'
import { RefreshManagementAuthSettingsUseCase } from '@/usecase/auth/settings/refresh-management-auth-settings-use-case'
import { ResetManagementAuthSettingsUseCase } from '@/usecase/auth/settings/reset-management-auth-settings-use-case'
import { UpdateManagementAuthSettingsUseCase } from '@/usecase/auth/settings/update-management-auth-settings-use-case'

import { RefreshManagementUserConfigurationUseCase } from '@/usecase/configuration/refresh-management-user-configuration-use-case'

import { GetManagementGlobalSettingsUseCase } from '@/usecase/global-settings/get-management-global-settings-use-case'
import { RefreshManagementGlobalSettingsUseCase } from '@/usecase/global-settings/refresh-management-global-settings-use-case'
import { ResetManagementGlobalSettingsUseCase } from '@/usecase/global-settings/reset-management-global-settings-use-case'
import { UpdateManagementGlobalSettingsUseCase } from '@/usecase/global-settings/update-management-global-settings-use-case'

import { ManagementDeleteIdentifierPasswordUseCase } from '@/usecase/identifier/management-delete-identifier-password-use-case'
import { ManagementDeleteIdentifierUseCase } from '@/usecase/identifier/management-delete-identifier-use-case'
import { ManagementGetIdentifierUseCase } from '@/usecase/identifier/management-get-identifier-use-case'
import { ManagementGetIdentifiersUseCase } from '@/usecase/identifier/management-get-identifiers-use-case'

import { GetManagementSecuritySettingsUseCase } from '@/usecase/security/settings/get-management-security-settings-use-case'
import { RefreshManagementSecuritySettingsUseCase } from '@/usecase/security/settings/refresh-management-security-settings-use-case'
import { ResetManagementSecuritySettingsUseCase } from '@/usecase/security/settings/reset-management-security-settings-use-case'
import { UpdateManagementSecuritySettingsUseCase } from '@/usecase/security/settings/update-management-security-settings-use-case'

import { GetManagementStorageSettingsUseCase } from '@/usecase/storage/settings/get-management-storage-settings-use-case'
import { RefreshManagementStorageSettingsUseCase } from '@/usecase/storage/settings/refresh-management-storage-settings-use-case'
import { ResetManagementStorageSettingsUseCase } from '@/usecase/storage/settings/reset-management-storage-settings-use-case'
import { UpdateManagementStorageSettingsUseCase } from '@/usecase/storage/settings/update-management-storage-settings-use-case'

import { ManagementGetFilesUseCase } from '@/usecase/storage/management-get-files-use-case'
import { ManagementGetFileDetailUseCase } from '@/usecase/storage/management-get-file-detail-use-case'
import { ManagementDeleteFileUseCase } from '@/usecase/storage/management-delete-file-use-case'
import { ManagementDeleteFilesBatchUseCase } from '@/usecase/storage/management-delete-files-batch-use-case'

import { ManagementDeleteAllUserSessionsUseCase } from '@/usecase/session/management-delete-all-user-sessions-use-case'
import { ManagementDeleteSessionUseCase } from '@/usecase/session/management-delete-session-use-case'
import { ManagementGetSessionUseCase } from '@/usecase/session/management-get-session-use-case'
import { ManagementGetSessionsUseCase } from '@/usecase/session/management-get-sessions-use-case'

import { ManagementDisableTotpUseCase } from '@/usecase/user/security/management-disable-totp-use-case'

import { CreateUserUseCase } from '@/usecase/user/create-user-use-case'
import { DeleteUserUseCase } from '@/usecase/user/delete-user-use-case'
import { GetUserUseCase } from '@/usecase/user/get-user-use-case'
import { GetUsersUseCase } from '@/usecase/user/get-users-use-case'
import { UpdateUserUseCase } from '@/usecase/user/update-user-use-case'

import { UserWebSocketMessageHandler } from '@/network/websocket/message-handler/user-web-socket-message-handler'
import type { AuthStorage, UserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { EncryptedAuthStorage, EncryptedUserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/**
 * Configuration options required to instantiate {@link ManagementUserComponent}.
 */
export interface ManagementUserComponentConfig {
  /** Injected common component container. */
  commonComponent: CommonComponent
  /** Injected settings component container. */
  settingsComponent: SettingsComponent
  /** Injected security component container. */
  securityComponent: SecurityComponent
  /** Optional custom HTTP client override. */
  httpClient?: HttpClient
  /** Optional custom encrypted settings store override. */
  encryptedSettings?: EncryptedSettings
  /** Optional custom WebSocket service override. */
  webSocketService?: WebSocketService
  /** Optional custom auth storage override. */
  authStorage?: AuthStorage
  /** Optional custom user storage override. */
  userStorage?: UserStorage
  /** Optional custom management auth settings API override. */
  managementAuthSettingsApi?: ManagementAuthSettingsApi
  /** Optional custom management auth settings storage override. */
  managementAuthSettingsStorage?: ManagementAuthSettingsStorage
  /** Optional custom management global settings API override. */
  managementGlobalSettingsApi?: ManagementGlobalSettingsApi
  /** Optional custom management global settings storage override. */
  managementGlobalSettingsStorage?: ManagementGlobalSettingsStorage
  /** Optional custom management security settings API override. */
  managementSecuritySettingsApi?: ManagementSecuritySettingsApi
  /** Optional custom management security settings storage override. */
  managementSecuritySettingsStorage?: ManagementSecuritySettingsStorage
  /** Optional custom management storage settings API override. */
  managementStorageSettingsApi?: ManagementStorageSettingsApi
  /** Optional custom management storage settings storage override. */
  managementStorageSettingsStorage?: ManagementStorageSettingsStorage
}

/**
 * Dependency injection container for the management user feature.
 */
export class ManagementUserComponent {
  public readonly commonComponent: CommonComponent
  public readonly settingsComponent: SettingsComponent
  public readonly securityComponent: SecurityComponent

  public readonly httpClient: HttpClient
  public readonly encryptedSettings: EncryptedSettings
  public readonly webSocketService: WebSocketService

  public readonly authStorage: AuthStorage
  public readonly userStorage: UserStorage

  public readonly managementAuthSettingsApi: ManagementAuthSettingsApi
  public readonly managementAuthSettingsStorage: ManagementAuthSettingsStorage
  public readonly managementAuthSettingsRepository: ManagementAuthSettingsRepository

  public readonly managementGlobalSettingsApi: ManagementGlobalSettingsApi
  public readonly managementGlobalSettingsStorage: ManagementGlobalSettingsStorage
  public readonly managementGlobalSettingsRepository: ManagementGlobalSettingsRepository

  public readonly managementSecuritySettingsApi: ManagementSecuritySettingsApi
  public readonly managementSecuritySettingsStorage: ManagementSecuritySettingsStorage
  public readonly managementSecuritySettingsRepository: ManagementSecuritySettingsRepository

  public readonly managementStorageSettingsApi: ManagementStorageSettingsApi
  public readonly managementStorageSettingsStorage: ManagementStorageSettingsStorage
  public readonly managementStorageSettingsRepository: ManagementStorageSettingsRepository

  public readonly selfManagementLoginApi: SelfManagementLoginApi
  public readonly selfManagementLoginRepository: SelfManagementLoginRepository

  public readonly selfManagementRefreshTokenApi: SelfManagementRefreshTokenApi
  public readonly selfManagementRefreshTokenRepository: SelfManagementRefreshTokenRepository

  public readonly selfManagementResetPasswordApi: SelfManagementResetPasswordApi
  public readonly selfManagementResetPasswordRepository: SelfManagementResetPasswordRepository

  public readonly selfManagementUnlockApi: SelfManagementUnlockApi
  public readonly selfManagementUnlockRepository: SelfManagementUnlockRepository

  public readonly managementUserConfigurationApi: ManagementUserConfigurationApi
  public readonly managementUserConfigurationRepository: ManagementUserConfigurationRepository

  public readonly managementIdentifierApi: ManagementIdentifierApi
  public readonly managementIdentifierRepository: ManagementIdentifierRepository

  public readonly selfManagementIdentifiersApi: SelfManagementIdentifiersApi
  public readonly selfManagementIdentifierRepository: SelfManagementIdentifierRepository

  public readonly managementSessionApi: ManagementSessionApi
  public readonly managementSessionRepository: ManagementSessionRepository

  public readonly selfManagementSessionApi: SelfManagementSessionApi
  public readonly selfManagementSessionRepository: SelfManagementSessionRepository

  public readonly managementAuditApi: ManagementAuditApi
  public readonly managementAuditRepository: ManagementAuditRepository

  public readonly managementUserSecurityApi: ManagementUserSecurityApi
  public readonly managementUserSecurityRepository: ManagementUserSecurityRepository

  public readonly selfManagementUserSecurityApi: SelfManagementUserSecurityApi
  public readonly selfManagementUserSecurityRepository: SelfManagementUserSecurityRepository

  public readonly managementUserApi: ManagementUserApi
  public readonly managementUserRepository: ManagementUserRepository

  public readonly selfManagementUserApi: SelfManagementUserApi
  public readonly selfManagementUserRepository: SelfManagementUserRepository

  public readonly managementStorageApi: ManagementStorageApi
  public readonly managementStorageRepository: ManagementStorageRepository

  public readonly selfManagementStorageApi: SelfManagementStorageApi
  public readonly selfManagementStorageRepository: SelfManagementStorageRepository

  public readonly getManagementAuthSettingsUseCase: GetManagementAuthSettingsUseCase
  public readonly refreshManagementAuthSettingsUseCase: RefreshManagementAuthSettingsUseCase
  public readonly updateManagementAuthSettingsUseCase: UpdateManagementAuthSettingsUseCase
  public readonly resetManagementAuthSettingsUseCase: ResetManagementAuthSettingsUseCase

  public readonly getManagementGlobalSettingsUseCase: GetManagementGlobalSettingsUseCase
  public readonly refreshManagementGlobalSettingsUseCase: RefreshManagementGlobalSettingsUseCase
  public readonly updateManagementGlobalSettingsUseCase: UpdateManagementGlobalSettingsUseCase
  public readonly resetManagementGlobalSettingsUseCase: ResetManagementGlobalSettingsUseCase

  public readonly getManagementSecuritySettingsUseCase: GetManagementSecuritySettingsUseCase
  public readonly refreshManagementSecuritySettingsUseCase: RefreshManagementSecuritySettingsUseCase
  public readonly updateManagementSecuritySettingsUseCase: UpdateManagementSecuritySettingsUseCase
  public readonly resetManagementSecuritySettingsUseCase: ResetManagementSecuritySettingsUseCase

  public readonly getManagementStorageSettingsUseCase: GetManagementStorageSettingsUseCase
  public readonly refreshManagementStorageSettingsUseCase: RefreshManagementStorageSettingsUseCase
  public readonly updateManagementStorageSettingsUseCase: UpdateManagementStorageSettingsUseCase
  public readonly resetManagementStorageSettingsUseCase: ResetManagementStorageSettingsUseCase

  public readonly managementGetFilesUseCase: ManagementGetFilesUseCase
  public readonly managementGetFileDetailUseCase: ManagementGetFileDetailUseCase
  public readonly managementDeleteFileUseCase: ManagementDeleteFileUseCase
  public readonly managementDeleteFilesBatchUseCase: ManagementDeleteFilesBatchUseCase

  public readonly refreshManagementUserConfigurationUseCase: RefreshManagementUserConfigurationUseCase

  public readonly managementGetIdentifiersUseCase: ManagementGetIdentifiersUseCase
  public readonly managementGetIdentifierUseCase: ManagementGetIdentifierUseCase
  public readonly managementDeleteIdentifierUseCase: ManagementDeleteIdentifierUseCase
  public readonly managementDeleteIdentifierPasswordUseCase: ManagementDeleteIdentifierPasswordUseCase

  public readonly managementGetSessionsUseCase: ManagementGetSessionsUseCase
  public readonly managementGetSessionUseCase: ManagementGetSessionUseCase
  public readonly managementDeleteSessionUseCase: ManagementDeleteSessionUseCase
  public readonly managementDeleteAllUserSessionsUseCase: ManagementDeleteAllUserSessionsUseCase

  public readonly getAuditEventsUseCase: GetAuditEventsUseCase
  public readonly getAuditEventUseCase: GetAuditEventUseCase

  public readonly managementDisableTotpUseCase: ManagementDisableTotpUseCase

  public readonly getUsersUseCase: GetUsersUseCase
  public readonly getUserUseCase: GetUserUseCase
  public readonly createUserUseCase: CreateUserUseCase
  public readonly updateUserUseCase: UpdateUserUseCase
  public readonly deleteUserUseCase: DeleteUserUseCase

  public readonly userWebSocketMessageHandler: UserWebSocketMessageHandler

  public constructor(config: ManagementUserComponentConfig) {
    this.commonComponent = config.commonComponent
    this.settingsComponent = config.settingsComponent
    this.securityComponent = config.securityComponent

    this.httpClient = config.httpClient ?? config.commonComponent.httpClient
    this.encryptedSettings = config.encryptedSettings ?? config.commonComponent.encryptedSettings
    this.webSocketService = config.webSocketService ?? config.commonComponent.webSocketService

    this.authStorage = config.authStorage ?? new EncryptedAuthStorage(this.encryptedSettings)
    this.userStorage = config.userStorage ?? new EncryptedUserStorage(this.encryptedSettings)

    this.managementAuthSettingsApi =
      config.managementAuthSettingsApi ?? new FetchManagementAuthSettingsApi(this.httpClient)
    this.managementAuthSettingsStorage =
      config.managementAuthSettingsStorage ?? new EncryptedManagementAuthSettingsStorage(this.encryptedSettings)
    this.managementAuthSettingsRepository = new ManagementAuthSettingsRepositoryImpl(
      this.managementAuthSettingsApi,
      this.managementAuthSettingsStorage,
      this.webSocketService
    )

    this.managementGlobalSettingsApi =
      config.managementGlobalSettingsApi ?? new FetchManagementGlobalSettingsApi(this.httpClient)
    this.managementGlobalSettingsStorage =
      config.managementGlobalSettingsStorage ?? new EncryptedManagementGlobalSettingsStorage(this.encryptedSettings)
    this.managementGlobalSettingsRepository = new ManagementGlobalSettingsRepositoryImpl(
      this.managementGlobalSettingsApi,
      this.managementGlobalSettingsStorage,
      this.webSocketService
    )

    this.managementSecuritySettingsApi =
      config.managementSecuritySettingsApi ?? new FetchManagementSecuritySettingsApi(this.httpClient)
    this.managementSecuritySettingsStorage =
      config.managementSecuritySettingsStorage ?? new EncryptedManagementSecuritySettingsStorage(this.encryptedSettings)
    this.managementSecuritySettingsRepository = new ManagementSecuritySettingsRepositoryImpl(
      this.managementSecuritySettingsApi,
      this.managementSecuritySettingsStorage,
      this.webSocketService
    )

    this.managementStorageSettingsApi =
      config.managementStorageSettingsApi ?? new FetchManagementStorageSettingsApi(this.httpClient)
    this.managementStorageSettingsStorage =
      config.managementStorageSettingsStorage ?? new EncryptedManagementStorageSettingsStorage(this.encryptedSettings)
    this.managementStorageSettingsRepository = new ManagementStorageSettingsRepositoryImpl(
      this.managementStorageSettingsApi,
      this.managementStorageSettingsStorage,
      this.webSocketService
    )

    this.selfManagementLoginApi = new FetchSelfManagementLoginApi(this.httpClient)
    this.selfManagementLoginRepository = new SelfManagementLoginRepositoryImpl(
      this.selfManagementLoginApi,
      this.authStorage,
      this.userStorage
    )

    this.selfManagementRefreshTokenApi = new FetchSelfManagementRefreshTokenApi(this.httpClient)
    this.selfManagementRefreshTokenRepository = new SelfManagementRefreshTokenRepositoryImpl(
      this.selfManagementRefreshTokenApi,
      this.authStorage
    )

    this.selfManagementResetPasswordApi = new FetchSelfManagementResetPasswordApi(this.httpClient)
    this.selfManagementResetPasswordRepository = new SelfManagementResetPasswordRepositoryImpl(
      this.selfManagementResetPasswordApi
    )

    this.selfManagementUnlockApi = new FetchSelfManagementUnlockApi(this.httpClient)
    this.selfManagementUnlockRepository = new SelfManagementUnlockRepositoryImpl(
      this.selfManagementUnlockApi,
      this.authStorage,
      this.userStorage
    )

    this.managementUserConfigurationApi = new FetchManagementUserConfigurationApi(this.httpClient)
    this.managementUserConfigurationRepository = new ManagementUserConfigurationRepositoryImpl(
      this.managementUserConfigurationApi
    )

    this.managementIdentifierApi = new FetchManagementIdentifierApi(this.httpClient)
    this.managementIdentifierRepository = new ManagementIdentifierRepositoryImpl(
      this.managementIdentifierApi
    )

    this.selfManagementIdentifiersApi = new FetchSelfManagementIdentifiersApi(this.httpClient)
    this.selfManagementIdentifierRepository = new SelfManagementIdentifierRepositoryImpl(
      this.selfManagementIdentifiersApi
    )

    this.managementSessionApi = new FetchManagementSessionApi(this.httpClient)
    this.managementSessionRepository = new ManagementSessionRepositoryImpl(
      this.managementSessionApi
    )

    this.selfManagementSessionApi = new FetchSelfManagementSessionApi(this.httpClient)
    this.selfManagementSessionRepository = new SelfManagementSessionRepositoryImpl(
      this.selfManagementSessionApi,
      this.authStorage,
      this.userStorage
    )

    this.managementAuditApi = new FetchManagementAuditApi(this.httpClient)
    this.managementAuditRepository = new ManagementAuditRepositoryImpl(
      this.managementAuditApi
    )

    this.managementUserSecurityApi = new FetchManagementUserSecurityApi(this.httpClient)
    this.managementUserSecurityRepository = new ManagementUserSecurityRepositoryImpl(
      this.managementUserSecurityApi
    )

    this.selfManagementUserSecurityApi = new FetchSelfManagementUserSecurityApi(this.httpClient)
    this.selfManagementUserSecurityRepository = new SelfManagementUserSecurityRepositoryImpl(
      this.selfManagementUserSecurityApi
    )

    this.managementUserApi = new FetchManagementUserApi(this.httpClient)
    this.managementUserRepository = new ManagementUserRepositoryImpl(
      this.managementUserApi
    )

    this.selfManagementUserApi = new FetchSelfManagementUserApi(this.httpClient)
    this.selfManagementUserRepository = new SelfManagementUserRepositoryImpl(
      this.selfManagementUserApi,
      this.userStorage
    )

    this.managementStorageApi = new FetchManagementStorageApi(this.httpClient)
    this.managementStorageRepository = new ManagementStorageRepositoryImpl(
      this.managementStorageApi,
      this.webSocketService
    )

    this.selfManagementStorageApi = new FetchSelfManagementStorageApi(this.httpClient)
    this.selfManagementStorageRepository = new SelfManagementStorageRepositoryImpl(
      this.selfManagementStorageApi,
      this.webSocketService
    )

    this.getManagementAuthSettingsUseCase = new GetManagementAuthSettingsUseCase(this.managementAuthSettingsRepository)
    this.refreshManagementAuthSettingsUseCase = new RefreshManagementAuthSettingsUseCase(this.managementAuthSettingsRepository)
    this.updateManagementAuthSettingsUseCase = new UpdateManagementAuthSettingsUseCase(this.managementAuthSettingsRepository)
    this.resetManagementAuthSettingsUseCase = new ResetManagementAuthSettingsUseCase(this.managementAuthSettingsRepository)

    this.getManagementGlobalSettingsUseCase = new GetManagementGlobalSettingsUseCase(this.managementGlobalSettingsRepository)
    this.refreshManagementGlobalSettingsUseCase = new RefreshManagementGlobalSettingsUseCase(this.managementGlobalSettingsRepository)
    this.updateManagementGlobalSettingsUseCase = new UpdateManagementGlobalSettingsUseCase(this.managementGlobalSettingsRepository)
    this.resetManagementGlobalSettingsUseCase = new ResetManagementGlobalSettingsUseCase(this.managementGlobalSettingsRepository)

    this.getManagementSecuritySettingsUseCase = new GetManagementSecuritySettingsUseCase(this.managementSecuritySettingsRepository)
    this.refreshManagementSecuritySettingsUseCase = new RefreshManagementSecuritySettingsUseCase(this.managementSecuritySettingsRepository)
    this.updateManagementSecuritySettingsUseCase = new UpdateManagementSecuritySettingsUseCase(this.managementSecuritySettingsRepository)
    this.resetManagementSecuritySettingsUseCase = new ResetManagementSecuritySettingsUseCase(this.managementSecuritySettingsRepository)

    this.getManagementStorageSettingsUseCase = new GetManagementStorageSettingsUseCase(this.managementStorageSettingsRepository)
    this.refreshManagementStorageSettingsUseCase = new RefreshManagementStorageSettingsUseCase(this.managementStorageSettingsRepository)
    this.updateManagementStorageSettingsUseCase = new UpdateManagementStorageSettingsUseCase(this.managementStorageSettingsRepository)
    this.resetManagementStorageSettingsUseCase = new ResetManagementStorageSettingsUseCase(this.managementStorageSettingsRepository)

    this.managementGetFilesUseCase = new ManagementGetFilesUseCase(this.managementStorageRepository)
    this.managementGetFileDetailUseCase = new ManagementGetFileDetailUseCase(this.managementStorageRepository)
    this.managementDeleteFileUseCase = new ManagementDeleteFileUseCase(this.managementStorageRepository)
    this.managementDeleteFilesBatchUseCase = new ManagementDeleteFilesBatchUseCase(this.managementStorageRepository)

    this.refreshManagementUserConfigurationUseCase = new RefreshManagementUserConfigurationUseCase(
      this.managementUserConfigurationRepository,
      this.managementGlobalSettingsRepository,
      this.managementSecuritySettingsRepository,
      this.managementStorageSettingsRepository,
      this.managementAuthSettingsRepository
    )

    this.managementGetIdentifiersUseCase = new ManagementGetIdentifiersUseCase(this.managementIdentifierRepository)
    this.managementGetIdentifierUseCase = new ManagementGetIdentifierUseCase(this.managementIdentifierRepository)
    this.managementDeleteIdentifierUseCase = new ManagementDeleteIdentifierUseCase(this.managementIdentifierRepository)
    this.managementDeleteIdentifierPasswordUseCase = new ManagementDeleteIdentifierPasswordUseCase(this.managementIdentifierRepository)

    this.managementGetSessionsUseCase = new ManagementGetSessionsUseCase(this.managementSessionRepository)
    this.managementGetSessionUseCase = new ManagementGetSessionUseCase(this.managementSessionRepository)
    this.managementDeleteSessionUseCase = new ManagementDeleteSessionUseCase(this.managementSessionRepository)
    this.managementDeleteAllUserSessionsUseCase = new ManagementDeleteAllUserSessionsUseCase(this.managementSessionRepository)

    this.getAuditEventsUseCase = new GetAuditEventsUseCase(this.managementAuditRepository)
    this.getAuditEventUseCase = new GetAuditEventUseCase(this.managementAuditRepository)

    this.managementDisableTotpUseCase = new ManagementDisableTotpUseCase(this.managementUserSecurityRepository)

    this.getUsersUseCase = new GetUsersUseCase(this.managementUserRepository)
    this.getUserUseCase = new GetUserUseCase(this.managementUserRepository)
    this.createUserUseCase = new CreateUserUseCase(this.managementUserRepository)
    this.updateUserUseCase = new UpdateUserUseCase(this.managementUserRepository)
    this.deleteUserUseCase = new DeleteUserUseCase(this.managementUserRepository)

    this.userWebSocketMessageHandler = new UserWebSocketMessageHandler(
      this.userStorage,
      this.selfUserRepository,
      this.authStorage,
      this.selfManagementRefreshTokenRepository
    )
  }
}
