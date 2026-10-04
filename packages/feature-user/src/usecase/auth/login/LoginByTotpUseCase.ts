import { AppError, AppResult, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginRepository } from '@/repository/auth/login/LoginRepository'
import { AuthStorage } from '@/storage/auth/AuthStorage'
import { UserStorage } from '@/storage/user/UserStorage'
import { AuthData } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Completes MFA flow using a time-based one-time password (TOTP) and, on success, persists session tokens and user snapshot.
 */
export class LoginByTotpUseCase {
  /**
   * Constructs a new {@link LoginByTotpUseCase}.
   *
   * @param loginRepository - Remote login API
   * @param authStorage - Encrypted token storage
   * @param userStorage - User snapshot storage
   */
  public constructor(
    private readonly loginRepository: LoginRepository,
    private readonly authStorage: AuthStorage,
    private readonly userStorage: UserStorage
  ) {}

  /**
   * Executes TOTP login.
   *
   * @param mfaToken - MFA token
   * @param code - TOTP code
   * @returns AuthData on success or AppError
   */
  public async execute(mfaToken: string, code: string): Promise<AppResult<AuthData, AppError>> {
    const result = await this.loginRepository.loginByTotp(mfaToken, code)
    if (isSuccess(result)) {
      await this.authStorage.updateTokens(result.data.sessionToken)
      await this.userStorage.updateCurrentUser(result.data.user)
    }
    return result
  }
}
