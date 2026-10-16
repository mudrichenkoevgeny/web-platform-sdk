import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementUserListParams,
  PagedResult,
  UserId,
  UserPrivate,
  UserSummary
} from '@mudrichenkoevgeny/shared-foundation'
import { userPrivateMock, userSummaryMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { CreateUserParams, ManagementUserRepository, UpdateUserParams } from '@/repository/user/management-user-repository'

/** Mock implementation of {@link ManagementUserRepository}. */
export class ManagementUserRepositoryMock implements ManagementUserRepository {
  public createUserResultProvider: (
    params: CreateUserParams
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
    params: UpdateUserParams
  ) => Promise<AppResult<void, AppError>> = async () => appResultSuccess(undefined)

  public deleteUserResultProvider: (userId: UserId) => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public lastCreateRequest: CreateUserParams | null = null
  public lastUpdateUserId: UserId | null = null
  public lastUpdateRequest: UpdateUserParams | null = null
  public lastDeleteUserId: UserId | null = null
  public lastGetUserId: UserId | null = null

  public async createUser(params: CreateUserParams): Promise<AppResult<UserPrivate, AppError>> {
    this.lastCreateRequest = params
    return this.createUserResultProvider(params)
  }

  public async getUsers(
    _params?: ManagementUserListParams | null
  ): Promise<AppResult<PagedResult<UserSummary>, AppError>> {
    return this.getUsersResultProvider()
  }

  public async getUser(userId: UserId): Promise<AppResult<UserPrivate, AppError>> {
    this.lastGetUserId = userId
    return this.getUserResultProvider(userId)
  }

  public async updateUser(userId: UserId, params: UpdateUserParams): Promise<AppResult<void, AppError>> {
    this.lastUpdateUserId = userId
    this.lastUpdateRequest = params
    return this.updateUserResultProvider(userId, params)
  }

  public async deleteUser(userId: UserId): Promise<AppResult<void, AppError>> {
    this.lastDeleteUserId = userId
    return this.deleteUserResultProvider(userId)
  }
}
