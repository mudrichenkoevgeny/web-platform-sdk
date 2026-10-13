import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  CreateByEmailRequest,
  ManagementUserListParams,
  PagedResult,
  UpdateUserRequest,
  UserId,
  UserPrivate,
  UserSummary
} from '@mudrichenkoevgeny/shared-foundation'

/** Administrative repository providing staff and administrators full control over creating, fetching, filtering, updating, and removing user accounts across the system. */
export interface ManagementUserRepository {
  /**
   * Creates a new user account.
   *
   * @param request - Payload details for creating an account via email
   * @returns Detailed information of the newly created user domain model, or a mapped failure
   */
  createUser(request: CreateByEmailRequest): Promise<AppResult<UserPrivate, AppError>>

  /**
   * Returns a paginated and filtered list of users based on search criteria.
   *
   * @param params - Query parameters for management user list
   * @returns Paginated result containing user summary domain models, or a mapped failure
   */
  getUsers(
    params?: ManagementUserListParams | null
  ): Promise<AppResult<PagedResult<UserSummary>, AppError>>

  /**
   * Retrieves full management-level details of a specific user.
   *
   * @param userId - Unique account identifier
   * @returns Detailed profile information of the target user domain model, or a mapped failure
   */
  getUser(userId: UserId): Promise<AppResult<UserPrivate, AppError>>

  /**
   * Updates profile details, status, or permissions for a specific user.
   *
   * @param userId - Unique account identifier to update
   * @param request - Patch payload containing fields to change
   * @returns Void result or a mapped failure
   */
  updateUser(userId: UserId, request: UpdateUserRequest): Promise<AppResult<void, AppError>>

  /**
   * Completely deletes a specified user account.
   *
   * @param userId - Unique account identifier to remove
   * @returns Void result or a mapped failure
   */
  deleteUser(userId: UserId): Promise<AppResult<void, AppError>>
}
