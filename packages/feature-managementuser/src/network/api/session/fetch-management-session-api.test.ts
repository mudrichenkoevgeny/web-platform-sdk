import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementSessionApi } from '@/network/api/session/fetch-management-session-api'
import { ManagementSessionsRoutes, SortOrder, toUserIdOrThrow, toUserSessionIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { userSessionPayloadMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('FetchManagementSessionApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchManagementSessionApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchManagementSessionApi(mockHttpClient)
  })

  it('dispatches getSessions request with query params', async () => {
    const dummyPayload = { items: [], total_count: 0, page_number: 1, page_size: 10, total_pages: 0 } as any
    const expectedData = { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 }
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

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

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(ManagementSessionsRoutes.GET_SESSIONS)
    )
    expect(result).toEqual({ success: true, data: expectedData })
  })

  it('dispatches getSessions request using GET_USER_SESSIONS route when userId param is provided', async () => {
    const dummyPayload = { items: [], total_count: 0, page_number: 1, page_size: 10, total_pages: 0 } as any
    const expectedData = { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 }
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const params = {
      userId: toUserIdOrThrow('usr_1'),
      pageNumber: 1,
      pageSize: 10
    }
    const result = await api.getSessions(params)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('/management/users/usr_1/sessions')
    )
    expect(result).toEqual({ success: true, data: expectedData })
  })

  it('dispatches getSession request', async () => {
    const dummyPayload = userSessionPayloadMock({ id: toUserSessionIdOrThrow('sess_1') })
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getSession('sess_1')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('session_id=sess_1')
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches deleteSession request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow('usr_1')
    const result = await api.deleteSession(userId, 'sess_1')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('usr_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteAllUserSessions request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow('usr_1')
    const result = await api.deleteAllUserSessions(userId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('usr_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
