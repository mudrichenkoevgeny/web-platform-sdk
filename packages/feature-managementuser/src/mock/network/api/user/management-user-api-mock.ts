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
  UserPrivatePayload,
  UserRole,
  UserSortValues,
  UserSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserApi } from '@/network/api/user/management-user-api'

/** Mock implementation of {@link ManagementUserApi}. */
export class ManagementUserApiMock implements ManagementUserApi {
  public createUserResult: AppResult<UserPrivatePayload, AppError> = appResultFailure(CommonError.unknown())
  public getUsersResult: AppResult<PagedResult<UserSummaryPayload>, AppError> = appResultSuccess({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0
  })
  public getUserResult: AppResult<UserPrivatePayload, AppError> = appResultFailure(CommonError.unknown())
  public updateUserResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())
  public deleteUserResult: AppResult<void, AppError> = appResultFailure(CommonError.unknown())

  public async createUser(_request: CreateByEmailRequest): Promise<AppResult<UserPrivatePayload, AppError>> {
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
  ): Promise<AppResult<PagedResult<UserSummaryPayload>, AppError>> {
    return this.getUsersResult
  }

  public async getUser(_userId: string): Promise<AppResult<UserPrivatePayload, AppError>> {
    return this.getUserResult
  }

  public async updateUser(_userId: string, _request: UpdateUserRequest): Promise<AppResult<void, AppError>> {
    return this.updateUserResult
  }

  public async deleteUser(_userId: string): Promise<AppResult<void, AppError>> {
    return this.deleteUserResult
  }
}
