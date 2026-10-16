import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserRepository, UpdateUserParams } from '@/repository/user/management-user-repository'

/** Updates profile details, status, or permissions for a specific user administratively. */
export class UpdateUserUseCase {
  /**
   * Constructs a new {@link UpdateUserUseCase}.
   *
   * @param managementUserRepository - Administrative user management repository
   */
  public constructor(private readonly managementUserRepository: ManagementUserRepository) {}

  /**
   * Executes the use case.
   *
   * @param userId - Unique account identifier to update
   * @param params - Domain parameters containing fields to change
   * @returns Void result or a mapped failure
   */
  public async execute(userId: UserId, params: UpdateUserParams): Promise<AppResult<void, AppError>> {
    return this.managementUserRepository.updateUser(userId, params)
  }
}
