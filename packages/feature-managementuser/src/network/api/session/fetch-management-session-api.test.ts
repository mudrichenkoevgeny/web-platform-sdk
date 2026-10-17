import { describe, it, expect, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementSessionApi } from '@/network/api/session/fetch-management-session-api'
import { ManagementSessionsRoutes, SortOrder, toUserIdOrThrow, toUserSessionIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { userSessionPayloadMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { pagedResultPayloadMock } from '@/mock'

describe('FetchManagementSessionApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementSessionApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    mockHttpClient.request = vi.fn() as any
    api = new FetchManagementSessionApi(mockHttpClient)
  })

  it('dispatches getSessions request with query params', async () => {
    const mockPayload = pagedResultPayloadMock()
    const expectedSessionListPagedResult = { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 }
    mockHttpClient.request.mockResolvedValue(mockPayload)

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
    expect(result).toEqual({ success: true, data: expectedSessionListPagedResult })
  })

  it('dispatches getSessions request using GET_USER_SESSIONS route when userId param is provided', async () => {
    const mockPayload = pagedResultPayloadMock()
    const expectedSessionListPagedResult = { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 }
    mockHttpClient.request.mockResolvedValue(mockPayload)

    const params = {
      userId: toUserIdOrThrow('usr_1'),
      pageNumber: 1,
      pageSize: 10
    }
    const result = await api.getSessions(params)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('/management/users/usr_1/sessions')
    )
    expect(result).toEqual({ success: true, data: expectedSessionListPagedResult })
  })

  it('dispatches getSession request', async () => {
    const mockPayload = userSessionPayloadMock({ id: toUserSessionIdOrThrow('sess_1') })
    mockHttpClient.request.mockResolvedValue(mockPayload)

    const result = await api.getSession('sess_1')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('/management/sessions/sess_1')
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches deleteSession request', async () => {
    mockHttpClient.request.mockResolvedValue(undefined)

    const userId = toUserIdOrThrow('usr_1')
    const result = await api.deleteSession(userId, 'sess_1')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('/management/sessions/sess_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteAllUserSessions request', async () => {
    mockHttpClient.request.mockResolvedValue(undefined)

    const userId = toUserIdOrThrow('usr_1')
    const result = await api.deleteAllUserSessions(userId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('usr_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
