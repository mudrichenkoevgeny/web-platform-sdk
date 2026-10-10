import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AccountLockoutType,
  CreateByEmailRequest,
  PagedResult,
  PermissionCode,
  SortOrder,
  UpdateUserRequest,
  UserAccountStatus,
  UserId,
  UserPrivate,
  UserRole,
  UserSortValues,
  UserSummary
} from '@mudrichenkoevgeny/shared-foundation'
import { userPrivateMock, userSummaryMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { ManagementUserRepository } from '@/repository/user/management-user-repository'

/** Mock implementation of {@link ManagementUserRepository}. */
export class ManagementUserRepositoryMock implements ManagementUserRepository {
  public createUserResultProvider: (
    request: CreateByEmailRequest
  ) => Promise<AppResult<UserPrivate, AppError>> = async () => appResultSuccess(userPrivateMock())

  public getUsersResultProvider: () => Promise<AppResult<PagedResult<UserSummary>, AppError>> = async () =>
    appResultSuccess({
      items: [userSummaryMock()],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 20,
      totalPages: 1
    })

  public getUserResultProvider: (userId: UserId) => Promise<AppResult<UserPrivate, AppError>> = async () =>
    appResultSuccess(userPrivateMock())

  public updateUserResultProvider: (
    userId: UserId,
    request: UpdateUserRequest
  ) => Promise<AppResult<void, AppError>> = async () => appResultSuccess(undefined)

  public deleteUserResultProvider: (userId: UserId) => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public lastCreateRequest: CreateByEmailRequest | null = null
  public lastUpdateUserId: UserId | null = null
  public lastUpdateRequest: UpdateUserRequest | null = null
  public lastDeleteUserId: UserId | null = null
  public lastGetUserId: UserId | null = null

  public async createUser(request: CreateByEmailRequest): Promise<AppResult<UserPrivate, AppError>> {
    this.lastCreateRequest = request
    return this.createUserResultProvider(request)
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
  ): Promise<AppResult<PagedResult<UserSummary>, AppError>> {
    return this.getUsersResultProvider()
  }

  public async getUser(userId: UserId): Promise<AppResult<UserPrivate, AppError>> {
    this.lastGetUserId = userId
    return this.getUserResultProvider(userId)
  }

  public async updateUser(userId: UserId, request: UpdateUserRequest): Promise<AppResult<void, AppError>> {
    this.lastUpdateUserId = userId
    this.lastUpdateRequest = request
    return this.updateUserResultProvider(userId, request)
  }

  public async deleteUser(userId: UserId): Promise<AppResult<void, AppError>> {
    this.lastDeleteUserId = userId
    return this.deleteUserResultProvider(userId)
  }
}
