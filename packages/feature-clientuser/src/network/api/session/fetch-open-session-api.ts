import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ClientType,
  DeletedSessionsPayload,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserSessionId,
  UserSessionPayload,
  UserSortValues,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'
import {
  ListingParamNames,
  OpenSessionRoutes,
  pagedResultSchema,
  UserApiPaths,
  UserFilterValues,
  userSessionPayloadSchema
} from '@mudrichenkoevgeny/shared-foundation'
import { SessionApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/** Open {@link SessionApi} implementation backed by {@link HttpClient}. */
export class FetchOpenSessionApi implements SessionApi {
  /**
   * Constructs a new {@link FetchOpenSessionApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getSessions(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserSessionSortBy | null,
    sortOrder?: SortOrder | null,
    identifiers?: string[] | null,
    identifierIds?: string[] | null,
    userAuthProviders?: UserAuthProvider[] | null,
    clientTypes?: ClientType[] | null,
    userAgents?: string[] | null,
    ipAddresses?: string[] | null,
    languages?: string[] | null,
    deviceIds?: string[] | null,
    deviceNames?: string[] | null,
    appVersions?: string[] | null,
    operationSystemVersions?: string[] | null
  ): Promise<AppResult<PagedResult<UserSessionPayload>, AppError>> {
    const query = new URLSearchParams()
    if (pageNumber != null) {
      query.append(ListingParamNames.PAGE_NUMBER, String(pageNumber))
    }
    if (pageSize != null) {
      query.append(ListingParamNames.PAGE_SIZE, String(pageSize))
    }
    if (sortBy != null) {
      query.append(ListingParamNames.SORT_BY, String(sortBy))
    }
    if (sortOrder != null) {
      query.append(ListingParamNames.SORT_ORDER, String(sortOrder))
    }
    if (identifiers) {
      identifiers.forEach((identifier) =>
        query.append(UserFilterValues.UserSessionFilterValues.IDENTIFIER, identifier)
      )
    }
    if (identifierIds) {
      identifierIds.forEach((id) =>
        query.append(UserFilterValues.UserSessionFilterValues.IDENTIFIER_ID, id)
      )
    }
    if (userAuthProviders) {
      userAuthProviders.forEach((provider) =>
        query.append(UserFilterValues.UserSessionFilterValues.USER_AUTH_PROVIDER, String(provider))
      )
    }
    if (clientTypes) {
      clientTypes.forEach((type) =>
        query.append(UserFilterValues.UserSessionFilterValues.CLIENT_TYPE, String(type))
      )
    }
    if (userAgents) {
      userAgents.forEach((agent) =>
        query.append(UserFilterValues.UserSessionFilterValues.USER_AGENT, agent)
      )
    }
    if (ipAddresses) {
      ipAddresses.forEach((ip) =>
        query.append(UserFilterValues.UserSessionFilterValues.IP_ADDRESS, ip)
      )
    }
    if (languages) {
      languages.forEach((lang) =>
        query.append(UserFilterValues.UserSessionFilterValues.LANGUAGE, lang)
      )
    }
    if (deviceIds) {
      deviceIds.forEach((deviceId) =>
        query.append(UserFilterValues.UserSessionFilterValues.DEVICE_ID, deviceId)
      )
    }
    if (deviceNames) {
      deviceNames.forEach((name) =>
        query.append(UserFilterValues.UserSessionFilterValues.DEVICE_NAME, name)
      )
    }
    if (appVersions) {
      appVersions.forEach((version) =>
        query.append(UserFilterValues.UserSessionFilterValues.APP_VERSION, version)
      )
    }
    if (operationSystemVersions) {
      operationSystemVersions.forEach((osVersion) =>
        query.append(UserFilterValues.UserSessionFilterValues.OPERATION_SYSTEM_VERSION, osVersion)
      )
    }

    const queryString = query.toString()
    const path = queryString
      ? `${OpenSessionRoutes.GET_SESSIONS}?${queryString}`
      : OpenSessionRoutes.GET_SESSIONS

    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return pagedResultSchema(userSessionPayloadSchema).parse(raw)
    })
  }

  public async getSession(userSessionId: UserSessionId): Promise<AppResult<UserSessionPayload, AppError>> {
    const path = OpenSessionRoutes.GET_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, userSessionId)
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return userSessionPayloadSchema.parse(raw)
    })
  }

  public async logout(): Promise<AppResult<void, AppError>> {
    return callResult(() =>
      this.client.request<void>(OpenSessionRoutes.LOGOUT, { method: 'POST' })
    )
  }

  public async deleteSession(userSessionId: UserSessionId): Promise<AppResult<void, AppError>> {
    const path = OpenSessionRoutes.DELETE_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, userSessionId)
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }

  public async deleteAllOtherSessions(): Promise<AppResult<DeletedSessionsPayload, AppError>> {
    return callResult(() =>
      this.client.request<DeletedSessionsPayload>(OpenSessionRoutes.DELETE_ALL_OTHER_SESSIONS, {
        method: 'DELETE'
      })
    )
  }

  public async reauthenticateSession(request: VerifyTotpPayload): Promise<AppResult<void, AppError>> {
    return callResult(() =>
      this.client.request<void>(OpenSessionRoutes.REAUTHENTICATE_SESSION, {
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  }
}
