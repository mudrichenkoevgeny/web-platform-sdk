import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AccountLockoutType,
  CreateByEmailRequest,
  PagedResult,
  PermissionCode,
  SortOrder,
  UpdateUserRequest,
  UserAccountStatus,
  UserPrivatePayload,
  UserRole,
  UserSortValues,
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
   * @param pageNumber - One-based page index
   * @param pageSize - Maximum items returned per page
   * @param sortBy - Field to sort by
   * @param sortOrder - Sorting direction
   * @param roles - Filters users by their assigned role types
   * @param accountStatuses - Filters users by current account statuses
   * @param accountStatusesBeforeDeletion - Filters users by status held prior to scheduled deletion
   * @param accountLockoutTypes - Filters users by account lockout state types
   * @param authorityLevelFrom - Lower bound filter for authority level
   * @param authorityLevelTo - Upper bound filter for authority level
   * @param isTotpEnabled - Filters users by whether TOTP second-factor authentication is active
   * @param permissionCodes - Filters users possessing specific permission codes
   * @returns Paginated result containing user summary payloads, or a mapped failure
   */
  getUsers(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserSortBy | null,
    sortOrder?: SortOrder | null,
    roles?: UserRole[] | null,
    accountStatuses?: UserAccountStatus[] | null,
    accountStatusesBeforeDeletion?: UserAccountStatus[] | null,
    accountLockoutTypes?: AccountLockoutType[] | null,
    authorityLevelFrom?: number | null,
    authorityLevelTo?: number | null,
    isTotpEnabled?: boolean | null,
    permissionCodes?: PermissionCode[] | null
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
