import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AccountLockoutType,
  CreateByEmailRequest,
  PagedResult,
  PermissionCode,
  SortOrder,
  UpdateUserRequest,
  UserAccountStatus,
  UserDetailsPayload,
  UserId,
  UserRole,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import {
  ListingParamNames,
  ManagementUserRoutes,
  UserApiPaths,
  UserFilterValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserApi } from '@/network/api/user/ManagementUserApi'

/** {@link ManagementUserApi} implementation backed by {@link HttpClient}. */
export class FetchManagementUserApi implements ManagementUserApi {
  /**
   * Constructs a new {@link FetchManagementUserApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async createUser(request: CreateByEmailRequest): Promise<AppResult<UserDetailsPayload, AppError>> {
    return callResult(() =>
      this.client.request<UserDetailsPayload>(ManagementUserRoutes.CREATE_USER, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
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
  ): Promise<AppResult<PagedResult<UserDetailsPayload>, AppError>> {
    const query = new URLSearchParams()
    if (pageNumber != null) query.append(ListingParamNames.PAGE_NUMBER, String(pageNumber))
    if (pageSize != null) query.append(ListingParamNames.PAGE_SIZE, String(pageSize))
    if (sortBy != null) query.append(ListingParamNames.SORT_BY, String(sortBy))
    if (sortOrder != null) query.append(ListingParamNames.SORT_ORDER, String(sortOrder))

    if (roles) {
      roles.forEach((role) => query.append(UserFilterValues.UserFilterValues.ROLE, String(role)))
    }
    if (accountStatuses) {
      accountStatuses.forEach((status) => query.append(UserFilterValues.UserFilterValues.ACCOUNT_STATUS, String(status)))
    }
    if (accountStatusesBeforeDeletion) {
      accountStatusesBeforeDeletion.forEach((status) =>
        query.append(UserFilterValues.UserFilterValues.ACCOUNT_STATUS_ON_RESTORE, String(status))
      )
    }
    if (accountLockoutTypes) {
      accountLockoutTypes.forEach((type) =>
        query.append(UserFilterValues.UserFilterValues.ACCOUNT_LOCKOUT_TYPE, String(type))
      )
    }
    if (authorityLevelFrom != null) {
      query.append(UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_FROM, String(authorityLevelFrom))
    }
    if (authorityLevelTo != null) {
      query.append(UserFilterValues.UserFilterValues.AUTHORITY_LEVEL_TO, String(authorityLevelTo))
    }
    if (isTotpEnabled != null) {
      query.append(UserFilterValues.UserFilterValues.IS_TOTP_ENABLED, String(isTotpEnabled))
    }
    if (permissionCodes) {
      permissionCodes.forEach((code) => query.append(UserFilterValues.UserFilterValues.PERMISSION_CODES, String(code)))
    }

    const queryString = query.toString()
    const path = queryString ? `${ManagementUserRoutes.GET_USERS}?${queryString}` : ManagementUserRoutes.GET_USERS

    return callResult(() => this.client.request<PagedResult<UserDetailsPayload>>(path))
  }

  public async getUser(userId: UserId): Promise<AppResult<UserDetailsPayload, AppError>> {
    const query = new URLSearchParams({ [UserApiPaths.USER_ID]: userId })
    const path = `${ManagementUserRoutes.GET_USER}?${query.toString()}`
    return callResult(() => this.client.request<UserDetailsPayload>(path))
  }

  public async updateUser(userId: UserId, request: UpdateUserRequest): Promise<AppResult<void, AppError>> {
    const query = new URLSearchParams({ [UserApiPaths.USER_ID]: userId })
    const path = `${ManagementUserRoutes.UPDATE_USER}?${query.toString()}`
    return callResult(() =>
      this.client.request<void>(path, {
        method: 'PATCH',
        body: JSON.stringify(request)
      })
    )
  }

  public async deleteUser(userId: UserId): Promise<AppResult<void, AppError>> {
    const query = new URLSearchParams({ [UserApiPaths.USER_ID]: userId })
    const path = `${ManagementUserRoutes.DELETE_USER}?${query.toString()}`
    return callResult(() =>
      this.client.request<void>(path, {
        method: 'DELETE'
      })
    )
  }
}
