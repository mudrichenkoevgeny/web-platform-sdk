import { z } from 'zod'
import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserPrivatePayload } from '@mudrichenkoevgeny/shared-foundation'
import { OpenUserRoutes, selfUpdateUserRequestSchema, userPrivatePayloadSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { UpdateUserParams } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenUserApi } from '@/network/api/user/open-user-api'

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

/** {@link OpenUserApi} implementation backed by {@link HttpClient}. */
export class FetchOpenUserApi implements OpenUserApi {
  /**
   * Constructs a new {@link FetchOpenUserApi}.
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
      const userResponse = await this.client.request<unknown>(OpenUserRoutes.GET_USER)
      return userPrivatePayloadSchema.parse(userResponse)
    })
  }

  /**
   * Partially updates account details and profile fields of the currently authenticated user.
   * Uses Zod preprocessing schema to validate and transform domain parameters into network DTO format.
   *
   * @param params - Partial profile update domain parameters
   * @returns Updated current user DTO, or a mapped failure
   */
  public async selfUpdateUser(params: UpdateUserParams): Promise<AppResult<UserPrivatePayload, AppError>> {
    const payload = updateUserParamsToSelfUpdateUserRequestSchema.parse(params)
    return callResult(async () => {
      const userResponse = await this.client.request<unknown>(OpenUserRoutes.UPDATE_USER, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      })
      return userPrivatePayloadSchema.parse(userResponse)
    })
  }

  /**
   * Permanently deletes the signed-in account on the server.
   *
   * @returns Current user DTO reflecting pending deletion state, or a mapped failure
   */
  public async scheduleUserDeletion(): Promise<AppResult<UserPrivatePayload, AppError>> {
    return callResult(async () => {
      const userResponse = await this.client.request<unknown>(OpenUserRoutes.SCHEDULE_DELETION, {
        method: 'DELETE'
      })
      return userPrivatePayloadSchema.parse(userResponse)
    })
  }

  /**
   * Cancels a scheduled account deletion and restores the user to an active state.
   *
   * @returns Current user DTO reflecting the restored account status, or a mapped failure
   */
  public async restoreUser(): Promise<AppResult<UserPrivatePayload, AppError>> {
    return callResult(async () => {
      const userResponse = await this.client.request<unknown>(OpenUserRoutes.RESTORE_USER, {
        method: 'POST'
      })
      return userPrivatePayloadSchema.parse(userResponse)
    })
  }
}
