import type {
  CommonComponent,
  EncryptedSettings,
  SecurityComponent,
  SettingsComponent
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import type { UserAuthServices } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import {
  AddUserIdentifierEmailUseCase,
  AddUserIdentifierGoogleUseCase,
  AddUserIdentifierPhoneUseCase,
  DeleteAllOtherSessionsUseCase,
  DeletePasswordUseCase,
  DeleteSessionUseCase,
  DeleteFileUseCase,
  DeleteFilesBatchUseCase,
  DeleteUserIdentifierUseCase,
  DisabledGoogleAuthService,
  DisableTotpUseCase,
  EmailChangePasswordUseCase,
  EnableTotpUseCase,
  EncryptedAuthStorage,
  EncryptedOpenAuthSettingsStorage,
  EncryptedUserStorage,
  FetchOpenAuthSettingsApi,
  FetchOpenIdentifiersApi,
  FetchOpenLoginApi,
  FetchOpenRefreshTokenApi,
  FetchOpenUserApi,
  FetchOpenUserConfigurationApi,
  FetchOpenUserSecurityApi,
  FetchRegistrationApi,
  FetchResetPasswordApi,
  FetchOpenUnlockApi,
  GetAuthSettingsUseCase,
  GetAvailableUserAuthProvidersUseCase,
  GetRecoveryCodesUseCase,
  GetFileDetailUseCase,
  GetFilesUseCase,
  GetSessionUseCase,
  GetSessionsUseCase,
  GetUserIdentifierUseCase,
  GetUserIdentifiersUseCase,
  GetUserUseCase,
  LoginByEmailUseCase,
  LoginByGoogleUseCase,
  LoginByPhoneUseCase,
  LoginByTotpRecoveryCodeUseCase,
  LoginByTotpUseCase,
  LogoutUseCase,
  ReauthenticateSessionUseCase,
  RefreshTokenUseCase,
  RegenerateRecoveryCodesUseCase,
  RegistrationByEmailUseCase,
  ResetEmailPasswordUseCase,
  RestoreUserUseCase,
  ScheduleUserDeletionUseCase,
  SendAddEmailIdentifierConfirmationUseCase,
  SendAddPhoneIdentifierConfirmationUseCase,
  SendLoginConfirmationToPhoneUseCase,
  SendRegistrationConfirmationToEmailUseCase,
  SendResetPasswordConfirmationToEmailUseCase,
  SendUnlockEmailConfirmationUseCase,
  SendUnlockPhoneConfirmationUseCase,
  SetupTotpUseCase,
  UnlockByEmailUseCase,
  UnlockByExternalAuthProviderUseCase,
  UnlockByGoogleUseCase,
  UnlockByPhoneUseCase,
  UploadFileUseCase,
  UserWebSocketMessageHandler
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type {
  AuthStorage,
  ConfirmationRepository,
  IdentifierRepository,
  LoginRepository,
  OpenAuthSettingsApi,
  OpenAuthSettingsRepository,
  OpenIdentifiersApi,
  OpenLoginApi,
  OpenRefreshTokenApi,
  OpenRegistrationApi,
  OpenResetPasswordApi,
  OpenUnlockApi,
  OpenUserApi,
  OpenUserConfigurationApi,
  OpenUserConfigurationRepository,
  RefreshTokenRepository,
  RegistrationRepository,
  ResetPasswordRepository,
  SessionApi,
  SessionRepository,
  UnlockRepository,
  UserStorage
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

import type { OpenStorageApi } from '@/network/api/storage/open-storage-api'
import { FetchOpenStorageApi } from '@/network/api/storage/fetch-open-storage-api'
import type { OpenStorageRepository } from '@/repository/storage/open-storage-repository'
import { OpenStorageRepositoryImpl } from '@/repository/storage/open-storage-repository-impl'

import { OpenAuthSettingsRepositoryImpl } from '@/repository/auth/settings/open-auth-settings-repository-impl'
import { OpenIdentifierRepositoryImpl } from '@/repository/identifier/open-identifier-repository-impl'
import { OpenLoginRepositoryImpl } from '@/repository/auth/login/open-login-repository-impl'
import { OpenRefreshTokenRepositoryImpl } from '@/repository/auth/refresh-token/open-refresh-token-repository-impl'

import { OpenRegistrationRepositoryImpl } from '@/repository/auth/registration/open-registration-repository-impl'
import { OpenResetPasswordRepositoryImpl } from '@/repository/auth/reset-password/open-reset-password-repository-impl'
import { OpenSessionRepositoryImpl } from '@/repository/session/open-session-repository-impl'
import { OpenUnlockRepositoryImpl } from '@/repository/auth/unlock/open-unlock-repository-impl'
import { OpenUserConfigurationRepositoryImpl } from '@/repository/configuration/open-user-configuration-repository-impl'
import { OpenUserRepositoryImpl } from '@/repository/user/open-user-repository-impl'
import { OpenUserSecurityRepositoryImpl } from '@/repository/user/security/open-user-security-repository-impl'
import { FetchOpenSessionApi } from '@/network/api/session/fetch-open-session-api'
import { RefreshOpenAuthSettingsUseCase } from '@/usecase/auth/settings/refresh-open-auth-settings-use-case'
import { RefreshClientUserConfigurationUseCase } from '@/usecase/configuration/refresh-client-user-configuration-use-case'

/**
 * Configuration options required to instantiate {@link ClientUserComponent}.
 */
export interface ClientUserComponentConfig {
  /** Injected common component container. */
  commonComponent: CommonComponent
  /** Injected settings component container. */
  settingsComponent: SettingsComponent
  /** Injected security component container. */
  securityComponent: SecurityComponent
  /** Pluggable external authentication providers (e.g. Google Auth SDK). */
  authServices: UserAuthServices
  /** Optional custom encrypted settings store override. */
  encryptedSettings?: EncryptedSettings
  /** Optional custom auth storage override. */
  authStorage?: AuthStorage
  /** Optional custom user storage override. */
  userStorage?: UserStorage
  /** Optional custom open storage API override. */
  openStorageApi?: OpenStorageApi
}

/**
 * Root dependency injection container for client user feature.
 */
export class ClientUserComponent {
  public readonly commonComponent: CommonComponent
  public readonly settingsComponent: SettingsComponent
  public readonly securityComponent: SecurityComponent
  public readonly authServices: UserAuthServices

  public readonly authStorage: AuthStorage
  public readonly userStorage: UserStorage
  public readonly openAuthSettingsStorage: EncryptedOpenAuthSettingsStorage

  public readonly openAuthSettingsApi: OpenAuthSettingsApi
  public readonly openAuthSettingsRepository: OpenAuthSettingsRepository

  public readonly openLoginApi: OpenLoginApi
  public readonly loginRepository: LoginRepository

  public readonly openRefreshTokenApi: OpenRefreshTokenApi
  public readonly refreshTokenRepository: RefreshTokenRepository

  public readonly openRegistrationApi: OpenRegistrationApi
  public readonly registrationRepository: RegistrationRepository

  public readonly openResetPasswordApi: OpenResetPasswordApi
  public readonly resetPasswordRepository: ResetPasswordRepository

  public readonly openUnlockApi: OpenUnlockApi
  public readonly unlockRepository: UnlockRepository

  public readonly openUserConfigurationApi: OpenUserConfigurationApi
  public readonly openUserConfigurationRepository: OpenUserConfigurationRepository

  public readonly openIdentifiersApi: OpenIdentifiersApi
  public readonly identifierRepository: IdentifierRepository

  public readonly sessionApi: SessionApi
  public readonly sessionRepository: SessionRepository

  public readonly openUserSecurityApi: OpenUserSecurityApi
  public readonly userSecurityRepository: UserSecurityRepository

  public readonly openUserApi: OpenUserApi
  public readonly userRepository: UserRepository

  public readonly openStorageApi: OpenStorageApi
  public readonly openStorageRepository: OpenStorageRepository

  public readonly confirmationRepository: ConfirmationRepository

  public readonly refreshTokenUseCase: RefreshTokenUseCase
  public readonly loginByEmailUseCase: LoginByEmailUseCase
  public readonly loginByPhoneUseCase: LoginByPhoneUseCase
  public readonly sendLoginConfirmationToPhoneUseCase: SendLoginConfirmationToPhoneUseCase
  public readonly loginByGoogleUseCase: LoginByGoogleUseCase
  public readonly loginByTotpUseCase: LoginByTotpUseCase
  public readonly loginByTotpRecoveryCodeUseCase: LoginByTotpRecoveryCodeUseCase
  public readonly registrationByEmailUseCase: RegistrationByEmailUseCase
  public readonly sendRegistrationConfirmationToEmailUseCase: SendRegistrationConfirmationToEmailUseCase
  public readonly refreshOpenAuthSettingsUseCase: RefreshOpenAuthSettingsUseCase
  public readonly getAvailableUserAuthProvidersUseCase: GetAvailableUserAuthProvidersUseCase
  public readonly getAuthSettingsUseCase: GetAuthSettingsUseCase
  public readonly resetEmailPasswordUseCase: ResetEmailPasswordUseCase
  public readonly sendResetPasswordConfirmationToEmailUseCase: SendResetPasswordConfirmationToEmailUseCase
  public readonly sendUnlockEmailConfirmationUseCase: SendUnlockEmailConfirmationUseCase
  public readonly unlockByEmailUseCase: UnlockByEmailUseCase
  public readonly sendUnlockPhoneConfirmationUseCase: SendUnlockPhoneConfirmationUseCase
  public readonly unlockByPhoneUseCase: UnlockByPhoneUseCase
  public readonly unlockByExternalAuthProviderUseCase: UnlockByExternalAuthProviderUseCase
  public readonly unlockByGoogleUseCase: UnlockByGoogleUseCase
  public readonly refreshUserConfigurationUseCase: RefreshClientUserConfigurationUseCase
  public readonly scheduleUserDeletionUseCase: ScheduleUserDeletionUseCase
  public readonly restoreUserUseCase: RestoreUserUseCase
  public readonly setupTotpUseCase: SetupTotpUseCase
  public readonly enableTotpUseCase: EnableTotpUseCase
  public readonly disableTotpUseCase: DisableTotpUseCase
  public readonly getRecoveryCodesUseCase: GetRecoveryCodesUseCase
  public readonly regenerateRecoveryCodesUseCase: RegenerateRecoveryCodesUseCase
  public readonly getSessionsUseCase: GetSessionsUseCase
  public readonly getSessionUseCase: GetSessionUseCase
  public readonly logoutUseCase: LogoutUseCase
  public readonly deleteSessionUseCase: DeleteSessionUseCase
  public readonly deleteAllOtherSessionsUseCase: DeleteAllOtherSessionsUseCase
  public readonly reauthenticateSessionUseCase: ReauthenticateSessionUseCase
  public readonly getUserUseCase: GetUserUseCase
  public readonly getUserIdentifierUseCase: GetUserIdentifierUseCase
  public readonly getUserIdentifiersUseCase: GetUserIdentifiersUseCase
  public readonly deleteUserIdentifierUseCase: DeleteUserIdentifierUseCase
  public readonly deletePasswordUseCase: DeletePasswordUseCase
  public readonly addUserIdentifierEmailUseCase: AddUserIdentifierEmailUseCase
  public readonly addUserIdentifierPhoneUseCase: AddUserIdentifierPhoneUseCase
  public readonly addUserIdentifierGoogleUseCase: AddUserIdentifierGoogleUseCase
  public readonly sendAddEmailIdentifierConfirmationUseCase: SendAddEmailIdentifierConfirmationUseCase
  public readonly sendAddPhoneIdentifierConfirmationUseCase: SendAddPhoneIdentifierConfirmationUseCase
  public readonly emailChangePasswordUseCase: EmailChangePasswordUseCase

  public readonly getFilesUseCase: GetFilesUseCase
  public readonly getFileDetailUseCase: GetFileDetailUseCase
  public readonly uploadFileUseCase: UploadFileUseCase
  public readonly deleteFileUseCase: DeleteFileUseCase
  public readonly deleteFilesBatchUseCase: DeleteFilesBatchUseCase

  public readonly userWebSocketMessageHandler: UserWebSocketMessageHandler

  public constructor(config: ClientUserComponentConfig) {
    this.commonComponent = config.commonComponent
    this.settingsComponent = config.settingsComponent
    this.securityComponent = config.securityComponent
    this.authStorage = config.authStorage ?? new EncryptedAuthStorage(this.commonComponent.encryptedSettings)
    this.authServices = config.authServices

    this.userStorage =
      config.userStorage ?? new EncryptedUserStorage(this.commonComponent.encryptedSettings)
    this.openAuthSettingsStorage = new EncryptedOpenAuthSettingsStorage(this.commonComponent.encryptedSettings)

    this.openAuthSettingsApi = new FetchOpenAuthSettingsApi(this.commonComponent.httpClient)
    this.openAuthSettingsRepository = new OpenAuthSettingsRepositoryImpl(
      this.openAuthSettingsApi,
      this.openAuthSettingsStorage,
      this.commonComponent.webSocketService
    )

    this.openLoginApi = new FetchOpenLoginApi(this.commonComponent.httpClient)
    this.loginRepository = new OpenLoginRepositoryImpl(
      this.openLoginApi,
      this.authStorage,
      this.userStorage
    )

    this.openRefreshTokenApi = new FetchOpenRefreshTokenApi(this.commonComponent.httpClient)
    this.refreshTokenRepository = new OpenRefreshTokenRepositoryImpl(
      this.openRefreshTokenApi,
      this.authStorage
    )

    this.openRegistrationApi = new FetchRegistrationApi(this.commonComponent.httpClient)
    this.registrationRepository = new OpenRegistrationRepositoryImpl(
      this.openRegistrationApi,
      this.authStorage,
      this.userStorage
    )

    this.openResetPasswordApi = new FetchResetPasswordApi(this.commonComponent.httpClient)
    this.resetPasswordRepository = new OpenResetPasswordRepositoryImpl(
      this.openResetPasswordApi
    )

    this.openUnlockApi = new FetchOpenUnlockApi(this.commonComponent.httpClient)
    this.unlockRepository = new OpenUnlockRepositoryImpl(
      this.openUnlockApi,
      this.authStorage,
      this.userStorage
    )

    this.openUserConfigurationApi = new FetchOpenUserConfigurationApi(this.commonComponent.httpClient)
    this.openUserConfigurationRepository = new OpenUserConfigurationRepositoryImpl(
      this.openUserConfigurationApi
    )

    this.openIdentifiersApi = new FetchOpenIdentifiersApi(this.commonComponent.httpClient)
    this.identifierRepository = new OpenIdentifierRepositoryImpl(
      this.openIdentifiersApi
    )

    this.sessionApi = new FetchOpenSessionApi(this.commonComponent.httpClient)
    this.sessionRepository = new OpenSessionRepositoryImpl(
      this.sessionApi,
      this.authStorage,
      this.userStorage
    )

    this.openUserSecurityApi = new FetchOpenUserSecurityApi(this.commonComponent.httpClient)
    this.userSecurityRepository = new OpenUserSecurityRepositoryImpl(
      this.openUserSecurityApi
    )

    this.openUserApi = new FetchOpenUserApi(this.commonComponent.httpClient)
    this.userRepository = new OpenUserRepositoryImpl(
      this.openUserApi,
      this.userStorage
    )

    this.openStorageApi = config.openStorageApi ?? new FetchOpenStorageApi(this.commonComponent.httpClient)
    this.openStorageRepository = new OpenStorageRepositoryImpl(
      this.openStorageApi,
      this.commonComponent.webSocketService
    )

    this.confirmationRepository = this.identifierRepository

    this.refreshTokenUseCase = new RefreshTokenUseCase(this.refreshTokenRepository, this.authStorage)
    this.loginByEmailUseCase = new LoginByEmailUseCase(this.loginRepository, this.authStorage, this.userStorage)
    this.loginByPhoneUseCase = new LoginByPhoneUseCase(this.loginRepository, this.authStorage, this.userStorage)
    this.sendLoginConfirmationToPhoneUseCase = new SendLoginConfirmationToPhoneUseCase(this.loginRepository)
    this.loginByGoogleUseCase = new LoginByGoogleUseCase(
      this.authServices.googleAuth ?? new DisabledGoogleAuthService(),
      this.loginRepository,
      this.authStorage,
      this.userStorage
    )
    this.loginByTotpUseCase = new LoginByTotpUseCase(this.loginRepository, this.authStorage, this.userStorage)
    this.loginByTotpRecoveryCodeUseCase = new LoginByTotpRecoveryCodeUseCase(this.loginRepository, this.authStorage, this.userStorage)
    this.registrationByEmailUseCase = new RegistrationByEmailUseCase(this.registrationRepository, this.authStorage, this.userStorage)
    this.sendRegistrationConfirmationToEmailUseCase = new SendRegistrationConfirmationToEmailUseCase(this.registrationRepository)
    this.refreshOpenAuthSettingsUseCase = new RefreshOpenAuthSettingsUseCase(this.openAuthSettingsRepository)
    this.getAvailableUserAuthProvidersUseCase = new GetAvailableUserAuthProvidersUseCase(AppType.CLIENT, this.openAuthSettingsRepository)
    this.getAuthSettingsUseCase = new GetAuthSettingsUseCase(this.openAuthSettingsRepository)
    this.resetEmailPasswordUseCase = new ResetEmailPasswordUseCase(this.resetPasswordRepository)
    this.sendResetPasswordConfirmationToEmailUseCase = new SendResetPasswordConfirmationToEmailUseCase(this.resetPasswordRepository)
    this.sendUnlockEmailConfirmationUseCase = new SendUnlockEmailConfirmationUseCase(this.unlockRepository)
    this.unlockByEmailUseCase = new UnlockByEmailUseCase(this.unlockRepository)
    this.sendUnlockPhoneConfirmationUseCase = new SendUnlockPhoneConfirmationUseCase(this.unlockRepository)
    this.unlockByPhoneUseCase = new UnlockByPhoneUseCase(this.unlockRepository)
    this.unlockByExternalAuthProviderUseCase = new UnlockByExternalAuthProviderUseCase(this.unlockRepository)
    this.unlockByGoogleUseCase = new UnlockByGoogleUseCase(
      this.authServices.googleAuth ?? new DisabledGoogleAuthService(),
      this.unlockRepository
    )
    this.refreshUserConfigurationUseCase = new RefreshClientUserConfigurationUseCase(
      this.openUserConfigurationApi,
      this.openUserConfigurationRepository
    )
    this.scheduleUserDeletionUseCase = new ScheduleUserDeletionUseCase(this.userRepository)
    this.restoreUserUseCase = new RestoreUserUseCase(this.userRepository)
    this.setupTotpUseCase = new SetupTotpUseCase(this.userSecurityRepository)
    this.enableTotpUseCase = new EnableTotpUseCase(this.userSecurityRepository)
    this.disableTotpUseCase = new DisableTotpUseCase(this.userSecurityRepository)
    this.getRecoveryCodesUseCase = new GetRecoveryCodesUseCase(this.userSecurityRepository)
    this.regenerateRecoveryCodesUseCase = new RegenerateRecoveryCodesUseCase(this.userSecurityRepository)

    this.getSessionsUseCase = new GetSessionsUseCase(this.sessionRepository)
    this.getSessionUseCase = new GetSessionUseCase(this.sessionRepository)
    this.logoutUseCase = new LogoutUseCase(this.sessionRepository, this.authStorage, this.userStorage)
    this.deleteSessionUseCase = new DeleteSessionUseCase(this.sessionRepository)
    this.deleteAllOtherSessionsUseCase = new DeleteAllOtherSessionsUseCase(this.sessionRepository)
    this.reauthenticateSessionUseCase = new ReauthenticateSessionUseCase(this.sessionRepository)

    this.getUserUseCase = new GetUserUseCase(this.userRepository)
    this.getUserIdentifierUseCase = new GetUserIdentifierUseCase(this.identifierRepository)
    this.getUserIdentifiersUseCase = new GetUserIdentifiersUseCase(this.identifierRepository)
    this.deleteUserIdentifierUseCase = new DeleteUserIdentifierUseCase(this.identifierRepository)
    this.deletePasswordUseCase = new DeletePasswordUseCase(this.identifierRepository)
    this.addUserIdentifierEmailUseCase = new AddUserIdentifierEmailUseCase(this.identifierRepository)
    this.addUserIdentifierPhoneUseCase = new AddUserIdentifierPhoneUseCase(this.identifierRepository)
    this.addUserIdentifierGoogleUseCase = new AddUserIdentifierGoogleUseCase(
      this.authServices.googleAuth ?? new DisabledGoogleAuthService(),
      this.identifierRepository
    )
    this.sendAddEmailIdentifierConfirmationUseCase = new SendAddEmailIdentifierConfirmationUseCase(this.identifierRepository)
    this.sendAddPhoneIdentifierConfirmationUseCase = new SendAddPhoneIdentifierConfirmationUseCase(this.identifierRepository)
    this.emailChangePasswordUseCase = new EmailChangePasswordUseCase(this.identifierRepository)

    this.getFilesUseCase = new GetFilesUseCase(this.openStorageRepository)
    this.getFileDetailUseCase = new GetFileDetailUseCase(this.openStorageRepository)
    this.uploadFileUseCase = new UploadFileUseCase(this.openStorageRepository)
    this.deleteFileUseCase = new DeleteFileUseCase(this.openStorageRepository)
    this.deleteFilesBatchUseCase = new DeleteFilesBatchUseCase(this.openStorageRepository)

    this.userWebSocketMessageHandler = new UserWebSocketMessageHandler(
      this.userStorage,
      this.userRepository,
      this.authStorage,
      this.refreshTokenUseCase
    )
  }
}
