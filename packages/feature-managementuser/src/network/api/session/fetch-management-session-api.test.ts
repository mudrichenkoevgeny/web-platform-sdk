import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ApiException, HttpClientMock, appendQueryParamsToPath, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementSessionApi } from '@/network/api/session/fetch-management-session-api'
import {
  ManagementSessionsRoutes,
  ManagementGlobalSessionListParamsParser,
  ManagementUserSessionListParamsParser,
  UserApiPaths,
  SortOrder,
  TEST_SESSION_ID,
  TEST_USER_ID,
  toUserIdOrThrow,
  toUserSessionIdOrThrow,
  createTestUserSessionPrivatePayload,
  createTestPagedResult,
  createTestPagedResultPayload,
  createTestApiErrorResponse
} from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementSessionApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementSessionApi

  const sessionPagedPayload = createTestPagedResultPayload({
    items: [],
    total_count: 0,
    page_number: 1,
    page_size: 10,
    total_pages: 0
  })

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementSessionApi(mockHttpClient)
  })

  it('dispatches getSessions request with query params', async () => {
    const expectedSessionListPagedResult = createTestPagedResult({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(sessionPagedPayload)

    const managementSessionListParams = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      userIds: [],
      userRoles: [],
      identifiers: [],
      identifierIds: [],
      userAuthProviders: [],
      clientTypes: [],
      userAgents: [],
      ipAddresses: [],
      languages: [],
      deviceIds: [],
      deviceNames: [],
      appVersions: [],
      osVersions: []
    }
    const result = await api.getSessions(managementSessionListParams)

    const expectedUrl = appendQueryParamsToPath(
      ManagementSessionsRoutes.GET_SESSIONS,
      ManagementGlobalSessionListParamsParser.toQueryMap(managementSessionListParams)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(result).toEqual({ success: true, data: expectedSessionListPagedResult })
  })

  it('dispatches getSessions request using GET_USER_SESSIONS route when userId param is provided', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(sessionPagedPayload)

    const managementUserSessionListParams = {
      userId: toUserIdOrThrow(TEST_USER_ID),
      pageNumber: 1,
      pageSize: 10
    }
    const result = await api.getSessions(managementUserSessionListParams)

    const expectedUrl = appendQueryParamsToPath(
      ManagementSessionsRoutes.GET_USER_SESSIONS.replace(`{${UserApiPaths.USER_ID}}`, TEST_USER_ID),
      ManagementUserSessionListParamsParser.toQueryMap(managementUserSessionListParams)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches getSession request', async () => {
    const mockSessionPayload = createTestUserSessionPrivatePayload({ id: toUserSessionIdOrThrow(TEST_SESSION_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSessionPayload)

    const result = await api.getSession(TEST_SESSION_ID)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSessionsRoutes.GET_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, TEST_SESSION_ID)
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches deleteSession request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const result = await api.deleteSession(userId, TEST_SESSION_ID)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSessionsRoutes.DELETE_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, TEST_SESSION_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches deleteAllUserSessions request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const result = await api.deleteAllUserSessions(userId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSessionsRoutes.DELETE_ALL_USER_SESSIONS.replace(`{${UserApiPaths.USER_ID}}`, TEST_USER_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'SESSION_NOT_FOUND', message: 'Not found' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.getSession(TEST_SESSION_ID)

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('SESSION_NOT_FOUND')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.getSession(TEST_SESSION_ID)

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
