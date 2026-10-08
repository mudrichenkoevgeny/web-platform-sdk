import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementIdentifierApi } from '@/network/api/identifier/fetch-management-identifier-api'
import { ManagementIdentifierRoutes, toUserIdOrThrow, toUserIdentifierIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { userIdentifierPayloadMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

describe('FetchManagementIdentifierApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchManagementIdentifierApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchManagementIdentifierApi(mockHttpClient)
  })

  it('dispatches getIdentifiers request with query params', async () => {
    const dummyPayload = { items: [], total_count: 0, page_number: 1, page_size: 10, total_pages: 0 } as any
    const expectedData = { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 }
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getIdentifiers(1, 10)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(ManagementIdentifierRoutes.GET_IDENTIFIERS)
    )
    expect(result).toEqual({ success: true, data: expectedData })
  })

  it('dispatches getIdentifier request', async () => {
    const dummyPayload = userIdentifierPayloadMock({ id: toUserIdentifierIdOrThrow('ident_1') })
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getIdentifier(toUserIdentifierIdOrThrow('ident_1'))

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('user_identifier_id=ident_1')
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches deleteIdentifier request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow('usr_1')
    const result = await api.deleteIdentifier(userId, toUserIdentifierIdOrThrow('ident_1'))

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('usr_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteIdentifierPassword request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow('usr_1')
    const result = await api.deleteIdentifierPassword(userId, toUserIdentifierIdOrThrow('ident_1'))

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('usr_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
