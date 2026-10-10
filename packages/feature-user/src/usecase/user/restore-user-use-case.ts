import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserRepository } from '@/repository/user/user-repository'
import type { UserPrivate } from '@mudrichenkoevgeny/shared-foundation'

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
   * @returns UserPrivate or AppError
   */
  public async execute(): Promise<AppResult<UserPrivate, AppError>> {
    return this.userRepository.restoreUser()
  }
}
