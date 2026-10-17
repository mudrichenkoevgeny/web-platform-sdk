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
  ManagementGlobalIdentifierListParamsParser,
  ManagementIdentifiersRoutes,
  ManagementUserIdentifierListParamsParser,
  pagedResultSchema,
  UserApiPaths,
  userIdentifierPrivatePayloadSchema,
  userIdentifierSummaryPayloadSchema
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementIdentifierApi } from '@/network/api/identifier/management-identifier-api'

function isUserSpecificIdentifierParams(
  params: ManagementGlobalIdentifierListParams | ManagementUserIdentifierListParams | null | undefined
): params is ManagementUserIdentifierListParams {
  return typeof params === 'object' && params !== null && 'userId' in params && typeof params.userId === 'string' && params.userId.length > 0
}

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
    let route: string
    let queryMap: Record<string, unknown> | null = null

    if (isUserSpecificIdentifierParams(params)) {
      route = ManagementIdentifiersRoutes.GET_USER_IDENTIFIERS.replace(`{${UserApiPaths.USER_ID}}`, params.userId ?? '')
      queryMap = ManagementUserIdentifierListParamsParser.toQueryMap(params)
    } else {
      route = ManagementIdentifiersRoutes.GET_IDENTIFIERS
      queryMap = ManagementGlobalIdentifierListParamsParser.toQueryMap(params)
    }

    const path = appendQueryParamsToPath(route, queryMap)
    return callResult(async () => {
      const userIdentifierListResponse = await this.client.request<unknown>(path)
      return pagedResultSchema(userIdentifierSummaryPayloadSchema).parse(userIdentifierListResponse)
    })
  }

  public async getIdentifier(identifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    const path = ManagementIdentifiersRoutes.GET_IDENTIFIER.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, identifierId)
    return callResult(async () => {
      const userIdentifierResponse = await this.client.request<unknown>(path)
      return userIdentifierPrivatePayloadSchema.parse(userIdentifierResponse)
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
