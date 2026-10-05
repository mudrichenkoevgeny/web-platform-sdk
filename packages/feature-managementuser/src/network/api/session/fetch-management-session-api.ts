import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ClientType,
  PagedResult,
  SortOrder,
  UserAuthProvider,
  UserId,
  UserRole,
  UserSessionPayload,
  UserSortValues
} from '@mudrichenkoevgeny/shared-foundation'
import {
  ListingParamNames,
  ManagementSessionRoutes,
  UserApiPaths,
  UserFilterValues
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSessionApi } from '@/network/api/session/management-session-api'

/** {@link ManagementSessionApi} implementation backed by {@link HttpClient}. */
export class FetchManagementSessionApi implements ManagementSessionApi {
  /**
   * Constructs a new {@link FetchManagementSessionApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getSessions(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: UserSortValues.UserSessionSortBy | null,
    sortOrder?: SortOrder | null,
    userIds?: string[] | null,
    userRoles?: UserRole[] | null,
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
    if (pageNumber != null) query.append(ListingParamNames.PAGE_NUMBER, String(pageNumber))
    if (pageSize != null) query.append(ListingParamNames.PAGE_SIZE, String(pageSize))
    if (sortBy != null) query.append(ListingParamNames.SORT_BY, String(sortBy))
    if (sortOrder != null) query.append(ListingParamNames.SORT_ORDER, String(sortOrder))
    if (userIds) {
      userIds.forEach((id) => query.append(UserFilterValues.UserSessionFilterValues.USER_ID, id))
    }
    if (userRoles) {
      userRoles.forEach((role) => query.append(UserFilterValues.UserSessionFilterValues.USER_ROLE, String(role)))
    }
    if (identifiers) {
      identifiers.forEach((identifier) => query.append(UserFilterValues.UserSessionFilterValues.IDENTIFIER, identifier))
    }
    if (identifierIds) {
      identifierIds.forEach((id) => query.append(UserFilterValues.UserSessionFilterValues.IDENTIFIER_ID, id))
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
      userAgents.forEach((agent) => query.append(UserFilterValues.UserSessionFilterValues.USER_AGENT, agent))
    }
    if (ipAddresses) {
      ipAddresses.forEach((ip) => query.append(UserFilterValues.UserSessionFilterValues.IP_ADDRESS, ip))
    }
    if (languages) {
      languages.forEach((lang) => query.append(UserFilterValues.UserSessionFilterValues.LANGUAGE, lang))
    }
    if (deviceIds) {
      deviceIds.forEach((deviceId) => query.append(UserFilterValues.UserSessionFilterValues.DEVICE_ID, deviceId))
    }
    if (deviceNames) {
      deviceNames.forEach((name) => query.append(UserFilterValues.UserSessionFilterValues.DEVICE_NAME, name))
    }
    if (appVersions) {
      appVersions.forEach((version) => query.append(UserFilterValues.UserSessionFilterValues.APP_VERSION, version))
    }
    if (operationSystemVersions) {
      operationSystemVersions.forEach((osVersion) =>
        query.append(UserFilterValues.UserSessionFilterValues.OPERATION_SYSTEM_VERSION, osVersion)
      )
    }

    const queryString = query.toString()
    const path = queryString
      ? `${ManagementSessionRoutes.GET_SESSIONS}?${queryString}`
      : ManagementSessionRoutes.GET_SESSIONS

    return callResult(() => this.client.request<PagedResult<UserSessionPayload>>(path))
  }

  public async getSession(sessionId: string): Promise<AppResult<UserSessionPayload, AppError>> {
    const query = new URLSearchParams({ [UserApiPaths.SESSION_ID]: sessionId })
    const path = `${ManagementSessionRoutes.GET_SESSION}?${query.toString()}`
    return callResult(() => this.client.request<UserSessionPayload>(path))
  }

  public async deleteSession(userId: UserId, sessionId: string): Promise<AppResult<void, AppError>> {
    const query = new URLSearchParams({
      [UserApiPaths.USER_ID]: userId,
      [UserApiPaths.SESSION_ID]: sessionId
    })
    const path = `${ManagementSessionRoutes.DELETE_SESSION}?${query.toString()}`
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }

  public async deleteAllUserSessions(userId: UserId): Promise<AppResult<void, AppError>> {
    const query = new URLSearchParams({ [UserApiPaths.USER_ID]: userId })
    const path = `${ManagementSessionRoutes.DELETE_ALL_USER_SESSIONS}?${query.toString()}`
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }
}
