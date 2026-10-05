import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AccountLockoutType,
  PagedResult,
  PermissionCode,
  SortOrder,
  UserAccountStatus,
  UserDetails,
  UserRole,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserRepository } from '@/repository/user/management-user-repository'

/** Options object for filtering administrative user list retrieval. */
export interface GetUsersParams {
  pageNumber?: number | null
  pageSize?: number | null
  sortBy?: UserSortValues.UserSortBy | null
  sortOrder?: SortOrder | null
  roles?: UserRole[] | null
  accountStatuses?: UserAccountStatus[] | null
  accountStatusesBeforeDeletion?: UserAccountStatus[] | null
  accountLockoutTypes?: AccountLockoutType[] | null
  authorityLevelFrom?: number | null
  authorityLevelTo?: number | null
  isTotpEnabled?: boolean | null
  permissionCodes?: PermissionCode[] | null
}

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
   * @returns Paginated result containing user details domain models, or a mapped failure
   */
  public async execute(params?: GetUsersParams): Promise<AppResult<PagedResult<UserDetails>, AppError>> {
    return this.managementUserRepository.getUsers(
      params?.pageNumber,
      params?.pageSize,
      params?.sortBy,
      params?.sortOrder,
      params?.roles,
      params?.accountStatuses,
      params?.accountStatusesBeforeDeletion,
      params?.accountLockoutTypes,
      params?.authorityLevelFrom,
      params?.authorityLevelTo,
      params?.isTotpEnabled,
      params?.permissionCodes
    )
  }
}
