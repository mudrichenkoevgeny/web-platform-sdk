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
  createTestPagedResult
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
    const mockPagedResultPayload = createTestPagedResult({
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 0
    })
    const expectedData = createTestPagedResult({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPagedResultPayload)

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
    const result = await api.getSessions(params)

    const expectedUrl = appendQueryParamsToPath(
      OpenSessionRoutes.GET_SESSIONS,
      SelfSessionListParamsParser.toQueryMap(params)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(result).toEqual({ success: true, data: expectedData })
  })

  it('dispatches getSession request', async () => {
    const mockSessionPayload = createTestUserSessionPrivatePayload({ id: toUserSessionIdOrThrow(TEST_SESSION_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSessionPayload)

    const id = toUserSessionIdOrThrow(TEST_SESSION_ID)
    const result = await api.getSession(id)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.GET_SESSION.replace('{session_id}', TEST_SESSION_ID)
    )
    expect(result).toEqual({ success: true, data: mockSessionPayload })
  })

  it('dispatches logout request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.logout()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.LOGOUT,
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteSession request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const id = toUserSessionIdOrThrow(TEST_SESSION_ID)
    const result = await api.deleteSession(id)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.DELETE_SESSION.replace('{session_id}', TEST_SESSION_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteAllOtherSessions request', async () => {
    const mockDeletedSessionsPayload = { deleted_session_ids: [TEST_USER_ID_2] }
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockDeletedSessionsPayload)

    const result = await api.deleteAllOtherSessions()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.DELETE_ALL_OTHER_SESSIONS,
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: { deletedSessionIds: [toUserSessionIdOrThrow(TEST_USER_ID_2)] } })
  })

  it('dispatches reauthenticateSession request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.reauthenticateSession('mfa123', '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.REAUTHENTICATE_SESSION,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ mfa_token: 'mfa123', totp_code: '123456' }) })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
