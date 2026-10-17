import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementSessionApi } from '@/network/api/session/fetch-self-management-session-api'
import { SelfManagementSessionRoutes, toUserSessionIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { userSessionPayloadMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { pagedResultPayloadMock } from '@/mock'

describe('FetchSelfManagementSessionApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchSelfManagementSessionApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchSelfManagementSessionApi(mockHttpClient)
  })

  it('dispatches getSessions request with query params', async () => {
    const mockPayload = pagedResultPayloadMock()
    const expectedSessionListPagedResult = { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 }
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.getSessions(1, 10)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(SelfManagementSessionRoutes.GET_SESSIONS)
    )
    expect(result).toEqual({ success: true, data: expectedSessionListPagedResult })
  })

  it('dispatches getSession request', async () => {
    const mockPayload = userSessionPayloadMock({ id: toUserSessionIdOrThrow('sess_1') })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const id = toUserSessionIdOrThrow('sess_1')
    const result = await api.getSession(id)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementSessionRoutes.GET_SESSION.replace('{session_id}', 'sess_1')
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

    const id = toUserSessionIdOrThrow('sess_1')
    const result = await api.deleteSession(id)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementSessionRoutes.DELETE_SESSION.replace('{session_id}', 'sess_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteAllOtherSessions request', async () => {
    const mockPayload = { deleted_session_ids: ['sess_2'] }
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.deleteAllOtherSessions()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementSessionRoutes.DELETE_ALL_OTHER_SESSIONS,
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: { deletedSessionIds: [toUserSessionIdOrThrow('sess_2')] } })
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
