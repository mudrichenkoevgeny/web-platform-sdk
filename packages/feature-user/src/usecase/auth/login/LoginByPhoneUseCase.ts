import { AppError, AppResult, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginRepository } from '@/repository/auth/login/LoginRepository'
import { AuthStorage } from '@/storage/auth/AuthStorage'
import { UserStorage } from '@/storage/user/UserStorage'
import { AuthData } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Completes phone-based login and, on success, persists session tokens and current user snapshot.
 */
export class LoginByPhoneUseCase {
  /**
   * Constructs a new {@link LoginByPhoneUseCase}.
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
   * Executes phone login.
   *
   * @param phoneNumber - Phone number
   * @param confirmationCode - One-time verification code
   * @returns AuthData on success or AppError
   */
  public async execute(phoneNumber: string, confirmationCode: string): Promise<AppResult<AuthData, AppError>> {
    const result = await this.loginRepository.loginByPhone(phoneNumber, confirmationCode)
    if (isSuccess(result)) {
      await this.authStorage.updateTokens(result.data.sessionToken)
      await this.userStorage.updateCurrentUser(result.data.user)
    }
    return result
  }
}
