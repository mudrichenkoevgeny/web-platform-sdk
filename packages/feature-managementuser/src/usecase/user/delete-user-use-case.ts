import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserRepository } from '@/repository/user/management-user-repository'

/** Completely deletes a specified user account administratively. */
export class DeleteUserUseCase {
  /**
   * Constructs a new {@link DeleteUserUseCase}.
   *
   * @param managementUserRepository - Administrative user management repository
   */
  public constructor(private readonly managementUserRepository: ManagementUserRepository) {}

  /**
   * Executes the use case.
   *
   * @param userId - Unique account identifier to remove
   * @returns Void result or a mapped failure
   */
  public async execute(userId: UserId): Promise<AppResult<void, AppError>> {
    return this.managementUserRepository.deleteUser(userId)
  }
}
