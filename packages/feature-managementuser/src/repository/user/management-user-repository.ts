import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AccountLockoutType,
  CreateByEmailRequest,
  PagedResult,
  PermissionCode,
  SortOrder,
  UpdateUserRequest,
  UserAccountStatus,
  UserDetails,
  UserId,
  UserRole,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'

/** Administrative repository providing staff and administrators full control over creating, fetching, filtering, updating, and removing user accounts across the system. */
export interface ManagementUserRepository {
  /**
   * Creates a new user account.
   *
   * @param request - Payload details for creating an account via email
   * @returns Detailed information of the newly created user domain model, or a mapped failure
   */
  createUser(request: CreateByEmailRequest): Promise<AppResult<UserDetails, AppError>>

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
   * @returns Paginated result containing user details domain models, or a mapped failure
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
  ): Promise<AppResult<PagedResult<UserDetails>, AppError>>

  /**
   * Retrieves full management-level details of a specific user.
   *
   * @param userId - Unique account identifier
   * @returns Detailed profile information of the target user domain model, or a mapped failure
   */
  getUser(userId: UserId): Promise<AppResult<UserDetails, AppError>>

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
