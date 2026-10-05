import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserDetails, UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserRepository } from '@/repository/user/management-user-repository'

/** Retrieves full management-level details of a specific user. */
export class GetUserUseCase {
  /**
   * Constructs a new {@link GetUserUseCase}.
   *
   * @param managementUserRepository - Administrative user management repository
   */
  public constructor(private readonly managementUserRepository: ManagementUserRepository) {}

  /**
   * Executes the use case.
   *
   * @param userId - Unique account identifier
   * @returns Detailed profile information of the target user domain model, or a mapped failure
   */
  public async execute(userId: UserId): Promise<AppResult<UserDetails, AppError>> {
    return this.managementUserRepository.getUser(userId)
  }
}
