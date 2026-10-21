import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HttpClientMock, appendQueryParamsToPath } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementSessionApi } from '@/network/api/session/fetch-self-management-session-api'
import {
  SelfManagementSessionRoutes,
  SelfSessionListParamsParser,
  SortOrder,
  TEST_SESSION_ID,
  TEST_USER_ID_2,
  toUserSessionIdOrThrow,
  createTestUserSessionPrivatePayload,
  createTestPagedResult,
  createTestPagedResultPayload
} from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementSessionApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchSelfManagementSessionApi

  const sessionListPayload = createTestPagedResultPayload({
    items: [],
    total_count: 0,
    page_number: 1,
    page_size: 10,
    total_pages: 0
  })

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchSelfManagementSessionApi(mockHttpClient)
  })

  it('dispatches getSessions request with query params', async () => {
    const expectedSessionListPagedResult = createTestPagedResult({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(sessionListPayload)

    const selfSessionListParams = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
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
    const selfSessionListResult = await api.getSessions(selfSessionListParams)

    const expectedUrl = appendQueryParamsToPath(
      SelfManagementSessionRoutes.GET_SESSIONS,
      SelfSessionListParamsParser.toQueryMap(selfSessionListParams)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(selfSessionListResult).toEqual({ success: true, data: expectedSessionListPagedResult })
  })

  it('dispatches getSession request', async () => {
    const mockSessionPayload = createTestUserSessionPrivatePayload({ id: toUserSessionIdOrThrow(TEST_SESSION_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSessionPayload)

    const sessionId = toUserSessionIdOrThrow(TEST_SESSION_ID)
    const sessionResult = await api.getSession(sessionId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementSessionRoutes.GET_SESSION.replace('{session_id}', TEST_SESSION_ID)
    )
    expect(sessionResult).toEqual({ success: true, data: mockSessionPayload })
  })

  it('dispatches logout request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const logoutResult = await api.logout()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementSessionRoutes.LOGOUT,
      expect.objectContaining({ method: 'POST' })
    )
    expect(logoutResult).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteSession request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const sessionId = toUserSessionIdOrThrow(TEST_SESSION_ID)
    const deleteSessionResult = await api.deleteSession(sessionId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementSessionRoutes.DELETE_SESSION.replace('{session_id}', TEST_SESSION_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(deleteSessionResult).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteAllOtherSessions request', async () => {
    const mockDeletedSessionsPayload = { deleted_session_ids: [TEST_USER_ID_2] }
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockDeletedSessionsPayload)

    const deleteAllOtherSessionsResult = await api.deleteAllOtherSessions()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementSessionRoutes.DELETE_ALL_OTHER_SESSIONS,
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(deleteAllOtherSessionsResult).toEqual({ success: true, data: { deletedSessionIds: [toUserSessionIdOrThrow(TEST_USER_ID_2)] } })
  })

  it('dispatches reauthenticateSession request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const reauthenticateResult = await api.reauthenticateSession('mfa123', '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementSessionRoutes.REAUTHENTICATE_SESSION,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ mfa_token: 'mfa123', totp_code: '123456' }) })
    )
    expect(reauthenticateResult).toEqual({ success: true, data: undefined })
  })
})
