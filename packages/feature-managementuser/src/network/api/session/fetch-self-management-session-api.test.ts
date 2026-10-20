import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HttpClientMock, appendQueryParamsToPath } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementSessionApi } from '@/network/api/session/fetch-self-management-session-api'
import { SelfManagementSessionRoutes, SelfSessionListParamsParser, TEST_SESSION_ID, TEST_USER_ID_2, toUserSessionIdOrThrow, createTestUserSessionPrivatePayload, createTestPagedResultPayload, createTestPagedResult } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementSessionApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchSelfManagementSessionApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchSelfManagementSessionApi(mockHttpClient)
  })

  it('dispatches getSessions request with query params', async () => {
    const mockPayload = createTestPagedResultPayload({ page_size: 10 })
    const expectedSessionListPagedResult = createTestPagedResult({ pageSize: 10 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const params = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: 'desc' as const,
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
      SelfManagementSessionRoutes.GET_SESSIONS,
      SelfSessionListParamsParser.toQueryMap(params)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(result).toEqual({ success: true, data: expectedSessionListPagedResult })
  })

  it('dispatches getSession request', async () => {
    const mockPayload = createTestUserSessionPrivatePayload({ id: toUserSessionIdOrThrow(TEST_SESSION_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const id = toUserSessionIdOrThrow(TEST_SESSION_ID)
    const result = await api.getSession(id)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementSessionRoutes.GET_SESSION.replace('{session_id}', TEST_SESSION_ID)
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches logout request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.logout()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementSessionRoutes.LOGOUT,
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteSession request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const id = toUserSessionIdOrThrow(TEST_SESSION_ID)
    const result = await api.deleteSession(id)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementSessionRoutes.DELETE_SESSION.replace('{session_id}', TEST_SESSION_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteAllOtherSessions request', async () => {
    const mockPayload = { deleted_session_ids: [TEST_USER_ID_2] }
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.deleteAllOtherSessions()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementSessionRoutes.DELETE_ALL_OTHER_SESSIONS,
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: { deletedSessionIds: [toUserSessionIdOrThrow(TEST_USER_ID_2)] } })
  })

  it('dispatches reauthenticateSession request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.reauthenticateSession('mfa123', '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementSessionRoutes.REAUTHENTICATE_SESSION,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ mfa_token: 'mfa123', totp_code: '123456' }) })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
