import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementUserListParams,
  PagedResult,
  UserSummary
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserRepository } from '@/repository/user/management-user-repository'

/** Returns a paginated and filtered list of users based on search criteria for administrative purposes. */
export class GetUsersUseCase {
  /**
   * Constructs a new {@link GetUsersUseCase}.
   *
   * @param managementUserRepository - Administrative user management repository
   */
  public constructor(private readonly managementUserRepository: ManagementUserRepository) {}

  /**
   * Executes the use case.
   *
   * @param params - Query and filter parameters
   * @returns Paginated result containing user summary domain models, or a mapped failure
   */
  public async execute(params?: ManagementUserListParams | null): Promise<AppResult<PagedResult<UserSummary>, AppError>> {
    return this.managementUserRepository.getUsers(params)
  }
}
