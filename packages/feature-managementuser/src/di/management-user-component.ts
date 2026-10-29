import type {
  CommonComponent,
  EncryptedSettings,
  HttpClient,
  WebSocketService
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import type {
  CompositeAuditActionTypeParser,
  CompositeAuditResourceTypeParser,
  CompositeAuditMetadataKeyParser
} from '@mudrichenkoevgeny/shared-foundation'

import type { OpenGlobalSettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import {
  OpenGlobalSettingsRepositoryImpl,
  EncryptedOpenGlobalSettingsStorage,
  GetOpenGlobalSettingsUseCase
} from '@mudrichenkoevgeny/web-platform-sdk-core-settings'

import type { OpenSecuritySettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import {
  OpenSecuritySettingsRepositoryImpl,
  EncryptedOpenSecuritySettingsStorage
} from '@mudrichenkoevgeny/web-platform-sdk-core-security'

import type {
  OpenStorageSettingsRepository,
  ManagementStorageSettingsRepository,
  ManagementStorageSettingsApi,
  ManagementStorageSettingsStorage,
  ManagementStorageApi,
  ManagementStorageRepository,
  StorageApi,
  StorageRepository
} from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import {
  OpenStorageSettingsRepositoryImpl,
  EncryptedOpenStorageSettingsStorage,
  FetchManagementStorageSettingsApi,
  EncryptedManagementStorageSettingsStorage,
  ManagementStorageSettingsRepositoryImpl,
  FetchManagementStorageApi,
  ManagementStorageRepositoryImpl,
  FetchSelfManagementStorageApi,
  SelfManagementStorageRepositoryImpl,
  GetManagementStorageSettingsUseCase,
  RefreshManagementStorageSettingsUseCase,
  ResetManagementStorageSettingsUseCase,
  UpdateManagementStorageSettingsUseCase,
  GetFilesUseCase,
  GetFileDetailUseCase,
  UploadFileUseCase,
  DeleteFileUseCase,
  DeleteFilesBatchUseCase,
  ManagementGetFilesUseCase,
  ManagementGetFileDetailUseCase,
  ManagementDeleteFileUseCase,
  ManagementDeleteFilesBatchUseCase
} from '@mudrichenkoevgeny/web-platform-sdk-core-storage'

import type { ManagementAuthSettingsApi } from '@/network/api/auth/settings/management-auth-settings-api'
import { FetchManagementAuthSettingsApi } from '@/network/api/auth/settings/fetch-management-auth-settings-api'
import type { ManagementAuthSettingsStorage } from '@/storage/auth/settings/management-auth-settings-storage'
import { EncryptedManagementAuthSettingsStorage } from '@/storage/auth/settings/encrypted-management-auth-settings-storage'
import type { ManagementAuthSettingsRepository } from '@/repository/auth/settings/management-auth-settings-repository'
import { ManagementAuthSettingsRepositoryImpl } from '@/repository/auth/settings/management-auth-settings-repository-impl'
import { ManagementAuthSettingsRepositoryAdapter } from '@/repository/auth/settings/management-auth-settings-repository-adapter'

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

import type { SelfManagementLoginApi } from '@/network/api/auth/login/self-management-login-api'
import { FetchSelfManagementLoginApi } from '@/network/api/auth/login/fetch-self-management-login-api'
import { SelfManagementLoginRepositoryImpl } from '@/repository/auth/login/self-management-login-repository-impl'
import type { SelfManagementRefreshTokenApi } from '@/network/api/auth/refresh-token/self-management-refresh-token-api'
import { FetchSelfManagementRefreshTokenApi } from '@/network/api/auth/refresh-token/fetch-self-management-refresh-token-api'
import { SelfManagementRefreshTokenRepositoryImpl } from '@/repository/auth/refresh-token/self-management-refresh-token-repository-impl'
import type { SelfManagementResetPasswordApi } from '@/network/api/auth/reset-password/self-management-reset-password-api'
import { FetchSelfManagementResetPasswordApi } from '@/network/api/auth/reset-password/fetch-self-management-reset-password-api'
import { SelfManagementResetPasswordRepositoryImpl } from '@/repository/auth/reset-password/self-management-reset-password-repository-impl'
import type { SelfManagementUnlockApi } from '@/network/api/auth/unlock/self-management-unlock-api'
import { FetchSelfManagementUnlockApi } from '@/network/api/auth/unlock/fetch-self-management-unlock-api'
import type { SelfManagementUnlockRepository } from '@/repository/auth/unlock/self-management-unlock-repository'
import { SelfManagementUnlockRepositoryImpl } from '@/repository/auth/unlock/self-management-unlock-repository-impl'
import { SelfManagementUnlockRepositoryAdapter } from '@/repository/auth/unlock/self-management-unlock-repository-adapter'

import type { ManagementUserConfigurationApi } from '@/network/api/configuration/management-user-configuration-api'
import { FetchManagementUserConfigurationApi } from '@/network/api/configuration/fetch-management-user-configuration-api'

import type { ManagementIdentifierApi } from '@/network/api/identifier/management-identifier-api'
import { FetchManagementIdentifierApi } from '@/network/api/identifier/fetch-management-identifier-api'
import type { ManagementIdentifierRepository } from '@/repository/identifier/management-identifier-repository'
import { ManagementIdentifierRepositoryImpl } from '@/repository/identifier/management-identifier-repository-impl'
import type { SelfManagementIdentifiersApi } from '@/network/api/identifier/self-management-identifiers-api'
import { FetchSelfManagementIdentifiersApi } from '@/network/api/identifier/fetch-self-management-identifiers-api'
import type { SelfManagementIdentifierRepository } from '@/repository/identifier/self-management-identifier-repository'
import { SelfManagementIdentifierRepositoryImpl } from '@/repository/identifier/self-management-identifier-repository-impl'
import { SelfManagementIdentifierRepositoryAdapter } from '@/repository/identifier/self-management-identifier-repository-adapter'

import type { ManagementSessionApi } from '@/network/api/session/management-session-api'
import { FetchManagementSessionApi } from '@/network/api/session/fetch-management-session-api'
import type { ManagementSessionRepository } from '@/repository/session/management-session-repository'
import { ManagementSessionRepositoryImpl } from '@/repository/session/management-session-repository-impl'
import type { SelfManagementSessionApi } from '@/network/api/session/self-management-session-api'
import { FetchSelfManagementSessionApi } from '@/network/api/session/fetch-self-management-session-api'
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
import { SelfManagementUserSecurityRepositoryImpl } from '@/repository/user/security/self-management-user-security-repository-impl'

import type { ManagementUserApi } from '@/network/api/user/management-user-api'
import { FetchManagementUserApi } from '@/network/api/user/fetch-management-user-api'
import type { ManagementUserRepository } from '@/repository/user/management-user-repository'
import { ManagementUserRepositoryImpl } from '@/repository/user/management-user-repository-impl'
import type { SelfManagementUserApi } from '@/network/api/user/self-management-user-api'
import { FetchSelfManagementUserApi } from '@/network/api/user/fetch-self-management-user-api'
import type { SelfManagementUserRepository } from '@/repository/user/self-management-user-repository'
import { SelfManagementUserRepositoryImpl } from '@/repository/user/self-management-user-repository-impl'

import { GetAuditEventUseCase } from '@/usecase/audit/get-audit-event-use-case'
import { GetAuditEventsUseCase } from '@/usecase/audit/get-audit-events-use-case'

import { GetManagementAuthSettingsUseCase } from '@/usecase/auth/settings/get-management-auth-settings-use-case'
import { RefreshManagementAuthSettingsUseCase } from '@/usecase/auth/settings/refresh-management-auth-settings-use-case'
import { ResetManagementAuthSettingsUseCase } from '@/usecase/auth/settings/reset-management-auth-settings-use-case'
import { UpdateManagementAuthSettingsUseCase } from '@/usecase/auth/settings/update-management-auth-settings-use-case'
import { ObserveManagementAuthSettingsUseCase } from '@/usecase/auth/settings/observe-management-auth-settings-use-case'

import { RefreshManagementUserConfigurationUseCase } from '@/usecase/configuration/refresh-management-user-configuration-use-case'

import { GetManagementGlobalSettingsUseCase } from '@/usecase/global-settings/get-management-global-settings-use-case'
import { RefreshManagementGlobalSettingsUseCase } from '@/usecase/global-settings/refresh-management-global-settings-use-case'
import { ResetManagementGlobalSettingsUseCase } from '@/usecase/global-settings/reset-management-global-settings-use-case'
import { UpdateManagementGlobalSettingsUseCase } from '@/usecase/global-settings/update-management-global-settings-use-case'
import { ObserveManagementGlobalSettingsUseCase } from '@/usecase/global-settings/observe-management-global-settings-use-case'

import { ManagementDeleteIdentifierPasswordUseCase } from '@/usecase/identifier/management-delete-identifier-password-use-case'
import { ManagementDeleteIdentifierUseCase } from '@/usecase/identifier/management-delete-identifier-use-case'
import { ManagementGetIdentifierUseCase } from '@/usecase/identifier/management-get-identifier-use-case'
import { ManagementGetIdentifiersUseCase } from '@/usecase/identifier/management-get-identifiers-use-case'

import { GetManagementSecuritySettingsUseCase } from '@/usecase/security/settings/get-management-security-settings-use-case'
import { RefreshManagementSecuritySettingsUseCase } from '@/usecase/security/settings/refresh-management-security-settings-use-case'
import { ResetManagementSecuritySettingsUseCase } from '@/usecase/security/settings/reset-management-security-settings-use-case'
import { UpdateManagementSecuritySettingsUseCase } from '@/usecase/security/settings/update-management-security-settings-use-case'
import { ObserveManagementSecuritySettingsUseCase } from '@/usecase/security/settings/observe-management-security-settings-use-case'

import { ManagementDeleteAllUserSessionsUseCase } from '@/usecase/session/management-delete-all-user-sessions-use-case'
import { ManagementDeleteSessionUseCase } from '@/usecase/session/management-delete-session-use-case'
import { ManagementGetSessionUseCase } from '@/usecase/session/management-get-session-use-case'
import { ManagementGetSessionsUseCase } from '@/usecase/session/management-get-sessions-use-case'

import { ManagementDisableTotpUseCase } from '@/usecase/user/security/management-disable-totp-use-case'

import { CreateUserUseCase } from '@/usecase/user/create-user-use-case'
import { DeleteUserUseCase } from '@/usecase/user/delete-user-use-case'
import { GetUserUseCase as ManagementGetUserUseCase } from '@/usecase/user/get-user-use-case'
import { GetUsersUseCase } from '@/usecase/user/get-users-use-case'
import { UpdateUserUseCase } from '@/usecase/user/update-user-use-case'

import {
  AddUserIdentifierEmailUseCase,
  AddUserIdentifierPhoneUseCase,
  DeleteAllOtherSessionsUseCase,
  DeleteSessionUseCase,
  DeleteUserIdentifierUseCase,
  DisableTotpUseCase,
  EmailChangePasswordUseCase,
  EnableTotpUseCase,
  GetAvailableUserAuthProvidersUseCase,
  GetRecoveryCodesUseCase,
  GetSessionUseCase,
  GetSessionsUseCase,
  GetUserIdentifierUseCase,
  GetUserIdentifiersUseCase,
  LoginByEmailUseCase,
  LoginByTotpRecoveryCodeUseCase,
  LoginByTotpUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  RegenerateRecoveryCodesUseCase,
  ResetEmailPasswordUseCase,
  RestoreUserUseCase,
  ScheduleUserDeletionUseCase,
  SendAddEmailIdentifierConfirmationUseCase,
  SendAddPhoneIdentifierConfirmationUseCase,
  SendResetPasswordConfirmationToEmailUseCase,
  SendUnlockEmailConfirmationUseCase,
  SendUnlockPhoneConfirmationUseCase,
  SetupTotpUseCase,
  UnlockByEmailUseCase,
  UnlockByPhoneUseCase,
  UserWebSocketMessageHandler
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { AuthStorage, ConfirmationRepository, LoginRepository, RefreshTokenRepository, ResetPasswordRepository, SessionRepository, UserSecurityRepository, UserStorage, UserAuthServices } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ConfirmationRepositoryImpl, EncryptedAuthStorage, EncryptedUserStorage, UserAuthServicesMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { ManagementRootStoreDependencies } from '@/ui/screens/management/management-dependencies'

/**
 * Configuration options required to instantiate {@link ManagementUserComponent}.
 */
export interface ManagementUserComponentConfig {
  /** Injected common component container. */
  commonComponent: CommonComponent
  /** Optional custom HTTP client override. */
  httpClient?: HttpClient
  /** Optional custom encrypted settings store override. */
  encryptedSettings?: EncryptedSettings
  /** Optional custom WebSocket service override. */
  webSocketService?: WebSocketService
  /** Optional custom auth storage override. */
  authStorage?: AuthStorage
  /** Optional custom auth services override. */
  authServices?: UserAuthServices
  /** Optional custom user storage override. */
  userStorage?: UserStorage
  /** Optional open global settings repository override. */
  openGlobalSettingsRepository?: OpenGlobalSettingsRepository
  /** Optional open security settings repository override. */
  openSecuritySettingsRepository?: OpenSecuritySettingsRepository
  /** Optional open storage settings repository override. */
  openStorageSettingsRepository?: OpenStorageSettingsRepository
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
  /** Required composite audit action type parser. */
  compositeActionTypeParser: CompositeAuditActionTypeParser
  /** Required composite audit resource type parser. */
  compositeResourceTypeParser: CompositeAuditResourceTypeParser
  /** Required composite audit metadata key parser. */
  compositeMetadataKeyParser: CompositeAuditMetadataKeyParser
}

/**
 * Dependency injection container for the management user feature.
 */
export class ManagementUserComponent {
  /** Core common component. */
  public readonly commonComponent: CommonComponent

  /** Configured HTTP client instance. */
  public readonly httpClient: HttpClient
  /** Encrypted settings persistence layer. */
  public readonly encryptedSettings: EncryptedSettings
  /** Real-time WebSocket service instance. */
  public readonly webSocketService: WebSocketService

  /** Auth tokens and session storage. */
  public readonly authStorage: AuthStorage
  /** Signed-in staff user profile storage. */
  public readonly userStorage: UserStorage
  /** External authentication provider services. */
  public readonly authServices: UserAuthServices
  /** Confirmation code repository. */
  public readonly confirmationRepository: ConfirmationRepository

  /** Open global settings repository. */
  public readonly openGlobalSettingsRepository: OpenGlobalSettingsRepository
  /** Open security settings repository. */
  public readonly openSecuritySettingsRepository: OpenSecuritySettingsRepository
  /** Open storage settings repository. */
  public readonly openStorageSettingsRepository: OpenStorageSettingsRepository

  /** HTTP API client for management auth settings. */
  public readonly managementAuthSettingsApi: ManagementAuthSettingsApi
  /** Encrypted storage for management auth settings. */
  public readonly managementAuthSettingsStorage: ManagementAuthSettingsStorage
  /** Management auth settings repository. */
  public readonly managementAuthSettingsRepository: ManagementAuthSettingsRepository

  /** HTTP API client for management global settings. */
  public readonly managementGlobalSettingsApi: ManagementGlobalSettingsApi
  /** Encrypted storage for management global settings. */
  public readonly managementGlobalSettingsStorage: ManagementGlobalSettingsStorage
  /** Management global settings repository. */
  public readonly managementGlobalSettingsRepository: ManagementGlobalSettingsRepository

  /** HTTP API client for management security settings. */
  public readonly managementSecuritySettingsApi: ManagementSecuritySettingsApi
  /** Encrypted storage for management security settings. */
  public readonly managementSecuritySettingsStorage: ManagementSecuritySettingsStorage
  /** Management security settings repository. */
  public readonly managementSecuritySettingsRepository: ManagementSecuritySettingsRepository

  /** HTTP API client for management storage settings. */
  public readonly managementStorageSettingsApi: ManagementStorageSettingsApi
  /** Encrypted storage for management storage settings. */
  public readonly managementStorageSettingsStorage: ManagementStorageSettingsStorage
  /** Management storage settings repository. */
  public readonly managementStorageSettingsRepository: ManagementStorageSettingsRepository

  /** HTTP API client for staff self-login endpoints. */
  public readonly selfManagementLoginApi: SelfManagementLoginApi
  /** Staff self-login repository. */
  public readonly selfManagementLoginRepository: LoginRepository

  /** HTTP API client for staff token refresh endpoints. */
  public readonly selfManagementRefreshTokenApi: SelfManagementRefreshTokenApi
  /** Staff refresh token repository. */
  public readonly selfManagementRefreshTokenRepository: RefreshTokenRepository

  /** HTTP API client for staff password reset endpoints. */
  public readonly selfManagementResetPasswordApi: SelfManagementResetPasswordApi
  /** Staff password reset repository. */
  public readonly selfManagementResetPasswordRepository: ResetPasswordRepository

  /** HTTP API client for staff account unlock endpoints. */
  public readonly selfManagementUnlockApi: SelfManagementUnlockApi
  /** Staff account unlock repository. */
  public readonly selfManagementUnlockRepository: SelfManagementUnlockRepository

  /** HTTP API client for management user configuration endpoint. */
  public readonly managementUserConfigurationApi: ManagementUserConfigurationApi

  /** HTTP API client for administrative user identifier operations. */
  public readonly managementIdentifierApi: ManagementIdentifierApi
  /** Administrative user identifier repository. */
  public readonly managementIdentifierRepository: ManagementIdentifierRepository

  /** HTTP API client for staff self-management identifier operations. */
  public readonly selfManagementIdentifiersApi: SelfManagementIdentifiersApi
  /** Staff self-management identifier repository. */
  public readonly selfManagementIdentifierRepository: SelfManagementIdentifierRepository

  /** HTTP API client for administrative user session operations. */
  public readonly managementSessionApi: ManagementSessionApi
  /** Administrative user session repository. */
  public readonly managementSessionRepository: ManagementSessionRepository

  /** HTTP API client for staff self-management session operations. */
  public readonly selfManagementSessionApi: SelfManagementSessionApi
  /** Staff self-management session repository. */
  public readonly selfManagementSessionRepository: SessionRepository

  /** HTTP API client for audit event logs. */
  public readonly managementAuditApi: ManagementAuditApi
  /** Audit log repository. */
  public readonly managementAuditRepository: ManagementAuditRepository

  /** HTTP API client for administrative user security operations. */
  public readonly managementUserSecurityApi: ManagementUserSecurityApi
  /** Administrative user security repository. */
  public readonly managementUserSecurityRepository: ManagementUserSecurityRepository

  /** HTTP API client for staff self-management user security. */
  public readonly selfManagementUserSecurityApi: SelfManagementUserSecurityApi
  /** Staff self-management user security repository. */
  public readonly selfManagementUserSecurityRepository: UserSecurityRepository

  /** HTTP API client for administrative user profile operations. */
  public readonly managementUserApi: ManagementUserApi
  /** Administrative user profile repository. */
  public readonly managementUserRepository: ManagementUserRepository

  /** HTTP API client for staff self-management profile operations. */
  public readonly selfManagementUserApi: SelfManagementUserApi
  /** Staff self-management profile repository. */
  public readonly selfManagementUserRepository: SelfManagementUserRepository

  /** HTTP API client for administrative global storage file operations. */
  public readonly managementStorageApi: ManagementStorageApi
  /** Administrative global storage file repository. */
  public readonly managementStorageRepository: ManagementStorageRepository

  /** HTTP API client for staff self-management storage file operations. */
  public readonly selfManagementStorageApi: StorageApi
  /** Staff self-management storage file repository. */
  public readonly selfManagementStorageRepository: StorageRepository

  /** Get open global settings use case. */
  public readonly getOpenGlobalSettingsUseCase: GetOpenGlobalSettingsUseCase
  /** Get management auth settings use case. */
  public readonly getManagementAuthSettingsUseCase: GetManagementAuthSettingsUseCase
  /** Force refresh management auth settings use case. */
  public readonly refreshManagementAuthSettingsUseCase: RefreshManagementAuthSettingsUseCase
  /** Update management auth settings use case. */
  public readonly updateManagementAuthSettingsUseCase: UpdateManagementAuthSettingsUseCase
  /** Reset management auth settings use case. */
  public readonly resetManagementAuthSettingsUseCase: ResetManagementAuthSettingsUseCase
  /** Observe management auth settings use case. */
  public readonly observeManagementAuthSettingsUseCase: ObserveManagementAuthSettingsUseCase

  /** Get management global settings use case. */
  public readonly getManagementGlobalSettingsUseCase: GetManagementGlobalSettingsUseCase
  /** Force refresh management global settings use case. */
  public readonly refreshManagementGlobalSettingsUseCase: RefreshManagementGlobalSettingsUseCase
  /** Update management global settings use case. */
  public readonly updateManagementGlobalSettingsUseCase: UpdateManagementGlobalSettingsUseCase
  /** Reset management global settings use case. */
  public readonly resetManagementGlobalSettingsUseCase: ResetManagementGlobalSettingsUseCase
  /** Observe management global settings use case. */
  public readonly observeManagementGlobalSettingsUseCase: ObserveManagementGlobalSettingsUseCase

  /** Get management security settings use case. */
  public readonly getManagementSecuritySettingsUseCase: GetManagementSecuritySettingsUseCase
  /** Force refresh management security settings use case. */
  public readonly refreshManagementSecuritySettingsUseCase: RefreshManagementSecuritySettingsUseCase
  /** Update management security settings use case. */
  public readonly updateManagementSecuritySettingsUseCase: UpdateManagementSecuritySettingsUseCase
  /** Reset management security settings use case. */
  public readonly resetManagementSecuritySettingsUseCase: ResetManagementSecuritySettingsUseCase
  /** Observe management security settings use case. */
  public readonly observeManagementSecuritySettingsUseCase: ObserveManagementSecuritySettingsUseCase

  /** Get management storage settings use case. */
  public readonly getManagementStorageSettingsUseCase: GetManagementStorageSettingsUseCase
  /** Force refresh management storage settings use case. */
  public readonly refreshManagementStorageSettingsUseCase: RefreshManagementStorageSettingsUseCase
  /** Update management storage settings use case. */
  public readonly updateManagementStorageSettingsUseCase: UpdateManagementStorageSettingsUseCase
  /** Reset management storage settings use case. */
  public readonly resetManagementStorageSettingsUseCase: ResetManagementStorageSettingsUseCase

  /** Administrative get paginated storage files use case. */
  public readonly managementGetFilesUseCase: ManagementGetFilesUseCase
  /** Administrative get storage file detail use case. */
  public readonly managementGetFileDetailUseCase: ManagementGetFileDetailUseCase
  /** Administrative delete storage file use case. */
  public readonly managementDeleteFileUseCase: ManagementDeleteFileUseCase
  /** Administrative batch delete storage files use case. */
  public readonly managementDeleteFilesBatchUseCase: ManagementDeleteFilesBatchUseCase

  /** Staff self-management get paginated storage files use case. */
  public readonly selfManagementGetFilesUseCase: GetFilesUseCase
  /** Staff self-management get storage file detail use case. */
  public readonly selfManagementGetFileDetailUseCase: GetFileDetailUseCase
  /** Staff self-management upload storage file use case. */
  public readonly selfManagementUploadFileUseCase: UploadFileUseCase
  /** Staff self-management delete storage file use case. */
  public readonly selfManagementDeleteFileUseCase: DeleteFileUseCase
  /** Staff self-management batch delete storage files use case. */
  public readonly selfManagementDeleteFilesBatchUseCase: DeleteFilesBatchUseCase

  /** Refresh management user configuration use case. */
  public readonly refreshManagementUserConfigurationUseCase: RefreshManagementUserConfigurationUseCase

  /** Administrative get user identifiers use case. */
  public readonly managementGetIdentifiersUseCase: ManagementGetIdentifiersUseCase
  /** Administrative get user identifier detail use case. */
  public readonly managementGetIdentifierUseCase: ManagementGetIdentifierUseCase
  /** Administrative delete user identifier use case. */
  public readonly managementDeleteIdentifierUseCase: ManagementDeleteIdentifierUseCase
  /** Administrative delete user identifier password use case. */
  public readonly managementDeleteIdentifierPasswordUseCase: ManagementDeleteIdentifierPasswordUseCase

  /** Administrative get user sessions use case. */
  public readonly managementGetSessionsUseCase: ManagementGetSessionsUseCase
  /** Administrative get user session detail use case. */
  public readonly managementGetSessionUseCase: ManagementGetSessionUseCase
  /** Administrative terminate user session use case. */
  public readonly managementDeleteSessionUseCase: ManagementDeleteSessionUseCase
  /** Administrative terminate all user sessions use case. */
  public readonly managementDeleteAllUserSessionsUseCase: ManagementDeleteAllUserSessionsUseCase

  /** Get paginated audit events log use case. */
  public readonly getAuditEventsUseCase: GetAuditEventsUseCase
  /** Get specific audit event log detail use case. */
  public readonly getAuditEventUseCase: GetAuditEventUseCase

  /** Administrative disable user TOTP use case. */
  public readonly managementDisableTotpUseCase: ManagementDisableTotpUseCase

  /** Get paginated user accounts use case. */
  public readonly getUsersUseCase: GetUsersUseCase
  /** Get specific user account detail use case. */
  public readonly getUserUseCase: ManagementGetUserUseCase
  /** Create new user account use case. */
  public readonly createUserUseCase: CreateUserUseCase
  /** Update user account profile use case. */
  public readonly updateUserUseCase: UpdateUserUseCase
  /** Delete user account use case. */
  public readonly deleteUserUseCase: DeleteUserUseCase

  /** Staff self-management login by email use case. */
  public readonly loginByEmailUseCase: LoginByEmailUseCase
  /** Staff self-management login by TOTP code use case. */
  public readonly loginByTotpUseCase: LoginByTotpUseCase
  /** Staff self-management login by TOTP recovery code use case. */
  public readonly loginByTotpRecoveryCodeUseCase: LoginByTotpRecoveryCodeUseCase
  /** Get available user auth providers use case. */
  public readonly getAvailableUserAuthProvidersUseCase: GetAvailableUserAuthProvidersUseCase
  /** Reset email password use case. */
  public readonly resetEmailPasswordUseCase: ResetEmailPasswordUseCase
  /** Send reset password email confirmation use case. */
  public readonly sendResetPasswordConfirmationToEmailUseCase: SendResetPasswordConfirmationToEmailUseCase
  /** Send unlock account email confirmation use case. */
  public readonly sendUnlockEmailConfirmationUseCase: SendUnlockEmailConfirmationUseCase
  /** Unlock account by email confirmation code use case. */
  public readonly unlockByEmailUseCase: UnlockByEmailUseCase
  /** Send unlock account phone confirmation use case. */
  public readonly sendUnlockPhoneConfirmationUseCase: SendUnlockPhoneConfirmationUseCase
  /** Unlock account by phone confirmation code use case. */
  public readonly unlockByPhoneUseCase: UnlockByPhoneUseCase
  /** Staff self-management get user identifiers use case. */
  public readonly getUserIdentifiersUseCase: GetUserIdentifiersUseCase
  /** Staff self-management get user identifier detail use case. */
  public readonly getUserIdentifierUseCase: GetUserIdentifierUseCase
  /** Staff self-management delete user identifier use case. */
  public readonly deleteUserIdentifierUseCase: DeleteUserIdentifierUseCase
  /** Staff self-management change email password use case. */
  public readonly emailChangePasswordUseCase: EmailChangePasswordUseCase
  /** Staff self-management send add email identifier confirmation use case. */
  public readonly sendAddEmailIdentifierConfirmationUseCase: SendAddEmailIdentifierConfirmationUseCase
  /** Staff self-management add email identifier use case. */
  public readonly addUserIdentifierEmailUseCase: AddUserIdentifierEmailUseCase
  /** Staff self-management send add phone identifier confirmation use case. */
  public readonly sendAddPhoneIdentifierConfirmationUseCase: SendAddPhoneIdentifierConfirmationUseCase
  /** Staff self-management add phone identifier use case. */
  public readonly addUserIdentifierPhoneUseCase: AddUserIdentifierPhoneUseCase
  /** Staff self-management get user sessions use case. */
  public readonly getSessionsUseCase: GetSessionsUseCase
  /** Staff self-management get user session detail use case. */
  public readonly getSessionUseCase: GetSessionUseCase
  /** Staff self-management delete user session use case. */
  public readonly deleteSessionUseCase: DeleteSessionUseCase
  /** Staff self-management delete all other user sessions use case. */
  public readonly deleteAllOtherSessionsUseCase: DeleteAllOtherSessionsUseCase
  /** Staff self-management logout use case. */
  public readonly logoutUseCase: LogoutUseCase
  /** Staff self-management schedule user deletion use case. */
  public readonly scheduleUserDeletionUseCase: ScheduleUserDeletionUseCase
  /** Staff self-management restore user account use case. */
  public readonly restoreUserUseCase: RestoreUserUseCase
  /** Staff self-management setup TOTP use case. */
  public readonly setupTotpUseCase: SetupTotpUseCase
  /** Staff self-management enable TOTP use case. */
  public readonly enableTotpUseCase: EnableTotpUseCase
  /** Staff self-management disable TOTP use case. */
  public readonly disableTotpUseCase: DisableTotpUseCase
  /** Staff self-management get TOTP recovery codes use case. */
  public readonly getRecoveryCodesUseCase: GetRecoveryCodesUseCase
  /** Staff self-management regenerate TOTP recovery codes use case. */
  public readonly regenerateRecoveryCodesUseCase: RegenerateRecoveryCodesUseCase

  /** Returns staff self-user repository. */
  public get selfUserRepository(): SelfManagementUserRepository {
    return this.selfManagementUserRepository
  }

  /** Returns bundle of root UI screen dependencies. */
  public get rootStoreDependencies(): ManagementRootStoreDependencies {
    return {
      selfManagementUserRepository: this.selfManagementUserRepository,
      getManagementAuthSettingsUseCase: this.getManagementAuthSettingsUseCase,
      updateManagementAuthSettingsUseCase: this.updateManagementAuthSettingsUseCase,
      resetManagementAuthSettingsUseCase: this.resetManagementAuthSettingsUseCase,
      getManagementGlobalSettingsUseCase: this.getManagementGlobalSettingsUseCase,
      updateManagementGlobalSettingsUseCase: this.updateManagementGlobalSettingsUseCase,
      resetManagementGlobalSettingsUseCase: this.resetManagementGlobalSettingsUseCase,
      getManagementSecuritySettingsUseCase: this.getManagementSecuritySettingsUseCase,
      updateManagementSecuritySettingsUseCase: this.updateManagementSecuritySettingsUseCase,
      resetManagementSecuritySettingsUseCase: this.resetManagementSecuritySettingsUseCase,
      getManagementStorageSettingsUseCase: this.getManagementStorageSettingsUseCase,
      updateManagementStorageSettingsUseCase: this.updateManagementStorageSettingsUseCase,
      resetManagementStorageSettingsUseCase: this.resetManagementStorageSettingsUseCase,
      managementGetFilesUseCase: this.managementGetFilesUseCase,
      managementGetFileDetailUseCase: this.managementGetFileDetailUseCase,
      managementDeleteFileUseCase: this.managementDeleteFileUseCase,
      managementDeleteFilesBatchUseCase: this.managementDeleteFilesBatchUseCase,
      selfManagementGetFilesUseCase: this.selfManagementGetFilesUseCase,
      selfManagementGetFileDetailUseCase: this.selfManagementGetFileDetailUseCase,
      selfManagementUploadFileUseCase: this.selfManagementUploadFileUseCase,
      selfManagementDeleteFileUseCase: this.selfManagementDeleteFileUseCase,
      selfManagementDeleteFilesBatchUseCase: this.selfManagementDeleteFilesBatchUseCase,
      getUsersUseCase: this.getUsersUseCase,
      getUserUseCase: this.getUserUseCase,
      createUserUseCase: this.createUserUseCase,
      updateUserUseCase: this.updateUserUseCase,
      deleteUserUseCase: this.deleteUserUseCase,
      managementGetSessionsUseCase: this.managementGetSessionsUseCase,
      managementGetSessionUseCase: this.managementGetSessionUseCase,
      managementGetIdentifiersUseCase: this.managementGetIdentifiersUseCase,
      managementGetIdentifierUseCase: this.managementGetIdentifierUseCase,
      managementDisableTotpUseCase: this.managementDisableTotpUseCase,
      managementDeleteSessionUseCase: this.managementDeleteSessionUseCase,
      managementDeleteAllUserSessionsUseCase: this.managementDeleteAllUserSessionsUseCase,
      managementDeleteIdentifierUseCase: this.managementDeleteIdentifierUseCase,
      managementDeleteIdentifierPasswordUseCase: this.managementDeleteIdentifierPasswordUseCase,
      getAuditEventsUseCase: this.getAuditEventsUseCase,
      getAuditEventUseCase: this.getAuditEventUseCase
    }
  }

  /** Real-time WebSocket event message handler. */
  public readonly userWebSocketMessageHandler: UserWebSocketMessageHandler

  /**
   * Constructs a new {@link ManagementUserComponent}.
   *
   * @param config - Injected configuration options
   */
  public constructor(config: ManagementUserComponentConfig) {
    this.commonComponent = config.commonComponent

    this.httpClient = config.httpClient ?? config.commonComponent.httpClient
    this.encryptedSettings = config.encryptedSettings ?? config.commonComponent.encryptedSettings
    this.webSocketService = config.webSocketService ?? config.commonComponent.webSocketService

    this.authStorage = config.authStorage ?? new EncryptedAuthStorage(this.encryptedSettings)
    this.userStorage = config.userStorage ?? new EncryptedUserStorage(this.encryptedSettings)
    this.authServices = config.authServices ?? new UserAuthServicesMock()
    this.confirmationRepository = new ConfirmationRepositoryImpl()

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

    this.openGlobalSettingsRepository =
      config.openGlobalSettingsRepository ??
      new OpenGlobalSettingsRepositoryImpl(
        this.managementGlobalSettingsApi,
        new EncryptedOpenGlobalSettingsStorage(this.encryptedSettings),
        this.webSocketService
      )

    this.openSecuritySettingsRepository =
      config.openSecuritySettingsRepository ??
      new OpenSecuritySettingsRepositoryImpl(
        this.managementSecuritySettingsApi,
        new EncryptedOpenSecuritySettingsStorage(this.encryptedSettings),
        this.webSocketService
      )

    this.openStorageSettingsRepository =
      config.openStorageSettingsRepository ??
      new OpenStorageSettingsRepositoryImpl(
        this.managementStorageSettingsApi,
        new EncryptedOpenStorageSettingsStorage(this.encryptedSettings),
        this.webSocketService
      )

    this.selfManagementLoginApi = new FetchSelfManagementLoginApi(this.httpClient)
    this.selfManagementLoginRepository = new SelfManagementLoginRepositoryImpl(
      this.selfManagementLoginApi
    )

    this.selfManagementRefreshTokenApi = new FetchSelfManagementRefreshTokenApi(this.httpClient)
    this.selfManagementRefreshTokenRepository = new SelfManagementRefreshTokenRepositoryImpl(
      this.selfManagementRefreshTokenApi
    )

    this.selfManagementResetPasswordApi = new FetchSelfManagementResetPasswordApi(this.httpClient)
    this.selfManagementResetPasswordRepository = new SelfManagementResetPasswordRepositoryImpl(
      this.selfManagementResetPasswordApi,
      this.confirmationRepository
    )

    this.selfManagementUnlockApi = new FetchSelfManagementUnlockApi(this.httpClient)
    this.selfManagementUnlockRepository = new SelfManagementUnlockRepositoryImpl(
      this.selfManagementUnlockApi,
      this.confirmationRepository
    )

    this.managementUserConfigurationApi = new FetchManagementUserConfigurationApi(this.httpClient)

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
      this.userStorage,
      this.authStorage
    )

    this.managementAuditApi = new FetchManagementAuditApi(this.httpClient)
    this.managementAuditRepository = new ManagementAuditRepositoryImpl(
      this.managementAuditApi,
      config.compositeActionTypeParser,
      config.compositeResourceTypeParser,
      config.compositeMetadataKeyParser
    )

    this.managementUserSecurityApi = new FetchManagementUserSecurityApi(this.httpClient)
    this.managementUserSecurityRepository = new ManagementUserSecurityRepositoryImpl(
      this.managementUserSecurityApi
    )

    this.selfManagementUserSecurityApi = new FetchSelfManagementUserSecurityApi(this.httpClient)
    this.selfManagementUserSecurityRepository = new SelfManagementUserSecurityRepositoryImpl(
      this.selfManagementUserSecurityApi,
      this.userStorage
    )

    this.managementUserApi = new FetchManagementUserApi(this.httpClient)
    this.managementUserRepository = new ManagementUserRepositoryImpl(
      this.managementUserApi
    )

    this.selfManagementUserApi = new FetchSelfManagementUserApi(this.httpClient)
    this.selfManagementUserRepository = new SelfManagementUserRepositoryImpl(
      this.userStorage,
      this.authStorage,
      this.selfManagementUserApi,
      this.webSocketService
    )

    this.managementStorageApi = new FetchManagementStorageApi(this.httpClient)
    this.managementStorageRepository = new ManagementStorageRepositoryImpl(
      this.managementStorageApi
    )

    this.selfManagementStorageApi = new FetchSelfManagementStorageApi(this.httpClient)
    this.selfManagementStorageRepository = new SelfManagementStorageRepositoryImpl(
      this.selfManagementStorageApi,
      this.webSocketService
    )

    this.getOpenGlobalSettingsUseCase = new GetOpenGlobalSettingsUseCase(this.openGlobalSettingsRepository)
    this.getManagementAuthSettingsUseCase = new GetManagementAuthSettingsUseCase(this.managementAuthSettingsRepository)
    this.refreshManagementAuthSettingsUseCase = new RefreshManagementAuthSettingsUseCase(this.managementAuthSettingsRepository)
    this.updateManagementAuthSettingsUseCase = new UpdateManagementAuthSettingsUseCase(this.managementAuthSettingsRepository)
    this.resetManagementAuthSettingsUseCase = new ResetManagementAuthSettingsUseCase(this.managementAuthSettingsRepository)
    this.observeManagementAuthSettingsUseCase = new ObserveManagementAuthSettingsUseCase(this.managementAuthSettingsRepository)

    this.getManagementGlobalSettingsUseCase = new GetManagementGlobalSettingsUseCase(this.managementGlobalSettingsRepository)
    this.refreshManagementGlobalSettingsUseCase = new RefreshManagementGlobalSettingsUseCase(this.managementGlobalSettingsRepository)
    this.updateManagementGlobalSettingsUseCase = new UpdateManagementGlobalSettingsUseCase(this.managementGlobalSettingsRepository)
    this.resetManagementGlobalSettingsUseCase = new ResetManagementGlobalSettingsUseCase(this.managementGlobalSettingsRepository)
    this.observeManagementGlobalSettingsUseCase = new ObserveManagementGlobalSettingsUseCase(this.managementGlobalSettingsRepository)

    this.getManagementSecuritySettingsUseCase = new GetManagementSecuritySettingsUseCase(this.managementSecuritySettingsRepository)
    this.refreshManagementSecuritySettingsUseCase = new RefreshManagementSecuritySettingsUseCase(this.managementSecuritySettingsRepository)
    this.updateManagementSecuritySettingsUseCase = new UpdateManagementSecuritySettingsUseCase(this.managementSecuritySettingsRepository)
    this.resetManagementSecuritySettingsUseCase = new ResetManagementSecuritySettingsUseCase(this.managementSecuritySettingsRepository)
    this.observeManagementSecuritySettingsUseCase = new ObserveManagementSecuritySettingsUseCase(this.managementSecuritySettingsRepository)

    this.getManagementStorageSettingsUseCase = new GetManagementStorageSettingsUseCase(this.managementStorageSettingsRepository)
    this.refreshManagementStorageSettingsUseCase = new RefreshManagementStorageSettingsUseCase(this.managementStorageSettingsRepository)
    this.updateManagementStorageSettingsUseCase = new UpdateManagementStorageSettingsUseCase(this.managementStorageSettingsRepository)
    this.resetManagementStorageSettingsUseCase = new ResetManagementStorageSettingsUseCase(this.managementStorageSettingsRepository)

    this.managementGetFilesUseCase = new ManagementGetFilesUseCase(this.managementStorageRepository)
    this.managementGetFileDetailUseCase = new ManagementGetFileDetailUseCase(this.managementStorageRepository)
    this.managementDeleteFileUseCase = new ManagementDeleteFileUseCase(this.managementStorageRepository)
    this.managementDeleteFilesBatchUseCase = new ManagementDeleteFilesBatchUseCase(this.managementStorageRepository)

    this.selfManagementGetFilesUseCase = new GetFilesUseCase(this.selfManagementStorageRepository)
    this.selfManagementGetFileDetailUseCase = new GetFileDetailUseCase(this.selfManagementStorageRepository)
    this.selfManagementUploadFileUseCase = new UploadFileUseCase(this.selfManagementStorageRepository)
    this.selfManagementDeleteFileUseCase = new DeleteFileUseCase(this.selfManagementStorageRepository)
    this.selfManagementDeleteFilesBatchUseCase = new DeleteFilesBatchUseCase(this.selfManagementStorageRepository)

    this.refreshManagementUserConfigurationUseCase = new RefreshManagementUserConfigurationUseCase(
      this.managementUserConfigurationApi,
      this.openGlobalSettingsRepository,
      this.openSecuritySettingsRepository,
      this.openStorageSettingsRepository,
      this.managementAuthSettingsRepository,
      this.authStorage
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
    this.getUserUseCase = new ManagementGetUserUseCase(this.managementUserRepository)
    this.createUserUseCase = new CreateUserUseCase(this.managementUserRepository)
    this.updateUserUseCase = new UpdateUserUseCase(this.managementUserRepository)
    this.deleteUserUseCase = new DeleteUserUseCase(this.managementUserRepository)

    const authSettingsAdapter = new ManagementAuthSettingsRepositoryAdapter(this.managementAuthSettingsRepository)
    const unlockAdapter = new SelfManagementUnlockRepositoryAdapter(this.selfManagementUnlockRepository)
    const identifierAdapter = new SelfManagementIdentifierRepositoryAdapter(this.selfManagementIdentifierRepository)

    this.loginByEmailUseCase = new LoginByEmailUseCase(
      this.selfManagementLoginRepository,
      this.authStorage,
      this.userStorage
    )
    this.loginByTotpUseCase = new LoginByTotpUseCase(
      this.selfManagementLoginRepository,
      this.authStorage,
      this.userStorage
    )
    this.loginByTotpRecoveryCodeUseCase = new LoginByTotpRecoveryCodeUseCase(
      this.selfManagementLoginRepository,
      this.authStorage,
      this.userStorage
    )
    this.getAvailableUserAuthProvidersUseCase = new GetAvailableUserAuthProvidersUseCase(
      AppType.MANAGEMENT,
      authSettingsAdapter
    )
    this.resetEmailPasswordUseCase = new ResetEmailPasswordUseCase(
      this.selfManagementResetPasswordRepository
    )
    this.sendResetPasswordConfirmationToEmailUseCase = new SendResetPasswordConfirmationToEmailUseCase(
      this.selfManagementResetPasswordRepository
    )
    this.sendUnlockEmailConfirmationUseCase = new SendUnlockEmailConfirmationUseCase(
      unlockAdapter
    )
    this.unlockByEmailUseCase = new UnlockByEmailUseCase(
      unlockAdapter
    )
    this.sendUnlockPhoneConfirmationUseCase = new SendUnlockPhoneConfirmationUseCase(
      unlockAdapter
    )
    this.unlockByPhoneUseCase = new UnlockByPhoneUseCase(
      unlockAdapter
    )
    this.getUserIdentifiersUseCase = new GetUserIdentifiersUseCase(
      identifierAdapter
    )
    this.getUserIdentifierUseCase = new GetUserIdentifierUseCase(
      identifierAdapter
    )
    this.deleteUserIdentifierUseCase = new DeleteUserIdentifierUseCase(
      identifierAdapter
    )
    this.emailChangePasswordUseCase = new EmailChangePasswordUseCase(
      identifierAdapter
    )
    this.sendAddEmailIdentifierConfirmationUseCase = new SendAddEmailIdentifierConfirmationUseCase(
      identifierAdapter
    )
    this.addUserIdentifierEmailUseCase = new AddUserIdentifierEmailUseCase(
      identifierAdapter
    )
    this.sendAddPhoneIdentifierConfirmationUseCase = new SendAddPhoneIdentifierConfirmationUseCase(
      identifierAdapter
    )
    this.addUserIdentifierPhoneUseCase = new AddUserIdentifierPhoneUseCase(
      identifierAdapter
    )
    this.getSessionsUseCase = new GetSessionsUseCase(
      this.selfManagementSessionRepository
    )
    this.getSessionUseCase = new GetSessionUseCase(
      this.selfManagementSessionRepository
    )
    this.deleteSessionUseCase = new DeleteSessionUseCase(
      this.selfManagementSessionRepository
    )
    this.deleteAllOtherSessionsUseCase = new DeleteAllOtherSessionsUseCase(
      this.selfManagementSessionRepository
    )
    this.logoutUseCase = new LogoutUseCase(
      this.selfManagementSessionRepository,
      this.selfManagementUserRepository
    )
    this.scheduleUserDeletionUseCase = new ScheduleUserDeletionUseCase(
      this.selfManagementUserRepository
    )
    this.restoreUserUseCase = new RestoreUserUseCase(
      this.selfManagementUserRepository
    )
    this.setupTotpUseCase = new SetupTotpUseCase(
      this.selfManagementUserSecurityRepository
    )
    this.enableTotpUseCase = new EnableTotpUseCase(
      this.selfManagementUserSecurityRepository
    )
    this.disableTotpUseCase = new DisableTotpUseCase(
      this.selfManagementUserSecurityRepository
    )
    this.getRecoveryCodesUseCase = new GetRecoveryCodesUseCase(
      this.selfManagementUserSecurityRepository
    )
    this.regenerateRecoveryCodesUseCase = new RegenerateRecoveryCodesUseCase(
      this.selfManagementUserSecurityRepository
    )

    this.userWebSocketMessageHandler = new UserWebSocketMessageHandler(
      this.userStorage,
      this.selfManagementUserRepository,
      this.authStorage,
      new RefreshTokenUseCase(this.selfManagementRefreshTokenRepository, this.authStorage)
    )
  }
}
