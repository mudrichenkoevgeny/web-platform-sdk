import { appendQueryParamsToPath, callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementGlobalIdentifierListParams,
  ManagementUserIdentifierListParams,
  PagedResult,
  UserId,
  UserIdentifierId,
  UserIdentifierPrivatePayload,
  UserIdentifierSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'
import {
  ManagementIdentifiersRoutes,
  pagedResultSchema,
  UserApiPaths,
  userIdentifierPrivatePayloadSchema,
  userIdentifierSummaryPayloadSchema
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementIdentifierApi } from '@/network/api/identifier/management-identifier-api'

/** {@link ManagementIdentifierApi} implementation backed by {@link HttpClient}. */
export class FetchManagementIdentifierApi implements ManagementIdentifierApi {
  /**
   * Constructs a new {@link FetchManagementIdentifierApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getIdentifiers(
    params?: ManagementGlobalIdentifierListParams | ManagementUserIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummaryPayload>, AppError>> {
    const path = appendQueryParamsToPath(
      ManagementIdentifiersRoutes.GET_IDENTIFIERS,
      params
    )
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return pagedResultSchema(userIdentifierSummaryPayloadSchema).parse(raw)
    })
  }

  public async getIdentifier(identifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    const query = new URLSearchParams({ [UserApiPaths.USER_IDENTIFIER_ID]: identifierId })
    const path = `${ManagementIdentifiersRoutes.GET_IDENTIFIER}?${query.toString()}`
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return userIdentifierPrivatePayloadSchema.parse(raw)
    })
  }

  public async deleteIdentifier(userId: UserId, identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    const query = new URLSearchParams({
      [UserApiPaths.USER_ID]: userId,
      [UserApiPaths.USER_IDENTIFIER_ID]: identifierId
    })
    const path = `${ManagementIdentifiersRoutes.DELETE_IDENTIFIER}?${query.toString()}`
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }

  public async deleteIdentifierPassword(userId: UserId, identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    const query = new URLSearchParams({
      [UserApiPaths.USER_ID]: userId,
      [UserApiPaths.USER_IDENTIFIER_ID]: identifierId
    })
    const path = `${ManagementIdentifiersRoutes.DELETE_IDENTIFIER_PASSWORD}?${query.toString()}`
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }
}
