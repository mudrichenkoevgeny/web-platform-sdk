import type { CommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { SecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { SettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type {
  AuthStorage,
  ConfirmationRepository,
  LoginRepository,
  RefreshTokenRepository,
  ResetPasswordRepository,
  SessionRepository,
  UnlockRepository,
  UserAuthServices,
  UserSecurityRepository,
  UserStorage,
  UserRepository,
  IdentifierRepository
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import {
  AddUserIdentifierEmailUseCase,
  AddUserIdentifierGoogleUseCase,
  AddUserIdentifierPhoneUseCase,
  AppType,
  ConfirmationRepositoryImpl,
  DeleteAllOtherSessionsUseCase,
  DeleteSessionUseCase,
  DeleteUserIdentifierUseCase,
  DisabledGoogleAuthService,
  DisableTotpUseCase,
  EmailChangePasswordUseCase,
  EnableTotpUseCase,
  EncryptedUserStorage,
  FetchOpenUserConfigurationApi,
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
  ReauthenticateSessionUseCase,
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
  UnlockByExternalAuthProviderUseCase,
  UnlockByPhoneUseCase,
  UserWebSocketMessageHandler
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenUserConfigurationApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { ManagementAuditApi } from '@/network/api/audit/management-audit-api'
import { FetchManagementAuditApi } from '@/network/api/audit/fetch-management-audit-api'
import type { SelfManagementLoginApi } from '@/network/api/auth/login/self-management-login-api'
import { FetchSelfManagementLoginApi } from '@/network/api/auth/login/fetch-self-management-login-api'
import { FetchSelfManagementRefreshTokenApi } from '@/network/api/auth/refresh-token/fetch-self-management-refresh-token-api'
import { FetchSelfManagementResetPasswordApi } from '@/network/api/auth/reset-password/fetch-self-management-reset-password-api'
import type { ManagementAuthSettingsApi } from '@/network/api/auth/settings/management-auth-settings-api'
import { FetchManagementAuthSettingsApi } from '@/network/api/auth/settings/fetch-management-auth-settings-api'
import type { SelfManagementUnlockApi } from '@/network/api/auth/unlock/self-management-unlock-api'
import { FetchSelfManagementUnlockApi } from '@/network/api/auth/unlock/fetch-self-management-unlock-api'
import type { ManagementGlobalSettingsApi } from '@/network/api/global-settings/management-global-settings-api'
import { FetchManagementGlobalSettingsApi } from '@/network/api/global-settings/fetch-management-global-settings-api'
import type { ManagementIdentifierApi } from '@/network/api/identifier/management-identifier-api'
import { FetchManagementIdentifierApi } from '@/network/api/identifier/fetch-management-identifier-api'
import type { SelfManagementIdentifiersApi } from '@/network/api/identifier/self-management-identifiers-api'
import { FetchSelfManagementIdentifiersApi } from '@/network/api/identifier/fetch-self-management-identifiers-api'
import type { ManagementSecuritySettingsApi } from '@/network/api/security/settings/management-security-settings-api'
import { FetchManagementSecuritySettingsApi } from '@/network/api/security/settings/fetch-management-security-settings-api'
import type { ManagementSessionApi } from '@/network/api/session/management-session-api'
import { FetchManagementSessionApi } from '@/network/api/session/fetch-management-session-api'
import { FetchSelfManagementSessionApi } from '@/network/api/session/fetch-self-management-session-api'
import { FetchManagementUserSecurityApi } from '@/network/api/user/security/fetch-management-user-security-api'
import { FetchSelfManagementUserSecurityApi } from '@/network/api/user/security/fetch-self-management-user-security-api'
import type { ManagementUserApi } from '@/network/api/user/management-user-api'
import { FetchManagementUserApi } from '@/network/api/user/fetch-management-user-api'
import type { SelfManagementUserApi } from '@/network/api/user/self-management-user-api'
import { FetchSelfManagementUserApi } from '@/network/api/user/fetch-self-management-user-api'
import type { ManagementAuditRepository } from '@/repository/audit/management-audit-repository'
import { ManagementAuditRepositoryImpl } from '@/repository/audit/management-audit-repository-impl'
import { SelfManagementLoginRepositoryImpl } from '@/repository/auth/login/self-management-login-repository-impl'
import { SelfManagementRefreshTokenRepositoryImpl } from '@/repository/auth/refresh-token/self-management-refresh-token-repository-impl'
import { SelfManagementResetPasswordRepositoryImpl } from '@/repository/auth/reset-password/self-management-reset-password-repository-impl'
import type { ManagementAuthSettingsRepository } from '@/repository/auth/settings/management-auth-settings-repository'
import { ManagementAuthSettingsRepositoryImpl } from '@/repository/auth/settings/management-auth-settings-repository-impl'
import { SelfManagementUnlockRepositoryImpl } from '@/repository/auth/unlock/self-management-unlock-repository-impl'
import type { ManagementGlobalSettingsRepository } from '@/repository/global-settings/management-global-settings-repository'
import { ManagementGlobalSettingsRepositoryImpl } from '@/repository/global-settings/management-global-settings-repository-impl'
import type { ManagementIdentifierRepository } from '@/repository/identifier/management-identifier-repository'
import { ManagementIdentifierRepositoryImpl } from '@/repository/identifier/management-identifier-repository-impl'
import type { SelfManagementIdentifierRepository } from '@/repository/identifier/self-management-identifier-repository'
import { SelfManagementIdentifierRepositoryImpl } from '@/repository/identifier/self-management-identifier-repository-impl'
import type { ManagementSecuritySettingsRepository } from '@/repository/security/settings/management-security-settings-repository'
import { ManagementSecuritySettingsRepositoryImpl } from '@/repository/security/settings/management-security-settings-repository-impl'
import type { ManagementSessionRepository } from '@/repository/session/management-session-repository'
import { ManagementSessionRepositoryImpl } from '@/repository/session/management-session-repository-impl'
import { SelfManagementSessionRepositoryImpl } from '@/repository/session/self-management-session-repository-impl'
import type { ManagementUserRepository } from '@/repository/user/management-user-repository'
import { ManagementUserRepositoryImpl } from '@/repository/user/management-user-repository-impl'
import type { SelfManagementUserRepository } from '@/repository/user/self-management-user-repository'
import { SelfManagementUserRepositoryImpl } from '@/repository/user/self-management-user-repository-impl'
import type { ManagementUserSecurityRepository } from '@/repository/user/security/management-user-security-repository'
import { ManagementUserSecurityRepositoryImpl } from '@/repository/user/security/management-user-security-repository-impl'
import { SelfManagementUserSecurityRepositoryImpl } from '@/repository/user/security/self-management-user-security-repository-impl'

class SelfManagementUserRepositoryAdapter implements UserRepository {
  public constructor(private readonly repo: SelfManagementUserRepository) {}

  public observeCurrentUser(listener: Parameters<UserRepository['observeCurrentUser']>[0]): ReturnType<UserRepository['observeCurrentUser']> {
    return this.repo.observeCurrentUser(listener)
  }

  public refreshCurrentUser(): ReturnType<UserRepository['refreshCurrentUser']> {
    return this.repo.refreshCurrentUser()
  }

  public async scheduleUserDeletion(): ReturnType<UserRepository['scheduleUserDeletion']> {
    throw new Error('Not supported for management users')
  }

  public async restoreUser(): ReturnType<UserRepository['restoreUser']> {
    throw new Error('Not supported for management users')
  }

  public clearSession(): ReturnType<UserRepository['clearSession']> {
    return this.repo.clearSession()
  }
}

class SelfManagementIdentifierRepositoryAdapter implements IdentifierRepository {
  public constructor(private readonly repo: SelfManagementIdentifierRepository) {}

  public getUserIdentifier(...args: Parameters<IdentifierRepository['getUserIdentifier']>): ReturnType<IdentifierRepository['getUserIdentifier']> {
    return this.repo.getUserIdentifier(...args)
  }

  public getUserIdentifiers(...args: Parameters<IdentifierRepository['getUserIdentifiers']>): ReturnType<IdentifierRepository['getUserIdentifiers']> {
    return this.repo.getUserIdentifiers(...args)
  }

  public async deleteUserIdentifier(): ReturnType<IdentifierRepository['deleteUserIdentifier']> {
    throw new Error('Not supported for management users')
  }

  public async addUserIdentifierEmail(): ReturnType<IdentifierRepository['addUserIdentifierEmail']> {
    throw new Error('Not supported for management users')
  }

  public async addUserIdentifierPhone(): ReturnType<IdentifierRepository['addUserIdentifierPhone']> {
    throw new Error('Not supported for management users')
  }

  public async addUserIdentifierExternalAuthProvider(): ReturnType<IdentifierRepository['addUserIdentifierExternalAuthProvider']> {
    throw new Error('Not supported for management users')
  }

  public async sendAddEmailIdentifierConfirmation(): ReturnType<IdentifierRepository['sendAddEmailIdentifierConfirmation']> {
    throw new Error('Not supported for management users')
  }

  public async sendAddPhoneIdentifierConfirmation(): ReturnType<IdentifierRepository['sendAddPhoneIdentifierConfirmation']> {
    throw new Error('Not supported for management users')
  }

  public emailChangePassword(...args: Parameters<IdentifierRepository['emailChangePassword']>): ReturnType<IdentifierRepository['emailChangePassword']> {
    return this.repo.emailChangePassword(...args)
  }

  public getRemainingEmailConfirmationDelayInSeconds(): ReturnType<IdentifierRepository['getRemainingEmailConfirmationDelayInSeconds']> {
    return 0
  }

  public getRemainingPhoneNumberConfirmationDelayInSeconds(): ReturnType<IdentifierRepository['getRemainingPhoneNumberConfirmationDelayInSeconds']> {
    return 0
  }
}
import { EncryptedManagementAuthSettingsStorage } from '@/storage/auth/settings/encrypted-management-auth-settings-storage'
import type { ManagementAuthSettingsStorage } from '@/storage/auth/settings/management-auth-settings-storage'
import { EncryptedManagementGlobalSettingsStorage } from '@/storage/global-settings/encrypted-management-global-settings-storage'
import type { ManagementGlobalSettingsStorage } from '@/storage/global-settings/management-global-settings-storage'
import { EncryptedManagementSecuritySettingsStorage } from '@/storage/security-settings/encrypted-management-security-settings-storage'
import type { ManagementSecuritySettingsStorage } from '@/storage/security-settings/management-security-settings-storage'
import { GetAuditEventUseCase } from '@/usecase/audit/get-audit-event-use-case'
import { GetAuditEventsUseCase } from '@/usecase/audit/get-audit-events-use-case'
import { GetManagementAuthSettingsUseCase } from '@/usecase/auth/settings/get-management-auth-settings-use-case'
import { ObserveManagementAuthSettingsUseCase } from '@/usecase/auth/settings/observe-management-auth-settings-use-case'
import { RefreshManagementAuthSettingsUseCase } from '@/usecase/auth/settings/refresh-management-auth-settings-use-case'
import { ResetRemoteAuthSettingsUseCase } from '@/usecase/auth/settings/reset-remote-auth-settings-use-case'
import { SaveRemoteAuthSettingsUseCase } from '@/usecase/auth/settings/save-remote-auth-settings-use-case'
import { RefreshManagementUserConfigurationUseCase } from '@/usecase/configuration/refresh-management-user-configuration-use-case'
import { GetManagementGlobalSettingsUseCase } from '@/usecase/global-settings/get-management-global-settings-use-case'
import { ObserveManagementGlobalSettingsUseCase } from '@/usecase/global-settings/observe-management-global-settings-use-case'
import { RefreshManagementGlobalSettingsUseCase } from '@/usecase/global-settings/refresh-management-global-settings-use-case'
import { ResetRemoteGlobalSettingsUseCase } from '@/usecase/global-settings/reset-remote-global-settings-use-case'
import { SaveRemoteGlobalSettingsUseCase } from '@/usecase/global-settings/save-remote-global-settings-use-case'
import { ManagementDeleteIdentifierPasswordUseCase } from '@/usecase/identifier/management-delete-identifier-password-use-case'
import { ManagementDeleteIdentifierUseCase } from '@/usecase/identifier/management-delete-identifier-use-case'
import { ManagementGetIdentifierUseCase } from '@/usecase/identifier/management-get-identifier-use-case'
import { ManagementGetIdentifiersUseCase } from '@/usecase/identifier/management-get-identifiers-use-case'
import { GetManagementSecuritySettingsUseCase } from '@/usecase/security/settings/get-management-security-settings-use-case'
import { ObserveManagementSecuritySettingsUseCase } from '@/usecase/security/settings/observe-management-security-settings-use-case'
import { RefreshManagementSecuritySettingsUseCase } from '@/usecase/security/settings/refresh-management-security-settings-use-case'
import { ResetRemoteSecuritySettingsUseCase } from '@/usecase/security/settings/reset-remote-security-settings-use-case'
import { SaveRemoteSecuritySettingsUseCase } from '@/usecase/security/settings/save-remote-security-settings-use-case'
import { ManagementDeleteAllUserSessionsUseCase } from '@/usecase/session/management-delete-all-user-sessions-use-case'
import { ManagementDeleteSessionUseCase } from '@/usecase/session/management-delete-session-use-case'
import { ManagementGetSessionUseCase } from '@/usecase/session/management-get-session-use-case'
import { ManagementGetSessionsUseCase } from '@/usecase/session/management-get-sessions-use-case'
import { CreateUserUseCase } from '@/usecase/user/create-user-use-case'
import { DeleteUserUseCase } from '@/usecase/user/delete-user-use-case'
import { GetUserUseCase } from '@/usecase/user/get-user-use-case'
import { GetUsersUseCase } from '@/usecase/user/get-users-use-case'
import { ManagementDisableTotpUseCase } from '@/usecase/user/security/management-disable-totp-use-case'
import { UpdateUserUseCase } from '@/usecase/user/update-user-use-case'

/**
 * Configuration parameters for instantiating {@link ManagementUserComponent}.
 */
export interface ManagementUserComponentConfig {
  /** Shared infrastructure component. */
  commonComponent: CommonComponent
  /** Global settings component. */
  settingsComponent: SettingsComponent
  /** Security component. */
  securityComponent: SecurityComponent
  /** Token and authentication storage. */
  authStorage: AuthStorage
  /** Platform authentication services. */
  authServices: UserAuthServices
  /** Optional mock override for user storage. */
  userStorage?: UserStorage
  /** Optional mock override for self management login API. */
  selfManagementLoginApi?: SelfManagementLoginApi
  /** Optional mock override for self management unlock API. */
  selfManagementUnlockApi?: SelfManagementUnlockApi
  /** Optional mock override for management auth settings API. */
  managementAuthSettingsApi?: ManagementAuthSettingsApi
  /** Optional mock override for management global settings API. */
  managementGlobalSettingsApi?: ManagementGlobalSettingsApi
  /** Optional mock override for management security settings API. */
  managementSecuritySettingsApi?: ManagementSecuritySettingsApi
  /** Optional mock override for self management identifiers API. */
  selfManagementIdentifiersApi?: SelfManagementIdentifiersApi
  /** Optional mock override for management identifier API. */
  managementIdentifierApi?: ManagementIdentifierApi
  /** Optional mock override for self management session API. */
  selfManagementSessionApi?: FetchSelfManagementSessionApi
  /** Optional mock override for management session API. */
  managementSessionApi?: ManagementSessionApi
  /** Optional mock override for self management user API. */
  selfManagementUserApi?: SelfManagementUserApi
  /** Optional mock override for management user API. */
  managementUserApi?: ManagementUserApi
  /** Optional mock override for management audit API. */
  managementAuditApi?: ManagementAuditApi
}

/**
 * Root dependency injection container for the `feature-managementuser` module.
 */
export class ManagementUserComponent {
  public readonly commonComponent: CommonComponent
  public readonly settingsComponent: SettingsComponent
  public readonly securityComponent: SecurityComponent
  public readonly authStorage: AuthStorage
  public readonly authServices: UserAuthServices

  public readonly userStorage: UserStorage
  public readonly managementAuthSettingsStorage: ManagementAuthSettingsStorage
  public readonly managementGlobalSettingsStorage: ManagementGlobalSettingsStorage
  public readonly managementSecuritySettingsStorage: ManagementSecuritySettingsStorage

  public readonly selfManagementLoginApi: SelfManagementLoginApi
  public readonly selfManagementRefreshTokenApi: FetchSelfManagementRefreshTokenApi
  public readonly selfManagementResetPasswordApi: FetchSelfManagementResetPasswordApi
  public readonly selfManagementUnlockApi: SelfManagementUnlockApi
  public readonly managementAuthSettingsApi: ManagementAuthSettingsApi
  public readonly selfManagementIdentifiersApi: SelfManagementIdentifiersApi
  public readonly managementIdentifierApi: ManagementIdentifierApi
  public readonly selfManagementSessionApi: FetchSelfManagementSessionApi
  public readonly managementSessionApi: ManagementSessionApi
  public readonly selfManagementUserApi: SelfManagementUserApi
  public readonly managementUserApi: ManagementUserApi
  public readonly selfManagementUserSecurityApi: FetchSelfManagementUserSecurityApi
  public readonly managementUserSecurityApi: FetchManagementUserSecurityApi
  public readonly openUserConfigurationApi: OpenUserConfigurationApi
  public readonly managementGlobalSettingsApi: ManagementGlobalSettingsApi
  public readonly managementSecuritySettingsApi: ManagementSecuritySettingsApi
  public readonly managementAuditApi: ManagementAuditApi

  public readonly confirmationRepository: ConfirmationRepository
  public readonly selfManagementLoginRepository: LoginRepository
  public readonly selfManagementRefreshTokenRepository: RefreshTokenRepository
  public readonly selfManagementResetPasswordRepository: ResetPasswordRepository
  public readonly selfManagementUnlockRepository: UnlockRepository
  public readonly managementAuthSettingsRepository: ManagementAuthSettingsRepository
  public readonly selfManagementIdentifierRepository: SelfManagementIdentifierRepository
  public readonly managementIdentifierRepository: ManagementIdentifierRepository
  public readonly selfManagementSessionRepository: SessionRepository
  public readonly managementSessionRepository: ManagementSessionRepository
  public readonly selfManagementUserRepository: SelfManagementUserRepository
  public readonly managementUserRepository: ManagementUserRepository
  public readonly selfManagementUserSecurityRepository: UserSecurityRepository
  public readonly managementUserSecurityRepository: ManagementUserSecurityRepository
  public readonly managementGlobalSettingsRepository: ManagementGlobalSettingsRepository
  public readonly managementSecuritySettingsRepository: ManagementSecuritySettingsRepository
  public readonly managementAuditRepository: ManagementAuditRepository

  public readonly refreshTokenUseCase: RefreshTokenUseCase
  public readonly loginByEmailUseCase: LoginByEmailUseCase
  public readonly loginByTotpUseCase: LoginByTotpUseCase
  public readonly loginByTotpRecoveryCodeUseCase: LoginByTotpRecoveryCodeUseCase
  public readonly refreshManagementAuthSettingsUseCase: RefreshManagementAuthSettingsUseCase
  public readonly refreshManagementGlobalSettingsUseCase: RefreshManagementGlobalSettingsUseCase
  public readonly refreshManagementSecuritySettingsUseCase: RefreshManagementSecuritySettingsUseCase
  public readonly resetEmailPasswordUseCase: ResetEmailPasswordUseCase
  public readonly sendResetPasswordConfirmationToEmailUseCase: SendResetPasswordConfirmationToEmailUseCase
  public readonly sendUnlockEmailConfirmationUseCase: SendUnlockEmailConfirmationUseCase
  public readonly unlockByEmailUseCase: UnlockByEmailUseCase
  public readonly sendUnlockPhoneConfirmationUseCase: SendUnlockPhoneConfirmationUseCase
  public readonly unlockByPhoneUseCase: UnlockByPhoneUseCase
  public readonly unlockByExternalAuthProviderUseCase: UnlockByExternalAuthProviderUseCase
  public readonly getAvailableUserAuthProvidersUseCase: GetAvailableUserAuthProvidersUseCase
  public readonly refreshUserConfigurationUseCase: RefreshManagementUserConfigurationUseCase
  public readonly logoutUseCase: LogoutUseCase
  public readonly scheduleUserDeletionUseCase: ScheduleUserDeletionUseCase
  public readonly restoreUserUseCase: RestoreUserUseCase
  public readonly setupTotpUseCase: SetupTotpUseCase
  public readonly enableTotpUseCase: EnableTotpUseCase
  public readonly disableTotpUseCase: DisableTotpUseCase
  public readonly getRecoveryCodesUseCase: GetRecoveryCodesUseCase
  public readonly regenerateRecoveryCodesUseCase: RegenerateRecoveryCodesUseCase
  public readonly getSessionsUseCase: GetSessionsUseCase
  public readonly getSessionUseCase: GetSessionUseCase
  public readonly deleteSessionUseCase: DeleteSessionUseCase
  public readonly deleteAllOtherSessionsUseCase: DeleteAllOtherSessionsUseCase
  public readonly reauthenticateSessionUseCase: ReauthenticateSessionUseCase
  public readonly getUserIdentifierUseCase: GetUserIdentifierUseCase
  public readonly getUserIdentifiersUseCase: GetUserIdentifiersUseCase
  public readonly deleteUserIdentifierUseCase: DeleteUserIdentifierUseCase
  public readonly sendAddEmailIdentifierConfirmationUseCase: SendAddEmailIdentifierConfirmationUseCase
  public readonly addUserIdentifierEmailUseCase: AddUserIdentifierEmailUseCase
  public readonly sendAddPhoneIdentifierConfirmationUseCase: SendAddPhoneIdentifierConfirmationUseCase
  public readonly addUserIdentifierPhoneUseCase: AddUserIdentifierPhoneUseCase
  public readonly addUserIdentifierGoogleUseCase: AddUserIdentifierGoogleUseCase
  public readonly emailChangePasswordUseCase: EmailChangePasswordUseCase
  public readonly getUsersUseCase: GetUsersUseCase
  public readonly getUserUseCase: GetUserUseCase
  public readonly createUserUseCase: CreateUserUseCase
  public readonly updateUserUseCase: UpdateUserUseCase
  public readonly deleteUserUseCase: DeleteUserUseCase
  public readonly managementGetSessionsUseCase: ManagementGetSessionsUseCase
  public readonly managementGetSessionUseCase: ManagementGetSessionUseCase
  public readonly managementGetIdentifiersUseCase: ManagementGetIdentifiersUseCase
  public readonly managementGetIdentifierUseCase: ManagementGetIdentifierUseCase
  public readonly managementDeleteIdentifierUseCase: ManagementDeleteIdentifierUseCase
  public readonly managementDeleteIdentifierPasswordUseCase: ManagementDeleteIdentifierPasswordUseCase
  public readonly managementDisableTotpUseCase: ManagementDisableTotpUseCase
  public readonly managementDeleteAllUserSessionsUseCase: ManagementDeleteAllUserSessionsUseCase
  public readonly managementDeleteSessionUseCase: ManagementDeleteSessionUseCase
  public readonly getAuditEventsUseCase: GetAuditEventsUseCase
  public readonly getAuditEventUseCase: GetAuditEventUseCase
  public readonly getManagementAuthSettingsUseCase: GetManagementAuthSettingsUseCase
  public readonly saveRemoteAuthSettingsUseCase: SaveRemoteAuthSettingsUseCase
  public readonly resetRemoteAuthSettingsUseCase: ResetRemoteAuthSettingsUseCase
  public readonly getManagementAuthSettingsUseCaseObserved: ObserveManagementAuthSettingsUseCase
  public readonly getManagementGlobalSettingsUseCase: GetManagementGlobalSettingsUseCase
  public readonly saveRemoteGlobalSettingsUseCase: SaveRemoteGlobalSettingsUseCase
  public readonly resetRemoteGlobalSettingsUseCase: ResetRemoteGlobalSettingsUseCase
  public readonly getManagementGlobalSettingsUseCaseObserved: ObserveManagementGlobalSettingsUseCase
  public readonly getManagementSecuritySettingsUseCase: GetManagementSecuritySettingsUseCase
  public readonly saveRemoteSecuritySettingsUseCase: SaveRemoteSecuritySettingsUseCase
  public readonly resetRemoteSecuritySettingsUseCase: ResetRemoteSecuritySettingsUseCase
  public readonly getManagementSecuritySettingsUseCaseObserved: ObserveManagementSecuritySettingsUseCase

  public readonly userWebSocketMessageHandler: UserWebSocketMessageHandler

  public constructor(config: ManagementUserComponentConfig) {
    this.commonComponent = config.commonComponent
    this.settingsComponent = config.settingsComponent
    this.securityComponent = config.securityComponent
    this.authStorage = config.authStorage
    this.authServices = config.authServices

    this.userStorage =
      config.userStorage ?? new EncryptedUserStorage(this.commonComponent.encryptedSettings)
    this.managementAuthSettingsStorage = new EncryptedManagementAuthSettingsStorage(this.commonComponent.encryptedSettings)
    this.managementGlobalSettingsStorage = new EncryptedManagementGlobalSettingsStorage(this.commonComponent.encryptedSettings)
    this.managementSecuritySettingsStorage = new EncryptedManagementSecuritySettingsStorage(this.commonComponent.encryptedSettings)

    this.selfManagementLoginApi =
      config.selfManagementLoginApi ?? new FetchSelfManagementLoginApi(this.commonComponent.httpClient)
    this.selfManagementRefreshTokenApi = new FetchSelfManagementRefreshTokenApi(this.commonComponent.httpClient)
    this.selfManagementResetPasswordApi = new FetchSelfManagementResetPasswordApi(this.commonComponent.httpClient)
    this.selfManagementUnlockApi =
      config.selfManagementUnlockApi ?? new FetchSelfManagementUnlockApi(this.commonComponent.httpClient)
    this.managementAuthSettingsApi =
      config.managementAuthSettingsApi ?? new FetchManagementAuthSettingsApi(this.commonComponent.httpClient)
    this.selfManagementIdentifiersApi =
      config.selfManagementIdentifiersApi ?? new FetchSelfManagementIdentifiersApi(this.commonComponent.httpClient)
    this.managementIdentifierApi =
      config.managementIdentifierApi ?? new FetchManagementIdentifierApi(this.commonComponent.httpClient)
    this.selfManagementSessionApi =
      config.selfManagementSessionApi ?? new FetchSelfManagementSessionApi(this.commonComponent.httpClient)
    this.managementSessionApi =
      config.managementSessionApi ?? new FetchManagementSessionApi(this.commonComponent.httpClient)
    this.selfManagementUserApi =
      config.selfManagementUserApi ?? new FetchSelfManagementUserApi(this.commonComponent.httpClient)
    this.managementUserApi =
      config.managementUserApi ?? new FetchManagementUserApi(this.commonComponent.httpClient)
    this.selfManagementUserSecurityApi = new FetchSelfManagementUserSecurityApi(this.commonComponent.httpClient)
    this.managementUserSecurityApi = new FetchManagementUserSecurityApi(this.commonComponent.httpClient)
    this.openUserConfigurationApi = new FetchOpenUserConfigurationApi(this.commonComponent.httpClient)
    this.managementGlobalSettingsApi =
      config.managementGlobalSettingsApi ?? new FetchManagementGlobalSettingsApi(this.commonComponent.httpClient)
    this.managementSecuritySettingsApi =
      config.managementSecuritySettingsApi ?? new FetchManagementSecuritySettingsApi(this.commonComponent.httpClient)
    this.managementAuditApi =
      config.managementAuditApi ?? new FetchManagementAuditApi(this.commonComponent.httpClient)

    this.confirmationRepository = new ConfirmationRepositoryImpl()
    this.selfManagementLoginRepository = new SelfManagementLoginRepositoryImpl(this.selfManagementLoginApi)
    this.selfManagementRefreshTokenRepository = new SelfManagementRefreshTokenRepositoryImpl(this.selfManagementRefreshTokenApi)
    this.selfManagementResetPasswordRepository = new SelfManagementResetPasswordRepositoryImpl(
      this.selfManagementResetPasswordApi,
      this.confirmationRepository
    )
    this.selfManagementUnlockRepository = new SelfManagementUnlockRepositoryImpl(
      this.selfManagementUnlockApi,
      this.confirmationRepository
    )
    this.managementAuthSettingsRepository = new ManagementAuthSettingsRepositoryImpl(
      this.managementAuthSettingsApi,
      this.managementAuthSettingsStorage,
      this.commonComponent.webSocketService
    )
    this.selfManagementIdentifierRepository = new SelfManagementIdentifierRepositoryImpl(this.selfManagementIdentifiersApi)
    this.managementIdentifierRepository = new ManagementIdentifierRepositoryImpl(this.managementIdentifierApi)
    this.selfManagementSessionRepository = new SelfManagementSessionRepositoryImpl(
      this.selfManagementSessionApi,
      this.userStorage,
      this.authStorage
    )
    this.managementSessionRepository = new ManagementSessionRepositoryImpl(this.managementSessionApi)
    this.selfManagementUserRepository = new SelfManagementUserRepositoryImpl(
      this.userStorage,
      this.authStorage,
      this.selfManagementUserApi,
      this.commonComponent.webSocketService
    )
    this.managementUserRepository = new ManagementUserRepositoryImpl(this.managementUserApi)
    this.selfManagementUserSecurityRepository = new SelfManagementUserSecurityRepositoryImpl(
      this.selfManagementUserSecurityApi,
      this.userStorage
    )
    this.managementUserSecurityRepository = new ManagementUserSecurityRepositoryImpl(this.managementUserSecurityApi)
    this.managementGlobalSettingsRepository = new ManagementGlobalSettingsRepositoryImpl(
      this.managementGlobalSettingsApi,
      this.managementGlobalSettingsStorage,
      this.commonComponent.webSocketService
    )
    this.managementSecuritySettingsRepository = new ManagementSecuritySettingsRepositoryImpl(
      this.managementSecuritySettingsApi,
      this.managementSecuritySettingsStorage,
      this.commonComponent.webSocketService
    )

    this.managementAuditRepository = new ManagementAuditRepositoryImpl(this.managementAuditApi)

    const selfManagementUserRepositoryAdapter = new SelfManagementUserRepositoryAdapter(this.selfManagementUserRepository)
    const selfManagementIdentifierRepositoryAdapter = new SelfManagementIdentifierRepositoryAdapter(this.selfManagementIdentifierRepository)

    this.refreshTokenUseCase = new RefreshTokenUseCase(this.selfManagementRefreshTokenRepository, this.authStorage)
    this.loginByEmailUseCase = new LoginByEmailUseCase(this.selfManagementLoginRepository, this.authStorage, this.userStorage)
    this.loginByTotpUseCase = new LoginByTotpUseCase(this.selfManagementLoginRepository, this.authStorage, this.userStorage)
    this.loginByTotpRecoveryCodeUseCase = new LoginByTotpRecoveryCodeUseCase(this.selfManagementLoginRepository, this.authStorage, this.userStorage)
    this.refreshManagementAuthSettingsUseCase = new RefreshManagementAuthSettingsUseCase(this.managementAuthSettingsRepository)
    this.refreshManagementGlobalSettingsUseCase = new RefreshManagementGlobalSettingsUseCase(this.managementGlobalSettingsRepository)
    this.refreshManagementSecuritySettingsUseCase = new RefreshManagementSecuritySettingsUseCase(this.managementSecuritySettingsRepository)
    this.resetEmailPasswordUseCase = new ResetEmailPasswordUseCase(this.selfManagementResetPasswordRepository)
    this.sendResetPasswordConfirmationToEmailUseCase = new SendResetPasswordConfirmationToEmailUseCase(this.selfManagementResetPasswordRepository)
    this.sendUnlockEmailConfirmationUseCase = new SendUnlockEmailConfirmationUseCase(this.selfManagementUnlockRepository)
    this.unlockByEmailUseCase = new UnlockByEmailUseCase(this.selfManagementUnlockRepository)
    this.sendUnlockPhoneConfirmationUseCase = new SendUnlockPhoneConfirmationUseCase(this.selfManagementUnlockRepository)
    this.unlockByPhoneUseCase = new UnlockByPhoneUseCase(this.selfManagementUnlockRepository)
    this.unlockByExternalAuthProviderUseCase = new UnlockByExternalAuthProviderUseCase(this.selfManagementUnlockRepository)
    this.getAvailableUserAuthProvidersUseCase = new GetAvailableUserAuthProvidersUseCase(AppType.MANAGEMENT, null)
    this.refreshUserConfigurationUseCase = new RefreshManagementUserConfigurationUseCase(
      this.openUserConfigurationApi,
      this.settingsComponent.globalSettingsRepository,
      this.securityComponent.securitySettingsRepository
    )
    this.logoutUseCase = new LogoutUseCase(this.selfManagementSessionRepository, selfManagementUserRepositoryAdapter)
    this.scheduleUserDeletionUseCase = new ScheduleUserDeletionUseCase(selfManagementUserRepositoryAdapter)
    this.restoreUserUseCase = new RestoreUserUseCase(selfManagementUserRepositoryAdapter)
    this.setupTotpUseCase = new SetupTotpUseCase(this.selfManagementUserSecurityRepository)
    this.enableTotpUseCase = new EnableTotpUseCase(this.selfManagementUserSecurityRepository)
    this.disableTotpUseCase = new DisableTotpUseCase(this.selfManagementUserSecurityRepository)
    this.getRecoveryCodesUseCase = new GetRecoveryCodesUseCase(this.selfManagementUserSecurityRepository)
    this.regenerateRecoveryCodesUseCase = new RegenerateRecoveryCodesUseCase(this.selfManagementUserSecurityRepository)
    this.getSessionsUseCase = new GetSessionsUseCase(this.selfManagementSessionRepository)
    this.getSessionUseCase = new GetSessionUseCase(this.selfManagementSessionRepository)
    this.deleteSessionUseCase = new DeleteSessionUseCase(this.selfManagementSessionRepository)
    this.deleteAllOtherSessionsUseCase = new DeleteAllOtherSessionsUseCase(this.selfManagementSessionRepository)
    this.reauthenticateSessionUseCase = new ReauthenticateSessionUseCase(this.selfManagementSessionRepository)
    this.getUserIdentifierUseCase = new GetUserIdentifierUseCase(selfManagementIdentifierRepositoryAdapter)
    this.getUserIdentifiersUseCase = new GetUserIdentifiersUseCase(selfManagementIdentifierRepositoryAdapter)
    this.deleteUserIdentifierUseCase = new DeleteUserIdentifierUseCase(selfManagementIdentifierRepositoryAdapter)
    this.sendAddEmailIdentifierConfirmationUseCase = new SendAddEmailIdentifierConfirmationUseCase(selfManagementIdentifierRepositoryAdapter)
    this.addUserIdentifierEmailUseCase = new AddUserIdentifierEmailUseCase(selfManagementIdentifierRepositoryAdapter)
    this.sendAddPhoneIdentifierConfirmationUseCase = new SendAddPhoneIdentifierConfirmationUseCase(selfManagementIdentifierRepositoryAdapter)
    this.addUserIdentifierPhoneUseCase = new AddUserIdentifierPhoneUseCase(selfManagementIdentifierRepositoryAdapter)
    this.addUserIdentifierGoogleUseCase = new AddUserIdentifierGoogleUseCase(
      this.authServices.googleAuth ?? new DisabledGoogleAuthService(),
      selfManagementIdentifierRepositoryAdapter
    )
    this.emailChangePasswordUseCase = new EmailChangePasswordUseCase(selfManagementIdentifierRepositoryAdapter)
    this.getUsersUseCase = new GetUsersUseCase(this.managementUserRepository)
    this.getUserUseCase = new GetUserUseCase(this.managementUserRepository)
    this.createUserUseCase = new CreateUserUseCase(this.managementUserRepository)
    this.updateUserUseCase = new UpdateUserUseCase(this.managementUserRepository)
    this.deleteUserUseCase = new DeleteUserUseCase(this.managementUserRepository)
    this.managementGetSessionsUseCase = new ManagementGetSessionsUseCase(this.managementSessionRepository)
    this.managementGetSessionUseCase = new ManagementGetSessionUseCase(this.managementSessionRepository)
    this.managementGetIdentifiersUseCase = new ManagementGetIdentifiersUseCase(this.managementIdentifierRepository)
    this.managementGetIdentifierUseCase = new ManagementGetIdentifierUseCase(this.managementIdentifierRepository)
    this.managementDeleteIdentifierUseCase = new ManagementDeleteIdentifierUseCase(this.managementIdentifierRepository)
    this.managementDeleteIdentifierPasswordUseCase = new ManagementDeleteIdentifierPasswordUseCase(this.managementIdentifierRepository)
    this.managementDisableTotpUseCase = new ManagementDisableTotpUseCase(this.managementUserSecurityRepository)
    this.managementDeleteAllUserSessionsUseCase = new ManagementDeleteAllUserSessionsUseCase(this.managementSessionRepository)
    this.managementDeleteSessionUseCase = new ManagementDeleteSessionUseCase(this.managementSessionRepository)
    this.getAuditEventsUseCase = new GetAuditEventsUseCase(this.managementAuditRepository)
    this.getAuditEventUseCase = new GetAuditEventUseCase(this.managementAuditRepository)
    this.getManagementAuthSettingsUseCase = new GetManagementAuthSettingsUseCase(this.managementAuthSettingsRepository)
    this.saveRemoteAuthSettingsUseCase = new SaveRemoteAuthSettingsUseCase(this.managementAuthSettingsRepository)
    this.resetRemoteAuthSettingsUseCase = new ResetRemoteAuthSettingsUseCase(this.managementAuthSettingsRepository)
    this.getManagementAuthSettingsUseCaseObserved = new ObserveManagementAuthSettingsUseCase(this.managementAuthSettingsRepository)
    this.getManagementGlobalSettingsUseCase = new GetManagementGlobalSettingsUseCase(this.managementGlobalSettingsRepository)
    this.saveRemoteGlobalSettingsUseCase = new SaveRemoteGlobalSettingsUseCase(this.managementGlobalSettingsRepository)
    this.resetRemoteGlobalSettingsUseCase = new ResetRemoteGlobalSettingsUseCase(this.managementGlobalSettingsRepository)
    this.getManagementGlobalSettingsUseCaseObserved = new ObserveManagementGlobalSettingsUseCase(this.managementGlobalSettingsRepository)
    this.getManagementSecuritySettingsUseCase = new GetManagementSecuritySettingsUseCase(this.managementSecuritySettingsRepository)
    this.saveRemoteSecuritySettingsUseCase = new SaveRemoteSecuritySettingsUseCase(this.managementSecuritySettingsRepository)
    this.resetRemoteSecuritySettingsUseCase = new ResetRemoteSecuritySettingsUseCase(this.managementSecuritySettingsRepository)
    this.getManagementSecuritySettingsUseCaseObserved = new ObserveManagementSecuritySettingsUseCase(this.managementSecuritySettingsRepository)

    this.userWebSocketMessageHandler = new UserWebSocketMessageHandler(
      this.userStorage,
      selfManagementUserRepositoryAdapter,
      this.authStorage,
      this.refreshTokenUseCase
    )
  }
}
