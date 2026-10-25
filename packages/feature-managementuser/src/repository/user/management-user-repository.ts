import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AccountLockoutType,
  ManagementUserListParams,
  PagedResult,
  PermissionCode,
  UserAccountStatus,
  UserId,
  UserPrivate,
  UserRole,
  UserStorageConfiguration,
  UserSummary
} from '@mudrichenkoevgeny/shared-foundation'

/** Parameters for creating a user account administratively. */
export interface CreateUserParams {
  email: string
  password?: string | null
  role?: UserRole | null
  status?: UserAccountStatus | null
  authorityLevel?: number | null
  storageConfiguration?: UserStorageConfiguration | null
}

/** Parameters for updating a user account administratively. */
export interface UpdateUserParams {
  accountStatus?: UserAccountStatus | null
  authorityLevel?: number | null
  permissionCodes?: PermissionCode[] | null
  accountLockoutType?: AccountLockoutType | null
  lockoutType?: AccountLockoutType | null
  temporaryLockoutUntil?: number | null
  storageConfiguration?: UserStorageConfiguration | null
}

/** Administrative repository providing staff and administrators full control over creating, fetching, filtering, updating, and removing user accounts across the system. */
export interface ManagementUserRepository {
  /**
   * Creates a new user account.
   *
   * @param params - Domain parameters for creating an account
   * @returns Detailed information of the newly created user domain model, or a mapped failure
   */
  createUser(params: CreateUserParams): Promise<AppResult<UserPrivate, AppError>>

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
   * @returns Detailed information of the target user domain model, or a mapped failure
   */
  getUser(userId: UserId): Promise<AppResult<UserPrivate, AppError>>

  /**
   * Updates user details, status, or permissions for a specific user.
   *
   * @param userId - Unique account identifier to update
   * @param params - Patch domain parameters containing fields to change
   * @returns Void result or a mapped failure
   */
  updateUser(userId: UserId, params: UpdateUserParams): Promise<AppResult<void, AppError>>

  /**
   * Completely deletes a specified user account.
   *
   * @param userId - Unique account identifier to remove
   * @returns Void result or a mapped failure
   */
  deleteUser(userId: UserId): Promise<AppResult<void, AppError>>
}
