import { appendQueryParamsToPath, callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  EmailPasswordChangeRequest,
  PagedResult,
  SelfIdentifierListParams,
  UserIdentifierId,
  UserIdentifierPrivatePayload,
  UserIdentifierSummaryPayload
} from '@mudrichenkoevgeny/shared-foundation'
import {
  pagedResultSchema,
  SelfIdentifierListParamsParser,
  SelfManagementIdentifierRoutes,
  UserApiPaths,
  userIdentifierPrivatePayloadSchema,
  userIdentifierSummaryPayloadSchema
} from '@mudrichenkoevgeny/shared-foundation'
import type { SelfManagementIdentifiersApi } from '@/network/api/identifier/self-management-identifiers-api'

/** {@link SelfManagementIdentifiersApi} implementation backed by {@link HttpClient}. */
export class FetchSelfManagementIdentifiersApi implements SelfManagementIdentifiersApi {
  /**
   * Constructs a new {@link FetchSelfManagementIdentifiersApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getUserIdentifier(
    userIdentifierId: UserIdentifierId
  ): Promise<AppResult<UserIdentifierPrivatePayload, AppError>> {
    const path = SelfManagementIdentifierRoutes.GET_IDENTIFIER.replace(
      `{${UserApiPaths.USER_IDENTIFIER_ID}}`,
      userIdentifierId
    )
    return callResult(async () => {
      const userIdentifierResponse = await this.client.request<unknown>(path)
      return userIdentifierPrivatePayloadSchema.parse(userIdentifierResponse)
    })
  }

  public async getUserIdentifiers(
    params?: SelfIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummaryPayload>, AppError>> {
    const queryMap = SelfIdentifierListParamsParser.toQueryMap(params)
    const path = appendQueryParamsToPath(
      SelfManagementIdentifierRoutes.GET_IDENTIFIERS,
      queryMap
    )
    return callResult(async () => {
      const userIdentifierListResponse = await this.client.request<unknown>(path)
      return pagedResultSchema(userIdentifierSummaryPayloadSchema).parse(userIdentifierListResponse)
    })
  }

  public async emailChangePassword(
    userIdentifierId: UserIdentifierId,
    request: EmailPasswordChangeRequest
  ): Promise<AppResult<void, AppError>> {
    const path = SelfManagementIdentifierRoutes.IDENTIFIER_EMAIL_CHANGE_PASSWORD.replace(
      `{${UserApiPaths.USER_IDENTIFIER_ID}}`,
      userIdentifierId
    )
    return callResult(() =>
      this.client.request<void>(path, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }
}
