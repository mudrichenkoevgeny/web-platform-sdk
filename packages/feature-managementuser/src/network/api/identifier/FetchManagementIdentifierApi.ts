import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserId,
  UserIdentifierPayload,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import {
  ListingParamNames,
  ManagementIdentifierRoutes,
  UserApiPaths,
  UserFilterValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementIdentifierApi } from '@/network/api/identifier/ManagementIdentifierApi'

/** {@link ManagementIdentifierApi} implementation backed by {@link HttpClient}. */
export class FetchManagementIdentifierApi implements ManagementIdentifierApi {
  /**
   * Constructs a new {@link FetchManagementIdentifierApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getIdentifiers(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserIdentifierSortBy | null,
    sortOrder?: SortOrder | null,
    userIds?: string[] | null,
    userAuthProviders?: UserAuthProvider[] | null,
    identifiers?: string[] | null
  ): Promise<AppResult<PagedResult<UserIdentifierPayload>, AppError>> {
    const query = new URLSearchParams()
    if (pageNumber != null) query.append(ListingParamNames.PAGE_NUMBER, String(pageNumber))
    if (pageSize != null) query.append(ListingParamNames.PAGE_SIZE, String(pageSize))
    if (sortBy != null) query.append(ListingParamNames.SORT_BY, String(sortBy))
    if (sortOrder != null) query.append(ListingParamNames.SORT_ORDER, String(sortOrder))
    if (userIds) {
      userIds.forEach((id) => query.append(UserFilterValues.UserIdentifierFilterValues.USER_ID, id))
    }
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
      ? `${ManagementIdentifierRoutes.GET_IDENTIFIERS}?${queryString}`
      : ManagementIdentifierRoutes.GET_IDENTIFIERS

    return callResult(() => this.client.request<PagedResult<UserIdentifierPayload>>(path))
  }

  public async getIdentifier(identifierId: string): Promise<AppResult<UserIdentifierPayload, AppError>> {
    const query = new URLSearchParams({ [UserApiPaths.USER_IDENTIFIER_ID]: identifierId })
    const path = `${ManagementIdentifierRoutes.GET_IDENTIFIER}?${query.toString()}`
    return callResult(() => this.client.request<UserIdentifierPayload>(path))
  }

  public async deleteIdentifier(userId: UserId, identifierId: string): Promise<AppResult<void, AppError>> {
    const query = new URLSearchParams({
      [UserApiPaths.USER_ID]: userId,
      [UserApiPaths.USER_IDENTIFIER_ID]: identifierId
    })
    const path = `${ManagementIdentifierRoutes.DELETE_IDENTIFIER}?${query.toString()}`
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }

  public async deleteIdentifierPassword(userId: UserId, identifierId: string): Promise<AppResult<void, AppError>> {
    const query = new URLSearchParams({
      [UserApiPaths.USER_ID]: userId,
      [UserApiPaths.USER_IDENTIFIER_ID]: identifierId
    })
    const path = `${ManagementIdentifierRoutes.DELETE_IDENTIFIER_PASSWORD}?${query.toString()}`
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }
}
