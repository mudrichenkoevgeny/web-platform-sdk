import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  CreateByEmailRequest,
  ManagementUserListParams,
  PagedResult,
  UpdateUserRequest,
  UserPrivatePayload,
  UserSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'

/** Administrator and staff endpoints for full user management. */
export interface ManagementUserApi {
  /**
   * Creates a new user account.
   *
   * @param request - Payload details for creating an account via email
   * @returns Detailed information of the newly created user, or a mapped failure
   */
  createUser(request: CreateByEmailRequest): Promise<AppResult<UserPrivatePayload, AppError>>

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
   * @param request - Patch payload containing fields to change
   * @returns Void result or a mapped failure
   */
  updateUser(userId: string, request: UpdateUserRequest): Promise<AppResult<void, AppError>>

  /**
   * Completely deletes a specified user account.
   *
   * @param userId - Unique account identifier to remove
   * @returns Void result or a mapped failure
   */
  deleteUser(userId: string): Promise<AppResult<void, AppError>>
}
