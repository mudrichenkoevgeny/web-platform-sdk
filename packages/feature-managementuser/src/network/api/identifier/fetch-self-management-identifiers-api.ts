import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  EmailPasswordChangeRequest,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserIdentifierId,
  UserIdentifierPayload,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import {
  ListingParamNames,
  SelfManagementIdentifierRoutes,
  UserApiPaths,
  UserFilterValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { SelfManagementIdentifiersApi } from '@/network/api/identifier/SelfManagementIdentifiersApi'

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
  ): Promise<AppResult<UserIdentifierPayload, AppError>> {
    const path = SelfManagementIdentifierRoutes.GET_IDENTIFIER.replace(
      `{${UserApiPaths.USER_IDENTIFIER_ID}}`,
      userIdentifierId
    )
    return callResult(() => this.client.request<UserIdentifierPayload>(path))
  }

  public async getUserIdentifiers(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserIdentifierSortBy | null,
    sortOrder?: SortOrder | null,
    userAuthProviders?: UserAuthProvider[] | null,
    identifiers?: string[] | null
  ): Promise<AppResult<PagedResult<UserIdentifierPayload>, AppError>> {
    const query = new URLSearchParams()
    if (pageNumber != null) query.append(ListingParamNames.PAGE_NUMBER, String(pageNumber))
    if (pageSize != null) query.append(ListingParamNames.PAGE_SIZE, String(pageSize))
    if (sortBy != null) query.append(ListingParamNames.SORT_BY, String(sortBy))
    if (sortOrder != null) query.append(ListingParamNames.SORT_ORDER, String(sortOrder))
    if (userAuthProviders) {
      userAuthProviders.forEach((provider) =>
        query.append(UserFilterValues.UserIdentifierFilterValues.USER_AUTH_PROVIDER, String(provider))
      )
    }
    if (identifiers) {
      identifiers.forEach((identifier) =>
        query.append(UserFilterValues.UserIdentifierFilterValues.IDENTIFIER, identifier)
      )
    }

    const queryString = query.toString()
    const path = queryString
      ? `${SelfManagementIdentifierRoutes.GET_IDENTIFIERS}?${queryString}`
      : SelfManagementIdentifierRoutes.GET_IDENTIFIERS

    return callResult(() => this.client.request<PagedResult<UserIdentifierPayload>>(path))
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
