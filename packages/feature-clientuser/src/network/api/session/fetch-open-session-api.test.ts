import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenSessionApi } from '@/network/api/session/fetch-open-session-api'
import { OpenSessionRoutes, toUserSessionIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { userSessionPayloadMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('FetchOpenSessionApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchOpenSessionApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchOpenSessionApi(mockHttpClient)
  })

  it('dispatches getSessions request with query params', async () => {
    const dummyPayload = { items: [], total_count: 0, page_number: 1, page_size: 10, total_pages: 0 } as any
    const expectedData = { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 }
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getSessions(1, 10)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(OpenSessionRoutes.GET_SESSIONS)
    )
    expect(result).toEqual({ success: true, data: expectedData })
  })

  it('dispatches getSession request', async () => {
    const dummyPayload = userSessionPayloadMock({ id: toUserSessionIdOrThrow('sess_1') })
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const id = toUserSessionIdOrThrow('sess_1')
    const result = await api.getSession(id)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.GET_SESSION.replace('{session_id}', 'sess_1')
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
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

    const id = toUserSessionIdOrThrow('sess_1')
    const result = await api.deleteSession(id)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.DELETE_SESSION.replace('{session_id}', 'sess_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteAllOtherSessions request', async () => {
    const dummyPayload = { deletedCount: 2 } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.deleteAllOtherSessions()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.DELETE_ALL_OTHER_SESSIONS,
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches reauthenticateSession request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const request = { mfa_token: 'mfa123', totp_code: '123456' }
    const result = await api.reauthenticateSession(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.REAUTHENTICATE_SESSION,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
