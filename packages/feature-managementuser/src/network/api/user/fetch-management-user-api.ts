import { appendQueryParamsToPath, callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  CreateByEmailRequest,
  ManagementUserListParams,
  PagedResult,
  UpdateUserRequest,
  UserPrivatePayload,
  UserSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'
import {
  ManagementUsersRoutes,
  pagedResultSchema,
  UserApiPaths,
  userPrivatePayloadSchema,
  userSummaryPayloadSchema
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserApi } from '@/network/api/user/management-user-api'

/** {@link ManagementUserApi} implementation backed by {@link HttpClient}. */
export class FetchManagementUserApi implements ManagementUserApi {
  /**
   * Constructs a new {@link FetchManagementUserApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async createUser(request: CreateByEmailRequest): Promise<AppResult<UserPrivatePayload, AppError>> {
    return callResult(async () => {
      const raw = await this.client.request<unknown>(ManagementUsersRoutes.CREATE_USER, {
        method: 'POST',
        body: JSON.stringify(request)
      })
      return userPrivatePayloadSchema.parse(raw)
    })
  }

  public async getUsers(
    params?: ManagementUserListParams | null
  ): Promise<AppResult<PagedResult<UserSummaryPayload>, AppError>> {
    const path = appendQueryParamsToPath(
      ManagementUsersRoutes.GET_USERS,
      params
    )
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return pagedResultSchema(userSummaryPayloadSchema).parse(raw)
    })
  }

  public async getUser(userId: string): Promise<AppResult<UserPrivatePayload, AppError>> {
    const query = new URLSearchParams({ [UserApiPaths.USER_ID]: userId })
    const path = `${ManagementUsersRoutes.GET_USER}?${query.toString()}`
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return userPrivatePayloadSchema.parse(raw)
    })
  }

  public async updateUser(userId: string, request: UpdateUserRequest): Promise<AppResult<void, AppError>> {
    const query = new URLSearchParams({ [UserApiPaths.USER_ID]: userId })
    const path = `${ManagementUsersRoutes.UPDATE_USER}?${query.toString()}`
    return callResult(() =>
      this.client.request<void>(path, {
        method: 'PATCH',
        body: JSON.stringify(request)
      })
    )
  }

  public async deleteUser(userId: string): Promise<AppResult<void, AppError>> {
    const query = new URLSearchParams({ [UserApiPaths.USER_ID]: userId })
    const path = `${ManagementUsersRoutes.DELETE_USER}?${query.toString()}`
    return callResult(() =>
      this.client.request<void>(path, {
        method: 'DELETE'
      })
    )
  }
}
