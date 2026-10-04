import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserRepository } from '@/repository/user/UserRepository'
import type { UserDetails } from '@mudrichenkoevgeny/shared-foundation'

/** Refreshes and returns current user profile details. */
export class GetUserUseCase {
  /**
   * Constructs a new {@link GetUserUseCase}.
   *
   * @param userRepository - User repository
   */
  public constructor(private readonly userRepository: UserRepository) {}

  /**
   * Refreshes and returns active user details.
   *
   * @returns UserDetails or AppError
   */
  public async execute(): Promise<AppResult<UserDetails, AppError>> {
    return this.userRepository.refreshCurrentUser()
  }
}
