import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
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
import { toUserDetails } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserApi } from '@/network/api/user/management-user-api'
import type { ManagementUserRepository } from '@/repository/user/management-user-repository'

/**
 * Implementation of {@link ManagementUserRepository}.
 */
export class ManagementUserRepositoryImpl implements ManagementUserRepository {
  /**
   * Constructs a new {@link ManagementUserRepositoryImpl}.
   *
   * @param managementUserApi - Network API source
   */
  public constructor(private readonly managementUserApi: ManagementUserApi) {}

  public async createUser(request: CreateByEmailRequest): Promise<AppResult<UserDetails, AppError>> {
    const result = await this.managementUserApi.createUser(request)
    return mapSuccess(result, (payload) => toUserDetails(payload))
  }

  public async getUsers(
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
  ): Promise<AppResult<PagedResult<UserDetails>, AppError>> {
    const result = await this.managementUserApi.getUsers(
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
      roles,
      accountStatuses,
      accountStatusesBeforeDeletion,
      accountLockoutTypes,
      authorityLevelFrom,
      authorityLevelTo,
      isTotpEnabled,
      permissionCodes
    )
    return mapSuccess(result, (pagedPayload) => ({
      ...pagedPayload,
      items: pagedPayload.items.map((payload) => toUserDetails(payload))
    }))
  }

  public async getUser(userId: UserId): Promise<AppResult<UserDetails, AppError>> {
    const result = await this.managementUserApi.getUser(userId)
    return mapSuccess(result, (payload) => toUserDetails(payload))
  }

  public async updateUser(userId: UserId, request: UpdateUserRequest): Promise<AppResult<void, AppError>> {
    return this.managementUserApi.updateUser(userId, request)
  }

  public async deleteUser(userId: UserId): Promise<AppResult<void, AppError>> {
    return this.managementUserApi.deleteUser(userId)
  }
}
