import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementUserListParams,
  PagedResult,
  UserId,
  UserPrivate,
  UserSummary
} from '@mudrichenkoevgeny/shared-foundation'
import { toUserPrivate, toUserSummary } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserApi } from '@/network/api/user/management-user-api'
import type { CreateUserParams, ManagementUserRepository, UpdateUserParams } from '@/repository/user/management-user-repository'

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

  public async createUser(params: CreateUserParams): Promise<AppResult<UserPrivate, AppError>> {
    const result = await this.managementUserApi.createUser(params)
    return mapSuccess(result, (payload) => toUserPrivate(payload))
  }

  public async getUsers(
    params?: ManagementUserListParams | null
  ): Promise<AppResult<PagedResult<UserSummary>, AppError>> {
    const result = await this.managementUserApi.getUsers(params)
    return mapSuccess(result, (pagedPayload) => ({
      ...pagedPayload,
      items: pagedPayload.items.map((payload) => toUserSummary(payload))
    }))
  }

  public async getUser(userId: UserId): Promise<AppResult<UserPrivate, AppError>> {
    const result = await this.managementUserApi.getUser(userId)
    return mapSuccess(result, (payload) => toUserPrivate(payload))
  }

  public async updateUser(userId: UserId, params: UpdateUserParams): Promise<AppResult<void, AppError>> {
    return this.managementUserApi.updateUser(userId, params)
  }

  public async deleteUser(userId: UserId): Promise<AppResult<void, AppError>> {
    return this.managementUserApi.deleteUser(userId)
  }
}
