import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementUserListParams,
  PagedResult,
  UserPrivatePayload,
  UserSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserApi } from '@/network/api/user/management-user-api'
import type { CreateUserParams, UpdateUserParams } from '@/repository/user/management-user-repository'

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

  public async createUser(_params: CreateUserParams): Promise<AppResult<UserPrivatePayload, AppError>> {
    return this.createUserResult
  }

  public async getUsers(
    _params?: ManagementUserListParams | null
  ): Promise<AppResult<PagedResult<UserSummaryPayload>, AppError>> {
    return this.getUsersResult
  }

  public async getUser(_userId: string): Promise<AppResult<UserPrivatePayload, AppError>> {
    return this.getUserResult
  }

  public async updateUser(_userId: string, _params: UpdateUserParams): Promise<AppResult<void, AppError>> {
    return this.updateUserResult
  }

  public async deleteUser(_userId: string): Promise<AppResult<void, AppError>> {
    return this.deleteUserResult
  }
}
