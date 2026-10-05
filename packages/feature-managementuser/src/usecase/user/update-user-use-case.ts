import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UpdateUserRequest, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserRepository } from '@/repository/user/ManagementUserRepository'

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
   * @param request - Patch payload containing fields to change
   * @returns Void result or a mapped failure
   */
  public async execute(userId: UserId, request: UpdateUserRequest): Promise<AppResult<void, AppError>> {
    return this.managementUserRepository.updateUser(userId, request)
  }
}
