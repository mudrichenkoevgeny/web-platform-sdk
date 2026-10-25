import { z } from 'zod'
import { appendQueryParamsToPath, callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementUserListParams,
  PagedResult,
  UserId,
  UserPrivatePayload,
  UserSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'
import {
  AccountLockoutType,
  createByEmailRequestSchema,
  ManagementUserListParamsParser,
  ManagementUsersRoutes,
  pagedResultSchema,
  updateUserRequestSchema,
  UserAccountStatus,
  UserApiPaths,
  userPrivatePayloadSchema,
  UserRole,
  userSummaryPayloadSchema
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserApi } from '@/network/api/user/management-user-api'
import type { CreateUserParams, UpdateUserParams } from '@/repository/user/management-user-repository'

const storageConfigSchema = z
  .object({
    quotaBytes: z.number().nullable().optional(),
    maxUploadSizeBytes: z.number().nullable().optional(),
    maxPendingUploads: z.number().nullable().optional()
  })
  .nullable()
  .optional()

const createUserParamsMapperSchema = z
  .object({
    email: z.string(),
    password: z.string().nullable().optional(),
    role: z.nativeEnum(UserRole).nullable().optional(),
    status: z.nativeEnum(UserAccountStatus).nullable().optional(),
    authorityLevel: z.number().nullable().optional(),
    storageConfiguration: storageConfigSchema
  })
  .transform((params) =>
    createByEmailRequestSchema.parse({
      email: params.email,
      password: params.password ?? null,
      role: params.role ?? UserRole.USER,
      account_status: params.status ?? UserAccountStatus.ACTIVE,
      authority_level: params.authorityLevel ?? 0,
      permission_codes: [],
      storage_configuration: params.storageConfiguration
        ? {
            quota_bytes: params.storageConfiguration.quotaBytes ?? null,
            max_upload_size_bytes: params.storageConfiguration.maxUploadSizeBytes ?? null,
            max_pending_uploads: params.storageConfiguration.maxPendingUploads ?? null
          }
        : null
    })
  )

const updateUserParamsMapperSchema = z
  .object({
    accountStatus: z.nativeEnum(UserAccountStatus).nullable().optional(),
    authorityLevel: z.number().nullable().optional(),
    permissionCodes: z.array(z.string()).nullable().optional(),
    accountLockoutType: z.nativeEnum(AccountLockoutType).nullable().optional(),
    lockoutType: z.nativeEnum(AccountLockoutType).nullable().optional(),
    temporaryLockoutUntil: z.number().nullable().optional(),
    storageConfiguration: storageConfigSchema
  })
  .transform((params) =>
    updateUserRequestSchema.parse({
      account_status: params.accountStatus ?? null,
      authority_level: params.authorityLevel ?? null,
      permission_codes: params.permissionCodes ?? null,
      account_lockout_type: params.accountLockoutType ?? params.lockoutType ?? null,
      temporary_lockout_until: params.temporaryLockoutUntil ?? null,
      storage_configuration: params.storageConfiguration
        ? {
            quota_bytes: params.storageConfiguration.quotaBytes ?? null,
            max_upload_size_bytes: params.storageConfiguration.maxUploadSizeBytes ?? null,
            max_pending_uploads: params.storageConfiguration.maxPendingUploads ?? null
          }
        : null
    })
  )

/** {@link ManagementUserApi} implementation backed by {@link HttpClient}. */
export class FetchManagementUserApi implements ManagementUserApi {
  /**
   * Constructs a new {@link FetchManagementUserApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async createUser(params: CreateUserParams): Promise<AppResult<UserPrivatePayload, AppError>> {
    const payload = createUserParamsMapperSchema.parse(params)
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
    const payload = updateUserParamsMapperSchema.parse(params)
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
