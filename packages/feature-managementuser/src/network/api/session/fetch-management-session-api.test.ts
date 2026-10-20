import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HttpClientMock, appendQueryParamsToPath } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementSessionApi } from '@/network/api/session/fetch-management-session-api'
import { ManagementSessionsRoutes, ManagementGlobalSessionListParamsParser, ManagementUserSessionListParamsParser, UserApiPaths, SortOrder, TEST_SESSION_ID, TEST_USER_ID, toUserIdOrThrow, toUserSessionIdOrThrow, createTestUserSessionPrivatePayload, createTestPagedResultPayload, createTestPagedResult } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementSessionApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementSessionApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementSessionApi(mockHttpClient)
  })

  it('dispatches getSessions request with query params', async () => {
    const mockPayload = createTestPagedResultPayload({ page_size: 10 })
    const expectedSessionListPagedResult = createTestPagedResult({ pageSize: 10 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const params = {
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
    const result = await api.getSessions(params)

    const expectedUrl = appendQueryParamsToPath(
      ManagementSessionsRoutes.GET_SESSIONS,
      ManagementGlobalSessionListParamsParser.toQueryMap(params)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(result).toEqual({ success: true, data: expectedSessionListPagedResult })
  })

  it('dispatches getSessions request using GET_USER_SESSIONS route when userId param is provided', async () => {
    const mockPayload = createTestPagedResultPayload({ page_size: 10 })
    const expectedSessionListPagedResult = createTestPagedResult({ pageSize: 10 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const params = {
      userId: toUserIdOrThrow(TEST_USER_ID),
      pageNumber: 1,
      pageSize: 10
    }
    const result = await api.getSessions(params)

    const expectedUrl = appendQueryParamsToPath(
      ManagementSessionsRoutes.GET_USER_SESSIONS.replace(`{${UserApiPaths.USER_ID}}`, TEST_USER_ID),
      ManagementUserSessionListParamsParser.toQueryMap(params)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(result).toEqual({ success: true, data: expectedSessionListPagedResult })
  })

  it('dispatches getSession request', async () => {
    const mockPayload = createTestUserSessionPrivatePayload({ id: toUserSessionIdOrThrow(TEST_SESSION_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.getSession(TEST_SESSION_ID)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSessionsRoutes.GET_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, TEST_SESSION_ID)
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches deleteSession request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const result = await api.deleteSession(userId, TEST_SESSION_ID)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSessionsRoutes.DELETE_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, TEST_SESSION_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteAllUserSessions request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const result = await api.deleteAllUserSessions(userId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSessionsRoutes.DELETE_ALL_USER_SESSIONS.replace(`{${UserApiPaths.USER_ID}}`, TEST_USER_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
