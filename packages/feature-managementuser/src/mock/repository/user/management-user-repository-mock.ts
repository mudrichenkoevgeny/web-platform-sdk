import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestUserPrivate, createTestUserSummaryList, type ManagementUserListParams, type PagedResult, type UserId, type UserPrivate, type UserSummary } from '@mudrichenkoevgeny/shared-foundation'
import type { CreateUserParams, ManagementUserRepository, UpdateUserParams } from '@/repository/user/management-user-repository'

/** Mock implementation of {@link ManagementUserRepository}. */
export class ManagementUserRepositoryMock implements ManagementUserRepository {
  public createUserResultProvider: (
    params: CreateUserParams
  ) => Promise<AppResult<UserPrivate, AppError>> = async () => appResultSuccess(createTestUserPrivate())

  public getUsersResultProvider: () => Promise<AppResult<PagedResult<UserSummary>, AppError>> = async () =>
    appResultSuccess(createTestPagedResult({
      items: createTestUserSummaryList(2)
    }))

  public getUserResultProvider: (userId: UserId) => Promise<AppResult<UserPrivate, AppError>> = async () =>
    appResultSuccess(createTestUserPrivate())

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
