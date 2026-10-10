import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserRepository } from '@/repository/user/user-repository'
import type { UserPrivate } from '@mudrichenkoevgeny/shared-foundation'

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
   * @returns UserPrivate or AppError
   */
  public async execute(): Promise<AppResult<UserPrivate, AppError>> {
    return this.userRepository.refreshCurrentUser()
  }
}
