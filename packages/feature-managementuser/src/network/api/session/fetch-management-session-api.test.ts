import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementSessionApi } from '@/network/api/session/fetch-management-session-api'
import { ManagementSessionRoutes, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

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

    const result = await api.getSessions(1, 10)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(ManagementSessionRoutes.GET_SESSIONS)
    )
    expect(result).toEqual({ success: true, data: expectedData })
  })

  it('dispatches getSession request', async () => {
    const dummyPayload = { id: 'sess_1' } as any
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
