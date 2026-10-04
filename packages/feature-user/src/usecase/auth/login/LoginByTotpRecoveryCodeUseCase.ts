import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { LoginRepository } from '@/repository/auth/login/LoginRepository'
import type { AuthStorage } from '@/storage/auth/AuthStorage'
import type { UserStorage } from '@/storage/user/UserStorage'
import type { AuthData } from '@mudrichenkoevgeny/shared-foundation'
/**
 * Completes MFA flow using a static backup recovery code and, on success, persists session tokens and user snapshot.
 */
export class LoginByTotpRecoveryCodeUseCase {
  /**
   * Constructs a new {@link LoginByTotpRecoveryCodeUseCase}.
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
   * Executes recovery code login.
   *
   * @param mfaToken - MFA token
   * @param code - Recovery code
   * @returns AuthData on success or AppError
   */
  public async execute(mfaToken: string, code: string): Promise<AppResult<AuthData, AppError>> {
    const result = await this.loginRepository.loginByTotpRecoveryCode(mfaToken, code)
    if (isSuccess(result)) {
      await this.authStorage.updateTokens(result.data.sessionToken)
      await this.userStorage.updateCurrentUser(result.data.user)
    }
    return result
  }
}
