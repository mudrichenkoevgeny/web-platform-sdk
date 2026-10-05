import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserRepository } from '@/repository/user/UserRepository'
import type { UserDetails } from '@mudrichenkoevgeny/shared-foundation'

/** Cancels pending account deletion request and restores account. */
export class RestoreUserUseCase {
  /**
   * Constructs a new {@link RestoreUserUseCase}.
   *
   * @param userRepository - User repository
   */
  public constructor(private readonly userRepository: UserRepository) {}

  /**
   * Restores user account.
   *
   * @returns UserDetails or AppError
   */
  public async execute(): Promise<AppResult<UserDetails, AppError>> {
    return this.userRepository.restoreUser()
  }
}
