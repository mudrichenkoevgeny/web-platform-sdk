import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { RegistrationRepository } from '@/repository/auth/registration/registration-repository'
import type { AuthStorage } from '@/storage/auth/auth-storage'
import type { UserStorage } from '@/storage/user/user-storage'
import type { AuthData } from '@mudrichenkoevgeny/shared-foundation'
/**
 * Registers a new account by email and, on success, stores session tokens and new user snapshot.
 */
export class RegistrationByEmailUseCase {
  /**
   * Constructs a new {@link RegistrationByEmailUseCase}.
   *
   * @param registrationRepository - Remote registration API
   * @param authStorage - Encrypted token storage
   * @param userStorage - User snapshot storage
   */
  public constructor(
    private readonly registrationRepository: RegistrationRepository,
    private readonly authStorage: AuthStorage,
    private readonly userStorage: UserStorage
  ) {}

  /**
   * Registers account by email.
   *
   * @param email - Account email
   * @param password - Account password
   * @param confirmationCode - Code from confirmation email
   * @returns AuthData on success or AppError
   */
  public async execute(email: string, password: string, confirmationCode: string): Promise<AppResult<AuthData, AppError>> {
    const result = await this.registrationRepository.registerByEmail(email, password, confirmationCode)
    if (isSuccess(result)) {
      await this.authStorage.updateTokens(result.data.sessionToken)
      await this.userStorage.updateCurrentUser(result.data.userPrivate)
    }
    return result
  }
}
