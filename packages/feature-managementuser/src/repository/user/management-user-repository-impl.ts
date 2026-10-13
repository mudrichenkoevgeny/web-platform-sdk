import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  CreateByEmailRequest,
  ManagementUserListParams,
  PagedResult,
  UpdateUserRequest,
  UserId,
  UserPrivate,
  UserSummary
} from '@mudrichenkoevgeny/shared-foundation'
import { toUserPrivate, toUserSummary } from '@mudrichenkoevgeny/shared-foundation'
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

  public async createUser(request: CreateByEmailRequest): Promise<AppResult<UserPrivate, AppError>> {
    const result = await this.managementUserApi.createUser(request)
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

  public async updateUser(userId: UserId, request: UpdateUserRequest): Promise<AppResult<void, AppError>> {
    return this.managementUserApi.updateUser(userId, request)
  }

  public async deleteUser(userId: UserId): Promise<AppResult<void, AppError>> {
    return this.managementUserApi.deleteUser(userId)
  }
}
