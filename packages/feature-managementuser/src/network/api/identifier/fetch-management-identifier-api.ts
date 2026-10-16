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
    const route = params && 'userId' in params && params.userId
      ? ManagementIdentifiersRoutes.GET_USER_IDENTIFIERS.replace(`{${UserApiPaths.USER_ID}}`, params.userId)
      : ManagementIdentifiersRoutes.GET_IDENTIFIERS
    let queryParams: Record<string, unknown> | null = null
    if (params) {
      const { userId: _ignored, ...rest } = params as Record<string, unknown>
      queryParams = rest
    }
    const path = appendQueryParamsToPath(route, queryParams)
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return pagedResultSchema(userIdentifierSummaryPayloadSchema).parse(raw)
    })
  }

  public async getIdentifier(identifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    const path = ManagementIdentifiersRoutes.GET_IDENTIFIER.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, identifierId)
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return userIdentifierPrivatePayloadSchema.parse(raw)
    })
  }

  public async deleteIdentifier(_userId: UserId, identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    const path = ManagementIdentifiersRoutes.DELETE_IDENTIFIER.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, identifierId)
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }

  public async deleteIdentifierPassword(_userId: UserId, identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    const path = ManagementIdentifiersRoutes.DELETE_IDENTIFIER_PASSWORD.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, identifierId)
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }
}
