import { z } from 'zod'
import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserPrivatePayload } from '@mudrichenkoevgeny/shared-foundation'
import { SelfManagementUserRoutes, selfUpdateUserRequestSchema, userPrivatePayloadSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { UpdateUserParams } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { SelfManagementUserApi } from '@/network/api/user/self-management-user-api'

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const updateUserParamsToSelfUpdateUserRequestSchema = z.preprocess((val) => {
  if (!isObjectRecord(val)) {
    return val
  }
  const raw: Record<string, unknown> = {}
  if ('nickname' in val && val.nickname !== undefined) {
    raw.nickname = val.nickname
  }
  if ('displayName' in val && val.displayName !== undefined) {
    raw.display_name = val.displayName
  }
  if ('avatarFileId' in val && val.avatarFileId !== undefined) {
    raw.avatar_file_id = val.avatarFileId ? String(val.avatarFileId) : null
  }
  if ('birthdate' in val && val.birthdate !== undefined) {
    raw.birthdate = typeof val.birthdate === 'number' ? val.birthdate : null
  }
  return raw
}, selfUpdateUserRequestSchema)

/** {@link SelfManagementUserApi} implementation backed by {@link HttpClient}. */
export class FetchSelfManagementUserApi implements SelfManagementUserApi {
  /**
   * Constructs a new {@link FetchSelfManagementUserApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  /**
   * Fetches the signed-in user.
   *
   * @returns Current user DTO from the shared contract, or a mapped failure
   */
  public async getUser(): Promise<AppResult<UserPrivatePayload, AppError>> {
    return callResult(async () => {
      const userResponse = await this.client.request<unknown>(SelfManagementUserRoutes.GET_USER)
      return userPrivatePayloadSchema.parse(userResponse)
    })
  }

  /**
   * Partially updates account details and profile fields of the current authenticated staff member.
   * Uses Zod preprocessing schema to validate and transform domain parameters into network DTO format.
   *
   * @param params - Partial profile update domain parameters
   * @returns Updated current user DTO, or a mapped failure
   */
  public async selfUpdateUser(params: UpdateUserParams): Promise<AppResult<UserPrivatePayload, AppError>> {
    const payload = updateUserParamsToSelfUpdateUserRequestSchema.parse(params)
    return callResult(async () => {
      const userResponse = await this.client.request<unknown>(SelfManagementUserRoutes.UPDATE_USER, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      })
      return userPrivatePayloadSchema.parse(userResponse)
    })
  }
}
