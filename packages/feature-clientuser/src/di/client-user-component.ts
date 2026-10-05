import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import type { CommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { SecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { SettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type {
  AuthStorage,
  ConfirmationRepository,
  IdentifierRepository,
  LoginRepository,
  OpenAuthSettingsRepository,
  OpenAuthSettingsStorage,
  RefreshTokenRepository,
  RegistrationRepository,
  ResetPasswordRepository,
  SessionRepository,
  UnlockRepository,
  UserAuthServices,
  UserRepository,
  UserSecurityRepository,
  UserStorage
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import {
  AddUserIdentifierEmailUseCase,
  AddUserIdentifierGoogleUseCase,
  AddUserIdentifierPhoneUseCase,
  ConfirmationRepositoryImpl,
  DeleteAllOtherSessionsUseCase,
  DeleteSessionUseCase,
  DeleteUserIdentifierUseCase,
  DisabledGoogleAuthService,
  DisableTotpUseCase,
  EmailChangePasswordUseCase,
  EnableTotpUseCase,
  EncryptedOpenAuthSettingsStorage,
  EncryptedUserStorage,
  FetchOpenUserConfigurationApi,
  GetAuthSettingsUseCase,
  GetAvailableUserAuthProvidersUseCase,
  GetRecoveryCodesUseCase,
  GetSessionUseCase,
  GetSessionsUseCase,
  GetUserIdentifierUseCase,
  GetUserIdentifiersUseCase,
  LoginByEmailUseCase,
  LoginByGoogleUseCase,
  LoginByPhoneUseCase,
  LoginByTotpRecoveryCodeUseCase,
  LoginByTotpUseCase,
  LogoutUseCase,
  ObserveAuthSettingsUseCase,
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
  UserWebSocketMessageHandler
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenUserConfigurationApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenLoginApi } from '@/network/api/auth/login/open-login-api'
import { FetchOpenLoginApi } from '@/network/api/auth/login/fetch-open-login-api'
import { FetchOpenRefreshTokenApi } from '@/network/api/auth/refresh-token/fetch-open-refresh-token-api'
import type { RegistrationApi } from '@/network/api/auth/registration/registration-api'
import { FetchRegistrationApi } from '@/network/api/auth/registration/fetch-registration-api'
import { FetchResetPasswordApi } from '@/network/api/auth/reset-password/fetch-reset-password-api'
import type { OpenAuthSettingsApi } from '@/network/api/auth/settings/open-auth-settings-api'
import { FetchOpenAuthSettingsApi } from '@/network/api/auth/settings/fetch-open-auth-settings-api'
import type { OpenUnlockApi } from '@/network/api/auth/unlock/open-unlock-api'
import { FetchOpenUnlockApi } from '@/network/api/auth/unlock/fetch-open-unlock-api'
import type { OpenIdentifiersApi } from '@/network/api/identifier/open-identifiers-api'
import { FetchOpenIdentifiersApi } from '@/network/api/identifier/fetch-open-identifiers-api'
import { FetchOpenSessionApi } from '@/network/api/session/fetch-open-session-api'
import { FetchOpenUserSecurityApi } from '@/network/api/user/security/fetch-open-user-security-api'
import type { OpenUserApi } from '@/network/api/user/open-user-api'
import { FetchOpenUserApi } from '@/network/api/user/fetch-open-user-api'
import { OpenLoginRepositoryImpl } from '@/repository/auth/login/open-login-repository-impl'
import { OpenRefreshTokenRepositoryImpl } from '@/repository/auth/refresh-token/open-refresh-token-repository-impl'
import { OpenRegistrationRepositoryImpl } from '@/repository/auth/registration/open-registration-repository-impl'
import { OpenResetPasswordRepositoryImpl } from '@/repository/auth/reset-password/open-reset-password-repository-impl'
import { OpenAuthSettingsRepositoryImpl } from '@/repository/auth/settings/open-auth-settings-repository-impl'
import { OpenUnlockRepositoryImpl } from '@/repository/auth/unlock/open-unlock-repository-impl'
import { OpenIdentifierRepositoryImpl } from '@/repository/identifier/open-identifier-repository-impl'
import { OpenSessionRepositoryImpl } from '@/repository/session/open-session-repository-impl'
import { OpenUserRepositoryImpl } from '@/repository/user/open-user-repository-impl'
import { OpenUserSecurityRepositoryImpl } from '@/repository/user/security/open-user-security-repository-impl'
import { RefreshOpenAuthSettingsUseCase } from '@/usecase/auth/settings/refresh-open-auth-settings-use-case'
import { RefreshClientUserConfigurationUseCase } from '@/usecase/configuration/refresh-client-user-configuration-use-case'

/**
 * Configuration parameters for instantiating {@link ClientUserComponent}.
 */
export interface ClientUserComponentConfig {
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
  /** Optional mock override for login API. */
  openLoginApi?: OpenLoginApi
  /** Optional mock override for registration API. */
  registrationApi?: RegistrationApi
  /** Optional mock override for unlock API. */
  openUnlockApi?: OpenUnlockApi
  /** Optional mock override for auth settings API. */
  openAuthSettingsApi?: OpenAuthSettingsApi
  /** Optional mock override for identifiers API. */
  openIdentifiersApi?: OpenIdentifiersApi
  /** Optional mock override for user profile API. */
  openUserApi?: OpenUserApi
  /** Optional mock override for user configuration API. */
  openUserConfigurationApi?: OpenUserConfigurationApi
}

/**
 * Root dependency injection container for the `feature-clientuser` module.
 */
export class ClientUserComponent {
  public readonly commonComponent: CommonComponent
  public readonly settingsComponent: SettingsComponent
  public readonly securityComponent: SecurityComponent
  public readonly authStorage: AuthStorage
  public readonly authServices: UserAuthServices

  public readonly userStorage: UserStorage
  public readonly openAuthSettingsStorage: OpenAuthSettingsStorage

  public readonly openLoginApi: OpenLoginApi
  public readonly registrationApi: RegistrationApi
  public readonly openRefreshTokenApi: FetchOpenRefreshTokenApi
  public readonly openResetPasswordApi: FetchResetPasswordApi
  public readonly openUnlockApi: OpenUnlockApi
  public readonly openAuthSettingsApi: OpenAuthSettingsApi
  public readonly openIdentifiersApi: OpenIdentifiersApi
  public readonly openSessionApi: FetchOpenSessionApi
  public readonly openUserApi: OpenUserApi
  public readonly openUserSecurityApi: FetchOpenUserSecurityApi
  public readonly openUserConfigurationApi: OpenUserConfigurationApi

  public readonly confirmationRepository: ConfirmationRepository
  public readonly loginRepository: LoginRepository
  public readonly registrationRepository: RegistrationRepository
  public readonly refreshTokenRepository: RefreshTokenRepository
  public readonly resetPasswordRepository: ResetPasswordRepository
  public readonly unlockRepository: UnlockRepository
  public readonly openAuthSettingsRepository: OpenAuthSettingsRepository
  public readonly identifierRepository: IdentifierRepository
  public readonly sessionRepository: SessionRepository
  public readonly userRepository: UserRepository
  public readonly userSecurityRepository: UserSecurityRepository

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
  public readonly observeAuthSettingsUseCase: ObserveAuthSettingsUseCase
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
  public readonly getUserIdentifierUseCase: GetUserIdentifierUseCase
  public readonly getUserIdentifiersUseCase: GetUserIdentifiersUseCase
  public readonly deleteUserIdentifierUseCase: DeleteUserIdentifierUseCase
  public readonly addUserIdentifierEmailUseCase: AddUserIdentifierEmailUseCase
  public readonly addUserIdentifierPhoneUseCase: AddUserIdentifierPhoneUseCase
  public readonly addUserIdentifierGoogleUseCase: AddUserIdentifierGoogleUseCase
  public readonly sendAddEmailIdentifierConfirmationUseCase: SendAddEmailIdentifierConfirmationUseCase
  public readonly sendAddPhoneIdentifierConfirmationUseCase: SendAddPhoneIdentifierConfirmationUseCase
  public readonly emailChangePasswordUseCase: EmailChangePasswordUseCase

  public readonly userWebSocketMessageHandler: UserWebSocketMessageHandler

  public constructor(config: ClientUserComponentConfig) {
    this.commonComponent = config.commonComponent
    this.settingsComponent = config.settingsComponent
    this.securityComponent = config.securityComponent
    this.authStorage = config.authStorage
    this.authServices = config.authServices

    this.userStorage =
      config.userStorage ?? new EncryptedUserStorage(this.commonComponent.encryptedSettings)
    this.openAuthSettingsStorage = new EncryptedOpenAuthSettingsStorage(this.commonComponent.encryptedSettings)

    this.openLoginApi =
      config.openLoginApi ?? new FetchOpenLoginApi(this.commonComponent.httpClient)
    this.registrationApi =
      config.registrationApi ?? new FetchRegistrationApi(this.commonComponent.httpClient)
    this.openRefreshTokenApi = new FetchOpenRefreshTokenApi(this.commonComponent.httpClient)
    this.openResetPasswordApi = new FetchResetPasswordApi(this.commonComponent.httpClient)
    this.openUnlockApi =
      config.openUnlockApi ?? new FetchOpenUnlockApi(this.commonComponent.httpClient)
    this.openAuthSettingsApi =
      config.openAuthSettingsApi ?? new FetchOpenAuthSettingsApi(this.commonComponent.httpClient)
    this.openIdentifiersApi =
      config.openIdentifiersApi ?? new FetchOpenIdentifiersApi(this.commonComponent.httpClient)
    this.openSessionApi = new FetchOpenSessionApi(this.commonComponent.httpClient)
    this.openUserApi =
      config.openUserApi ?? new FetchOpenUserApi(this.commonComponent.httpClient)
    this.openUserSecurityApi = new FetchOpenUserSecurityApi(this.commonComponent.httpClient)
    this.openUserConfigurationApi =
      config.openUserConfigurationApi ?? new FetchOpenUserConfigurationApi(this.commonComponent.httpClient)

    this.confirmationRepository = new ConfirmationRepositoryImpl()
    this.loginRepository = new OpenLoginRepositoryImpl(this.openLoginApi, this.confirmationRepository)
    this.registrationRepository = new OpenRegistrationRepositoryImpl(this.registrationApi, this.confirmationRepository)
    this.refreshTokenRepository = new OpenRefreshTokenRepositoryImpl(this.openRefreshTokenApi)
    this.resetPasswordRepository = new OpenResetPasswordRepositoryImpl(this.openResetPasswordApi, this.confirmationRepository)
    this.unlockRepository = new OpenUnlockRepositoryImpl(this.openUnlockApi, this.confirmationRepository)
    this.openAuthSettingsRepository = new OpenAuthSettingsRepositoryImpl(
      this.openAuthSettingsApi,
      this.openAuthSettingsStorage,
      this.commonComponent.webSocketService
    )
    this.identifierRepository = new OpenIdentifierRepositoryImpl(
      this.openIdentifiersApi,
      this.confirmationRepository,
      this.userStorage
    )
    this.sessionRepository = new OpenSessionRepositoryImpl(
      this.openSessionApi,
      this.userStorage,
      this.authStorage
    )
    this.userRepository = new OpenUserRepositoryImpl(
      this.userStorage,
      this.authStorage,
      this.openUserApi,
      this.commonComponent.webSocketService
    )
    this.userSecurityRepository = new OpenUserSecurityRepositoryImpl(
      this.openUserSecurityApi,
      this.userStorage
    )

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
    this.observeAuthSettingsUseCase = new ObserveAuthSettingsUseCase(this.openAuthSettingsRepository)
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
      this.settingsComponent.globalSettingsRepository,
      this.securityComponent.securitySettingsRepository,
      this.openAuthSettingsRepository
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
    this.logoutUseCase = new LogoutUseCase(this.sessionRepository, this.userRepository)
    this.deleteSessionUseCase = new DeleteSessionUseCase(this.sessionRepository)
    this.deleteAllOtherSessionsUseCase = new DeleteAllOtherSessionsUseCase(this.sessionRepository)
    this.reauthenticateSessionUseCase = new ReauthenticateSessionUseCase(this.sessionRepository)
    this.getUserIdentifierUseCase = new GetUserIdentifierUseCase(this.identifierRepository)
    this.getUserIdentifiersUseCase = new GetUserIdentifiersUseCase(this.identifierRepository)
    this.deleteUserIdentifierUseCase = new DeleteUserIdentifierUseCase(this.identifierRepository)
    this.addUserIdentifierEmailUseCase = new AddUserIdentifierEmailUseCase(this.identifierRepository)
    this.addUserIdentifierPhoneUseCase = new AddUserIdentifierPhoneUseCase(this.identifierRepository)
    this.addUserIdentifierGoogleUseCase = new AddUserIdentifierGoogleUseCase(
      this.authServices.googleAuth ?? new DisabledGoogleAuthService(),
      this.identifierRepository
    )
    this.sendAddEmailIdentifierConfirmationUseCase = new SendAddEmailIdentifierConfirmationUseCase(this.identifierRepository)
    this.sendAddPhoneIdentifierConfirmationUseCase = new SendAddPhoneIdentifierConfirmationUseCase(this.identifierRepository)
    this.emailChangePasswordUseCase = new EmailChangePasswordUseCase(this.identifierRepository)

    this.userWebSocketMessageHandler = new UserWebSocketMessageHandler(
      this.userStorage,
      this.userRepository,
      this.authStorage,
      this.refreshTokenUseCase
    )
  }
}
