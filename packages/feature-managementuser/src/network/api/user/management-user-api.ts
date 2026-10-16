import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementUserListParams,
  PagedResult,
  UserPrivatePayload,
  UserSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { CreateUserParams, UpdateUserParams } from '@/repository/user/management-user-repository'

/** Administrator and staff endpoints for full user management. */
export interface ManagementUserApi {
  /**
   * Creates a new user account.
   *
   * @param params - Domain parameters for creating an account
   * @returns Detailed information of the newly created user, or a mapped failure
   */
  createUser(params: CreateUserParams): Promise<AppResult<UserPrivatePayload, AppError>>

  /**
   * Returns a paginated and filtered list of users based on search criteria.
   *
   * @param params - Query, pagination, and filter parameters
   * @returns Paginated result containing user summary payloads, or a mapped failure
   */
  getUsers(
    params?: ManagementUserListParams | null
  ): Promise<AppResult<PagedResult<UserSummaryPayload>, AppError>>

  /**
   * Retrieves full management-level details of a specific user.
   *
   * @param userId - Unique account identifier
   * @returns Detailed profile information of the target user, or a mapped failure
   */
  getUser(userId: string): Promise<AppResult<UserPrivatePayload, AppError>>

  /**
   * Updates profile details, status, or permissions for a specific user.
   *
   * @param userId - Unique account identifier to update
   * @param params - Patch domain parameters containing fields to change
   * @returns Void result or a mapped failure
   */
  updateUser(userId: string, params: UpdateUserParams): Promise<AppResult<void, AppError>>

  /**
   * Completely deletes a specified user account.
   *
   * @param userId - Unique account identifier to remove
   * @returns Void result or a mapped failure
   */
  deleteUser(userId: string): Promise<AppResult<void, AppError>>
}
