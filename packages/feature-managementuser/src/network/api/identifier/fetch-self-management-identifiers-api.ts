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
  SelfManagementIdentifierRoutes,
  UserApiPaths,
  pagedResultSchema,
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
      const raw = await this.client.request<unknown>(path)
      return userIdentifierPrivatePayloadSchema.parse(raw)
    })
  }

  public async getUserIdentifiers(
    params?: SelfIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummaryPayload>, AppError>> {
    const path = appendQueryParamsToPath(
      SelfManagementIdentifierRoutes.GET_IDENTIFIERS,
      params
    )
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return pagedResultSchema(userIdentifierSummaryPayloadSchema).parse(raw)
    })
  }

  public async emailChangePassword(request: EmailPasswordChangeRequest): Promise<AppResult<void, AppError>> {
    return callResult(() =>
      this.client.request<void>(SelfManagementIdentifierRoutes.IDENTIFIER_EMAIL_CHANGE_PASSWORD, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }
}
