import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
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
import type { ManagementUserApi } from '@/network/api/user/management-user-api'

/** Mock implementation of {@link ManagementUserApi}. */
export class ManagementUserApiMock implements ManagementUserApi {
  public createUserResult: AppResult<UserDetailsPayload, AppError> = appResultFailure(CommonError.unknown())
  public getUsersResult: AppResult<PagedResult<UserDetailsPayload>, AppError> = appResultSuccess({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0
  })
  public getUserResult: AppResult<UserDetailsPayload, AppError> = appResultFailure(CommonError.unknown())
  public updateUserResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())
  public deleteUserResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())

  public async createUser(_request: CreateByEmailRequest): Promise<AppResult<UserDetailsPayload, AppError>> {
    return this.createUserResult
  }

  public async getUsers(
    _pageNumber?: number | null,
    _pageSize?: number | null,
    _sortBy?: UserSortValues.UserSortBy | null,
    _sortOrder?: SortOrder | null,
    _roles?: UserRole[] | null,
    _accountStatuses?: UserAccountStatus[] | null,
    _accountStatusesBeforeDeletion?: UserAccountStatus[] | null,
    _accountLockoutTypes?: AccountLockoutType[] | null,
    _authorityLevelFrom?: number | null,
    _authorityLevelTo?: number | null,
    _isTotpEnabled?: boolean | null,
    _permissionCodes?: PermissionCode[] | null
  ): Promise<AppResult<PagedResult<UserDetailsPayload>, AppError>> {
    return this.getUsersResult
  }

  public async getUser(_userId: UserId): Promise<AppResult<UserDetailsPayload, AppError>> {
    return this.getUserResult
  }

  public async updateUser(_userId: UserId, _request: UpdateUserRequest): Promise<AppResult<void, AppError>> {
    return this.updateUserResult
  }

  public async deleteUser(_userId: UserId): Promise<AppResult<void, AppError>> {
    return this.deleteUserResult
  }
}
