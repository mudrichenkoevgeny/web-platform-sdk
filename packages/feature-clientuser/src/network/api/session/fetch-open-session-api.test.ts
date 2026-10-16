import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenSessionApi } from '@/network/api/session/fetch-open-session-api'
import { OpenSessionRoutes, selfSessionListParamsSchema, SortOrder, toUserSessionIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
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

    const result = await api.getSessions(
      selfSessionListParamsSchema.parse({
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
    )

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
    const dummyPayload = { deleted_session_ids: ['sess_2'] }
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

    const result = await api.reauthenticateSession('mfa123', '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.REAUTHENTICATE_SESSION,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ mfa_token: 'mfa123', totp_code: '123456' }) })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
