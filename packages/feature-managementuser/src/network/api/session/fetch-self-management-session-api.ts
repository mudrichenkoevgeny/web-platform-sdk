import { appendQueryParamsToPath, callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ClientType,
  DeletedSessions,
  PagedResult,
  SelfSessionListParams,
  SortOrder,
  UserAuthProvider,
  UserSessionId,
  UserSessionPrivatePayload,
  UserSessionSummaryPayload,
  UserSortValues,
  VerifyTotpPayload
} from '@mudrichenkoevgeny/shared-foundation'
import {
  deletedSessionsPayloadSchema,
  ListingParamNames,
  pagedResultSchema,
  SelfManagementSessionRoutes,
  toDeletedSessions,
  UserApiPaths,
  UserFilterValues,
  userSessionPrivatePayloadSchema,
  userSessionSummaryPayloadSchema
} from '@mudrichenkoevgeny/shared-foundation'
import type { SessionApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

function extractEnumValue(val: unknown): string {
  if (typeof val === 'object' && val !== null && 'value' in val) {
    const rawVal = (val as { value: unknown }).value
    if (typeof rawVal === 'string') {
      return rawVal
    }
  }
  return String(val)
}

/** Self-management {@link SessionApi} implementation backed by {@link HttpClient}. */
export class FetchSelfManagementSessionApi implements SessionApi {
  /**
   * Constructs a new {@link FetchSelfManagementSessionApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getSessions(
    params?: SelfSessionListParams | number | null,
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
  ): Promise<AppResult<PagedResult<UserSessionSummaryPayload>, AppError>> {
    if (typeof params === 'object' && params !== null && ('toQueryMap' in params || 'pageNumber' in params)) {
      const path = appendQueryParamsToPath(
        SelfManagementSessionRoutes.GET_SESSIONS,
        params as SelfSessionListParams
      )
      return callResult(async () => {
        const raw = await this.client.request<unknown>(path)
        return pagedResultSchema(userSessionSummaryPayloadSchema).parse(raw)
      })
    }

    const query = new URLSearchParams()
    const pageNumber = typeof params === 'number' ? params : null
    if (pageNumber != null) query.append(ListingParamNames.PAGE_NUMBER, String(pageNumber))
    if (pageSize != null) query.append(ListingParamNames.PAGE_SIZE, String(pageSize))
    if (sortBy != null) query.append(ListingParamNames.SORT_BY, extractEnumValue(sortBy))
    if (sortOrder != null) query.append(ListingParamNames.SORT_ORDER, extractEnumValue(sortOrder))
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
        query.append(UserFilterValues.UserSessionFilterValues.USER_AUTH_PROVIDER, extractEnumValue(provider))
      )
    }
    if (clientTypes) {
      clientTypes.forEach((type) =>
        query.append(UserFilterValues.UserSessionFilterValues.CLIENT_TYPE, extractEnumValue(type))
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
      ? `${SelfManagementSessionRoutes.GET_SESSIONS}?${queryString}`
      : SelfManagementSessionRoutes.GET_SESSIONS

    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return pagedResultSchema(userSessionSummaryPayloadSchema).parse(raw)
    })
  }

  public async getSession(userSessionId: UserSessionId): Promise<AppResult<UserSessionPrivatePayload, AppError>> {
    const path = SelfManagementSessionRoutes.GET_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, userSessionId)
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return userSessionPrivatePayloadSchema.parse(raw)
    })
  }

  public async logout(): Promise<AppResult<void, AppError>> {
    return callResult(() =>
      this.client.request<void>(SelfManagementSessionRoutes.LOGOUT, { method: 'POST' })
    )
  }

  public async deleteSession(userSessionId: UserSessionId): Promise<AppResult<void, AppError>> {
    const path = SelfManagementSessionRoutes.DELETE_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, userSessionId)
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }

  public async deleteAllOtherSessions(): Promise<AppResult<DeletedSessions, AppError>> {
    return callResult(async () => {
      const raw = await this.client.request<unknown>(SelfManagementSessionRoutes.DELETE_ALL_OTHER_SESSIONS, {
        method: 'DELETE'
      })
      const payload = deletedSessionsPayloadSchema.parse(raw)
      return toDeletedSessions(payload)
    })
  }

  public async reauthenticateSession(mfaToken: string, code: string): Promise<AppResult<void, AppError>> {
    const payload: VerifyTotpPayload = {
      mfa_token: mfaToken,
      totp_code: code
    }
    return callResult(() =>
      this.client.request<void>(SelfManagementSessionRoutes.REAUTHENTICATE_SESSION, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
    )
  }
}

