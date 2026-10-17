import { appendQueryParamsToPath, callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  CreateByEmailRequest,
  ManagementUserListParams,
  PagedResult,
  UpdateUserRequest,
  UserId,
  UserPrivatePayload,
  UserSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'
import {
  ManagementUserListParamsParser,
  ManagementUsersRoutes,
  pagedResultSchema,
  UserAccountStatus,
  UserApiPaths,
  userPrivatePayloadSchema,
  UserRole,
  userSummaryPayloadSchema
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserApi } from '@/network/api/user/management-user-api'
import type { CreateUserParams, UpdateUserParams } from '@/repository/user/management-user-repository'

/** {@link ManagementUserApi} implementation backed by {@link HttpClient}. */
export class FetchManagementUserApi implements ManagementUserApi {
  /**
   * Constructs a new {@link FetchManagementUserApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async createUser(params: CreateUserParams): Promise<AppResult<UserPrivatePayload, AppError>> {
    const payload: CreateByEmailRequest = {
      email: params.email,
      password: params.password ?? null,
      role: params.role ?? UserRole.USER,
      account_status: params.status ?? UserAccountStatus.ACTIVE,
      authority_level: params.authorityLevel ?? 0,
      permission_codes: []
    }
    return callResult(async () => {
      const createUserResponse = await this.client.request<unknown>(ManagementUsersRoutes.CREATE_USER, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      return userPrivatePayloadSchema.parse(createUserResponse)
    })
  }

  public async getUsers(
    params?: ManagementUserListParams | null
  ): Promise<AppResult<PagedResult<UserSummaryPayload>, AppError>> {
    const queryMap = ManagementUserListParamsParser.toQueryMap(params)
    const path = appendQueryParamsToPath(
      ManagementUsersRoutes.GET_USERS,
      queryMap
    )
    return callResult(async () => {
      const userListResponse = await this.client.request<unknown>(path)
      return pagedResultSchema(userSummaryPayloadSchema).parse(userListResponse)
    })
  }

  public async getUser(userId: UserId): Promise<AppResult<UserPrivatePayload, AppError>> {
    const path = ManagementUsersRoutes.GET_USER.replace(`{${UserApiPaths.USER_ID}}`, userId)
    return callResult(async () => {
      const userResponse = await this.client.request<unknown>(path)
      return userPrivatePayloadSchema.parse(userResponse)
    })
  }

  public async updateUser(userId: UserId, params: UpdateUserParams): Promise<AppResult<void, AppError>> {
    const path = ManagementUsersRoutes.UPDATE_USER.replace(`{${UserApiPaths.USER_ID}}`, userId)
    const payload: UpdateUserRequest = {
      account_status: params.accountStatus ?? null,
      authority_level: params.authorityLevel ?? null,
      permission_codes: params.permissionCodes ?? null,
      account_lockout_type: params.accountLockoutType ?? null,
      temporary_lockout_until: params.temporaryLockoutUntil ?? null
    }
    return callResult(() =>
      this.client.request<void>(path, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      })
    )
  }

  public async deleteUser(userId: UserId): Promise<AppResult<void, AppError>> {
    const path = ManagementUsersRoutes.DELETE_USER.replace(`{${UserApiPaths.USER_ID}}`, userId)
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }
}
