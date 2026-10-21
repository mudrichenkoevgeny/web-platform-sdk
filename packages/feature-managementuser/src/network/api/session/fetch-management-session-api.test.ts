import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HttpClientMock, appendQueryParamsToPath } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
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
  createTestPagedResultPayload
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
    const sessionListResult = await api.getSessions(managementSessionListParams)

    const expectedUrl = appendQueryParamsToPath(
      ManagementSessionsRoutes.GET_SESSIONS,
      ManagementGlobalSessionListParamsParser.toQueryMap(managementSessionListParams)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(sessionListResult).toEqual({ success: true, data: expectedSessionListPagedResult })
  })

  it('dispatches getSessions request using GET_USER_SESSIONS route when userId param is provided', async () => {
    const expectedSessionListPagedResult = createTestPagedResult({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(sessionPagedPayload)

    const managementUserSessionListParams = {
      userId: toUserIdOrThrow(TEST_USER_ID),
      pageNumber: 1,
      pageSize: 10
    }
    const sessionListResult = await api.getSessions(managementUserSessionListParams)

    const expectedUrl = appendQueryParamsToPath(
      ManagementSessionsRoutes.GET_USER_SESSIONS.replace(`{${UserApiPaths.USER_ID}}`, TEST_USER_ID),
      ManagementUserSessionListParamsParser.toQueryMap(managementUserSessionListParams)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(sessionListResult).toEqual({ success: true, data: expectedSessionListPagedResult })
  })

  it('dispatches getSession request', async () => {
    const mockSessionPayload = createTestUserSessionPrivatePayload({ id: toUserSessionIdOrThrow(TEST_SESSION_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSessionPayload)

    const sessionResult = await api.getSession(TEST_SESSION_ID)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSessionsRoutes.GET_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, TEST_SESSION_ID)
    )
    expect(sessionResult).toEqual({ success: true, data: mockSessionPayload })
  })

  it('dispatches deleteSession request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const deleteSessionResult = await api.deleteSession(userId, TEST_SESSION_ID)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSessionsRoutes.DELETE_SESSION.replace(`{${UserApiPaths.SESSION_ID}}`, TEST_SESSION_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(deleteSessionResult).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteAllUserSessions request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const deleteAllSessionsResult = await api.deleteAllUserSessions(userId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSessionsRoutes.DELETE_ALL_USER_SESSIONS.replace(`{${UserApiPaths.USER_ID}}`, TEST_USER_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(deleteAllSessionsResult).toEqual({ success: true, data: undefined })
  })
})
