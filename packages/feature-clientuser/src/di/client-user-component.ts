import type {
  CommonComponent,
  EncryptedSettings
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenSecuritySettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { OpenGlobalSettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type { OpenStorageSettingsRepository, StorageApi, StorageRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import {
  FetchOpenStorageApi,
  OpenStorageRepositoryImpl,
  GetFilesUseCase,
  GetFileDetailUseCase,
  UploadFileUseCase,
  DeleteFileUseCase,
  DeleteFilesBatchUseCase
} from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import type { UserAuthServices, AuthStorage, ConfirmationRepository, IdentifierRepository, LoginRepository, OpenAuthSettingsRepository, OpenUserConfigurationApi, RefreshTokenRepository, RegistrationRepository, ResetPasswordRepository, SessionRepository, UnlockRepository, UserRepository, UserSecurityRepository, UserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import {
  AddUserIdentifierEmailUseCase,
  AddUserIdentifierGoogleUseCase,
  AddUserIdentifierPhoneUseCase,
  ConfirmationRepositoryImpl,
  DeleteAllOtherSessionsUseCase,
  DeletePasswordUseCase,
  DeleteSessionUseCase,
  DeleteUserIdentifierUseCase,
  DisabledGoogleAuthService,
  DisableTotpUseCase,
  EmailChangePasswordUseCase,
  EnableTotpUseCase,
  EncryptedAuthStorage,
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
  GetUserUseCase,
  LoginByEmailUseCase,
  LoginByGoogleUseCase,
  LoginByPhoneUseCase,
  LoginByTotpRecoveryCodeUseCase,
  LoginByTotpUseCase,
  LogoutUseCase,
  ObserveOpenAuthSettingsUseCase,
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

import type { OpenAuthSettingsApi } from '@/network/api/auth/settings/open-auth-settings-api'
import { FetchOpenAuthSettingsApi } from '@/network/api/auth/settings/fetch-open-auth-settings-api'
import type { OpenIdentifiersApi } from '@/network/api/identifier/open-identifiers-api'
import { FetchOpenIdentifiersApi } from '@/network/api/identifier/fetch-open-identifiers-api'
import type { OpenLoginApi } from '@/network/api/auth/login/open-login-api'
import { FetchOpenLoginApi } from '@/network/api/auth/login/fetch-open-login-api'
import type { OpenRefreshTokenApi } from '@/network/api/auth/refresh-token/open-refresh-token-api'
import { FetchOpenRefreshTokenApi } from '@/network/api/auth/refresh-token/fetch-open-refresh-token-api'
import type { OpenRegistrationApi } from '@/network/api/auth/registration/open-registration-api'
import { FetchRegistrationApi } from '@/network/api/auth/registration/fetch-registration-api'
import type { OpenResetPasswordApi } from '@/network/api/auth/reset-password/open-reset-password-api'
import { FetchResetPasswordApi } from '@/network/api/auth/reset-password/fetch-reset-password-api'
import type { OpenUnlockApi } from '@/network/api/auth/unlock/open-unlock-api'
import { FetchOpenUnlockApi } from '@/network/api/auth/unlock/fetch-open-unlock-api'
import type { OpenUserApi } from '@/network/api/user/open-user-api'
import { FetchOpenUserApi } from '@/network/api/user/fetch-open-user-api'
import type { OpenUserSecurityApi } from '@/network/api/user/security/open-user-security-api'
import { FetchOpenUserSecurityApi } from '@/network/api/user/security/fetch-open-user-security-api'
import type { SessionApi } from '@/network/api/session/open-session-api'
import { FetchOpenSessionApi } from '@/network/api/session/fetch-open-session-api'

import { OpenAuthSettingsRepositoryImpl } from '@/repository/auth/settings/open-auth-settings-repository-impl'
import { OpenIdentifierRepositoryImpl } from '@/repository/identifier/open-identifier-repository-impl'
import { OpenLoginRepositoryImpl } from '@/repository/auth/login/open-login-repository-impl'
import { OpenRefreshTokenRepositoryImpl } from '@/repository/auth/refresh-token/open-refresh-token-repository-impl'

import { OpenRegistrationRepositoryImpl } from '@/repository/auth/registration/open-registration-repository-impl'
import { OpenResetPasswordRepositoryImpl } from '@/repository/auth/reset-password/open-reset-password-repository-impl'
import { OpenSessionRepositoryImpl } from '@/repository/session/open-session-repository-impl'
import { OpenUnlockRepositoryImpl } from '@/repository/auth/unlock/open-unlock-repository-impl'
import { OpenUserRepositoryImpl } from '@/repository/user/open-user-repository-impl'
import { OpenUserSecurityRepositoryImpl } from '@/repository/user/security/open-user-security-repository-impl'
import { RefreshOpenAuthSettingsUseCase } from '@/usecase/auth/settings/refresh-open-auth-settings-use-case'
import { RefreshClientUserConfigurationUseCase } from '@/usecase/configuration/refresh-client-user-configuration-use-case'

/**
 * Configuration options required to instantiate {@link ClientUserComponent}.
 */
export interface ClientUserComponentConfig {
  /** Injected common component container. */
  commonComponent: CommonComponent
  /** Injected global settings repository container. */
  openGlobalSettingsRepository: OpenGlobalSettingsRepository
  /** Injected security settings repository container. */
  openSecuritySettingsRepository: OpenSecuritySettingsRepository
  /** Injected storage settings repository container. */
  openStorageSettingsRepository: OpenStorageSettingsRepository
  /** Pluggable external authentication providers (e.g. Google Auth SDK). */
  authServices: UserAuthServices
  /** Optional custom encrypted settings store override. */
  encryptedSettings?: EncryptedSettings
  /** Optional custom auth storage override. */
  authStorage?: AuthStorage
  /** Optional custom user storage override. */
  userStorage?: UserStorage
  /** Optional custom open storage API override. */
  openStorageApi?: StorageApi
}

/**
 * Root dependency injection container for client user feature.
 */
export class ClientUserComponent {
  /** Core common infrastructure dependencies. */
  public readonly commonComponent: CommonComponent
  /** Open global settings repository. */
  public readonly openGlobalSettingsRepository: OpenGlobalSettingsRepository
  /** Open security settings repository. */
  public readonly openSecuritySettingsRepository: OpenSecuritySettingsRepository
  /** Open storage settings repository. */
  public readonly openStorageSettingsRepository: OpenStorageSettingsRepository
  /** External authentication provider services. */
  public readonly authServices: UserAuthServices

  /** Auth tokens and session storage. */
  public readonly authStorage: AuthStorage
  /** Signed-in user profile storage. */
  public readonly userStorage: UserStorage
  /** Encrypted open auth settings storage. */
  public readonly openAuthSettingsStorage: EncryptedOpenAuthSettingsStorage

  /** HTTP API client for open auth settings. */
  public readonly openAuthSettingsApi: OpenAuthSettingsApi
  /** Open auth settings repository. */
  public readonly openAuthSettingsRepository: OpenAuthSettingsRepository

  /** HTTP API client for open login endpoints. */
  public readonly openLoginApi: OpenLoginApi
  /** Open login repository. */
  public readonly loginRepository: LoginRepository

  /** HTTP API client for open token refresh endpoints. */
  public readonly openRefreshTokenApi: OpenRefreshTokenApi
  /** Open refresh token repository. */
  public readonly refreshTokenRepository: RefreshTokenRepository

  /** HTTP API client for registration endpoints. */
  public readonly openRegistrationApi: OpenRegistrationApi
  /** Registration repository. */
  public readonly registrationRepository: RegistrationRepository

  /** HTTP API client for password reset endpoints. */
  public readonly openResetPasswordApi: OpenResetPasswordApi
  /** Password reset repository. */
  public readonly resetPasswordRepository: ResetPasswordRepository

  /** HTTP API client for account unlock endpoints. */
  public readonly openUnlockApi: OpenUnlockApi
  /** Account unlock repository. */
  public readonly unlockRepository: UnlockRepository

  /** HTTP API client for client user configuration endpoint. */
  public readonly openUserConfigurationApi: OpenUserConfigurationApi

  /** HTTP API client for user identifier endpoints. */
  public readonly openIdentifiersApi: OpenIdentifiersApi
  /** User identifiers repository. */
  public readonly identifierRepository: IdentifierRepository

  /** HTTP API client for session management endpoints. */
  public readonly sessionApi: SessionApi
  /** User session repository. */
  public readonly sessionRepository: SessionRepository

  /** HTTP API client for user security settings. */
  public readonly openUserSecurityApi: OpenUserSecurityApi
  /** User security repository. */
  public readonly userSecurityRepository: UserSecurityRepository

  /** HTTP API client for user profile management. */
  public readonly openUserApi: OpenUserApi
  /** User profile repository. */
  public readonly userRepository: UserRepository

  /** HTTP API client for public file storage endpoints. */
  public readonly openStorageApi: StorageApi
  /** Public file storage repository. */
  public readonly openStorageRepository: StorageRepository

  /** Confirmation code repository. */
  public readonly confirmationRepository: ConfirmationRepository

  /** Refresh session token use case. */
  public readonly refreshTokenUseCase: RefreshTokenUseCase
  /** Login by email use case. */
  public readonly loginByEmailUseCase: LoginByEmailUseCase
  /** Login by phone number use case. */
  public readonly loginByPhoneUseCase: LoginByPhoneUseCase
  /** Send login SMS confirmation use case. */
  public readonly sendLoginConfirmationToPhoneUseCase: SendLoginConfirmationToPhoneUseCase
  /** Login by Google OAuth use case. */
  public readonly loginByGoogleUseCase: LoginByGoogleUseCase
  /** Login by TOTP code use case. */
  public readonly loginByTotpUseCase: LoginByTotpUseCase
  /** Login by TOTP recovery code use case. */
  public readonly loginByTotpRecoveryCodeUseCase: LoginByTotpRecoveryCodeUseCase
  /** Account registration by email use case. */
  public readonly registrationByEmailUseCase: RegistrationByEmailUseCase
  /** Send registration email confirmation use case. */
  public readonly sendRegistrationConfirmationToEmailUseCase: SendRegistrationConfirmationToEmailUseCase
  /** Force refresh open auth settings use case. */
  public readonly refreshOpenAuthSettingsUseCase: RefreshOpenAuthSettingsUseCase
  /** Observe open auth settings changes use case. */
  public readonly observeOpenAuthSettingsUseCase: ObserveOpenAuthSettingsUseCase
  /** Retrieve available login auth providers use case. */
  public readonly getAvailableUserAuthProvidersUseCase: GetAvailableUserAuthProvidersUseCase
  /** Get open auth settings use case. */
  public readonly getAuthSettingsUseCase: GetAuthSettingsUseCase
  /** Reset account password by email use case. */
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
  /** Unlock account by external auth provider token use case. */
  public readonly unlockByExternalAuthProviderUseCase: UnlockByExternalAuthProviderUseCase
  /** Unlock account by Google OAuth use case. */
  public readonly unlockByGoogleUseCase: UnlockByGoogleUseCase
  /** Refresh client user configuration use case. */
  public readonly refreshUserConfigurationUseCase: RefreshClientUserConfigurationUseCase
  /** Schedule user account deletion use case. */
  public readonly scheduleUserDeletionUseCase: ScheduleUserDeletionUseCase
  /** Cancel scheduled user account deletion use case. */
  public readonly restoreUserUseCase: RestoreUserUseCase
  /** Generate TOTP setup secret use case. */
  public readonly setupTotpUseCase: SetupTotpUseCase
  /** Enable TOTP two-factor authentication use case. */
  public readonly enableTotpUseCase: EnableTotpUseCase
  /** Disable TOTP two-factor authentication use case. */
  public readonly disableTotpUseCase: DisableTotpUseCase
  /** Retrieve TOTP recovery codes use case. */
  public readonly getRecoveryCodesUseCase: GetRecoveryCodesUseCase
  /** Regenerate TOTP recovery codes use case. */
  public readonly regenerateRecoveryCodesUseCase: RegenerateRecoveryCodesUseCase
  /** Get paginated user sessions use case. */
  public readonly getSessionsUseCase: GetSessionsUseCase
  /** Get user session detail use case. */
  public readonly getSessionUseCase: GetSessionUseCase
  /** Terminate current user session use case. */
  public readonly logoutUseCase: LogoutUseCase
  /** Terminate specific user session use case. */
  public readonly deleteSessionUseCase: DeleteSessionUseCase
  /** Terminate all other user sessions use case. */
  public readonly deleteAllOtherSessionsUseCase: DeleteAllOtherSessionsUseCase
  /** Re-authenticate current session use case. */
  public readonly reauthenticateSessionUseCase: ReauthenticateSessionUseCase
  /** Get current user profile details use case. */
  public readonly getUserUseCase: GetUserUseCase
  /** Get specific user identifier detail use case. */
  public readonly getUserIdentifierUseCase: GetUserIdentifierUseCase
  /** Get paginated list of user identifiers use case. */
  public readonly getUserIdentifiersUseCase: GetUserIdentifiersUseCase
  /** Delete user identifier use case. */
  public readonly deleteUserIdentifierUseCase: DeleteUserIdentifierUseCase
  /** Delete password from email identifier use case. */
  public readonly deletePasswordUseCase: DeletePasswordUseCase
  /** Add email identifier to account use case. */
  public readonly addUserIdentifierEmailUseCase: AddUserIdentifierEmailUseCase
  /** Add phone number identifier to account use case. */
  public readonly addUserIdentifierPhoneUseCase: AddUserIdentifierPhoneUseCase
  /** Add Google OAuth identifier to account use case. */
  public readonly addUserIdentifierGoogleUseCase: AddUserIdentifierGoogleUseCase
  /** Send email confirmation to add identifier use case. */
  public readonly sendAddEmailIdentifierConfirmationUseCase: SendAddEmailIdentifierConfirmationUseCase
  /** Send phone confirmation to add identifier use case. */
  public readonly sendAddPhoneIdentifierConfirmationUseCase: SendAddPhoneIdentifierConfirmationUseCase
  /** Change email password use case. */
  public readonly emailChangePasswordUseCase: EmailChangePasswordUseCase

  /** Get paginated storage files use case. */
  public readonly getFilesUseCase: GetFilesUseCase
  /** Get storage file detail use case. */
  public readonly getFileDetailUseCase: GetFileDetailUseCase
  /** Upload binary file to S3 storage use case. */
  public readonly uploadFileUseCase: UploadFileUseCase
  /** Delete single storage file use case. */
  public readonly deleteFileUseCase: DeleteFileUseCase
  /** Delete multiple storage files batch use case. */
  public readonly deleteFilesBatchUseCase: DeleteFilesBatchUseCase

  /** User real-time WebSocket event message handler. */
  public readonly userWebSocketMessageHandler: UserWebSocketMessageHandler

  public constructor(config: ClientUserComponentConfig) {
    this.commonComponent = config.commonComponent
    this.openGlobalSettingsRepository = config.openGlobalSettingsRepository
    this.openSecuritySettingsRepository = config.openSecuritySettingsRepository
    this.openStorageSettingsRepository = config.openStorageSettingsRepository
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

    this.confirmationRepository = new ConfirmationRepositoryImpl()

    this.openLoginApi = new FetchOpenLoginApi(this.commonComponent.httpClient)
    this.loginRepository = new OpenLoginRepositoryImpl(
      this.openLoginApi,
      this.confirmationRepository
    )

    this.openRefreshTokenApi = new FetchOpenRefreshTokenApi(this.commonComponent.httpClient)
    this.refreshTokenRepository = new OpenRefreshTokenRepositoryImpl(
      this.openRefreshTokenApi
    )

    this.openRegistrationApi = new FetchRegistrationApi(this.commonComponent.httpClient)
    this.registrationRepository = new OpenRegistrationRepositoryImpl(
      this.openRegistrationApi,
      this.confirmationRepository
    )

    this.openIdentifiersApi = new FetchOpenIdentifiersApi(this.commonComponent.httpClient)
    this.identifierRepository = new OpenIdentifierRepositoryImpl(
      this.openIdentifiersApi,
      this.confirmationRepository,
      this.userStorage
    )

    this.openResetPasswordApi = new FetchResetPasswordApi(this.commonComponent.httpClient)
    this.resetPasswordRepository = new OpenResetPasswordRepositoryImpl(
      this.openResetPasswordApi,
      this.confirmationRepository
    )

    this.openUnlockApi = new FetchOpenUnlockApi(this.commonComponent.httpClient)
    this.unlockRepository = new OpenUnlockRepositoryImpl(
      this.openUnlockApi,
      this.confirmationRepository
    )

    this.openUserConfigurationApi = new FetchOpenUserConfigurationApi(this.commonComponent.httpClient)

    this.sessionApi = new FetchOpenSessionApi(this.commonComponent.httpClient)
    this.sessionRepository = new OpenSessionRepositoryImpl(
      this.sessionApi,
      this.userStorage,
      this.authStorage
    )

    this.openUserSecurityApi = new FetchOpenUserSecurityApi(this.commonComponent.httpClient)
    this.userSecurityRepository = new OpenUserSecurityRepositoryImpl(
      this.openUserSecurityApi,
      this.userStorage
    )

    this.openUserApi = new FetchOpenUserApi(this.commonComponent.httpClient)
    this.userRepository = new OpenUserRepositoryImpl(
      this.userStorage,
      this.authStorage,
      this.openUserApi,
      this.commonComponent.webSocketService
    )

    this.openStorageApi = config.openStorageApi ?? new FetchOpenStorageApi(this.commonComponent.httpClient)
    this.openStorageRepository = new OpenStorageRepositoryImpl(
      this.openStorageApi,
      this.commonComponent.webSocketService
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
    this.observeOpenAuthSettingsUseCase = new ObserveOpenAuthSettingsUseCase(this.openAuthSettingsRepository)
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
      this.openGlobalSettingsRepository,
      this.openSecuritySettingsRepository,
      this.openStorageSettingsRepository,
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
