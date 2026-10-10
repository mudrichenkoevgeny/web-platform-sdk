import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { LoginRepository } from '@/repository/auth/login/login-repository'
import type { AuthStorage } from '@/storage/auth/auth-storage'
import type { UserStorage } from '@/storage/user/user-storage'
import type { AuthData } from '@mudrichenkoevgeny/shared-foundation'
/**
 * Signs in with email credentials and, on success, persists session tokens and current user snapshot.
 */
export class LoginByEmailUseCase {
  /**
   * Constructs a new {@link LoginByEmailUseCase}.
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
   * Executes email login and updates storage on success.
   *
   * @param email - Account email
   * @param password - Account password
   * @returns AuthData on success or AppError
   */
  public async execute(email: string, password: string): Promise<AppResult<AuthData, AppError>> {
    const result = await this.loginRepository.loginByEmail(email, password)
    if (isSuccess(result)) {
      await this.authStorage.updateTokens(result.data.sessionToken)
      await this.userStorage.updateCurrentUser(result.data.userPrivate)
    }
    return result
  }
}
