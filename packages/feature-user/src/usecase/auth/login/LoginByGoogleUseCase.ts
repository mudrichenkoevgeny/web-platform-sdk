import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import type { GoogleAuthService } from '@/auth/google/GoogleAuthService'
import type { LoginRepository } from '@/repository/auth/login/LoginRepository'
import type { AuthStorage } from '@/storage/auth/AuthStorage'
import type { UserStorage } from '@/storage/user/UserStorage'
import type { AuthData } from '@mudrichenkoevgeny/shared-foundation'
/**
 * Google Sign-In flow: obtains provider token, exchanges it for session material via LoginRepository,
 * then persists tokens and user snapshot on success.
 */
export class LoginByGoogleUseCase {
  /**
   * Constructs a new {@link LoginByGoogleUseCase}.
   *
   * @param authService - Platform Google auth helper
   * @param loginRepository - Remote login API for external providers
   * @param authStorage - Encrypted token storage
   * @param userStorage - User snapshot storage
   */
  public constructor(
    private readonly authService: GoogleAuthService,
    private readonly loginRepository: LoginRepository,
    private readonly authStorage: AuthStorage,
    private readonly userStorage: UserStorage
  ) {}

  /**
   * Executes Google sign-in flow.
   *
   * @returns AuthData on success or AppError
   */
  public async execute(): Promise<AppResult<AuthData, AppError>> {
    const signInResult = await this.authService.signIn()
    if (!isSuccess(signInResult)) {
      return signInResult
    }

    const loginResult = await this.loginRepository.loginByExternalAuthProvider(
      UserAuthProvider.GOOGLE,
      signInResult.data
    )

    if (isSuccess(loginResult)) {
      await this.authStorage.updateTokens(loginResult.data.sessionToken)
      await this.userStorage.updateCurrentUser(loginResult.data.user)
    }

    return loginResult
  }
}
