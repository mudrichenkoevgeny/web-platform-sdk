import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock, appendQueryParamsToPath } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenSessionApi } from '@/network/api/session/fetch-open-session-api'
import {
  OpenSessionRoutes,
  SelfSessionListParamsParser,
  selfSessionListParamsSchema,
  SortOrder,
  TEST_SESSION_ID,
  TEST_USER_ID_2,
  toUserSessionIdOrThrow,
  createTestUserSessionPrivatePayload,
  createTestPagedResult,
  createTestPagedResultPayload
} from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenSessionApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenSessionApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenSessionApi(mockHttpClient)
  })

  it('dispatches getSessions request with query params', async () => {
    const sessionsPagedPayload = createTestPagedResultPayload({
      items: [],
      total_count: 0,
      page_number: 1,
      page_size: 10,
      total_pages: 0
    })
    const expectedSessionsPagedResult = createTestPagedResult({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(sessionsPagedPayload)

    const params = selfSessionListParamsSchema.parse({
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at',
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
    })
    const sessionsResult = await api.getSessions(params)

    const expectedUrl = appendQueryParamsToPath(
      OpenSessionRoutes.GET_SESSIONS,
      SelfSessionListParamsParser.toQueryMap(params)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(sessionsResult).toEqual({ success: true, data: expectedSessionsPagedResult })
  })

  it('dispatches getSession request', async () => {
    const sessionPayload = createTestUserSessionPrivatePayload({ id: toUserSessionIdOrThrow(TEST_SESSION_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(sessionPayload)

    const sessionId = toUserSessionIdOrThrow(TEST_SESSION_ID)
    const sessionResult = await api.getSession(sessionId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.GET_SESSION.replace('{session_id}', TEST_SESSION_ID)
    )
    expect(sessionResult).toEqual({ success: true, data: sessionPayload })
  })

  it('dispatches logout request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const logoutResult = await api.logout()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.LOGOUT,
      expect.objectContaining({ method: 'POST' })
    )
    expect(logoutResult).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteSession request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const sessionId = toUserSessionIdOrThrow(TEST_SESSION_ID)
    const deleteSessionResult = await api.deleteSession(sessionId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.DELETE_SESSION.replace('{session_id}', TEST_SESSION_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(deleteSessionResult).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteAllOtherSessions request', async () => {
    const deletedSessionsPayload = { deleted_session_ids: [TEST_USER_ID_2] }
    vi.mocked(mockHttpClient.request).mockResolvedValue(deletedSessionsPayload)

    const deleteAllOtherSessionsResult = await api.deleteAllOtherSessions()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.DELETE_ALL_OTHER_SESSIONS,
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(deleteAllOtherSessionsResult).toEqual({ success: true, data: { deletedSessionIds: [toUserSessionIdOrThrow(TEST_USER_ID_2)] } })
  })

  it('dispatches reauthenticateSession request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const reauthenticateResult = await api.reauthenticateSession('mfa123', '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.REAUTHENTICATE_SESSION,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ mfa_token: 'mfa123', totp_code: '123456' }) })
    )
    expect(reauthenticateResult).toEqual({ success: true, data: undefined })
  })
})
