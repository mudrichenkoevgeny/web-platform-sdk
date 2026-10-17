import { describe, it, expect, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementIdentifierApi } from '@/network/api/identifier/fetch-management-identifier-api'
import { ManagementIdentifiersRoutes, SortOrder, toUserIdOrThrow, toUserIdentifierIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { userIdentifierPayloadMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { pagedResultPayloadMock } from '@/mock'

describe('FetchManagementIdentifierApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementIdentifierApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    mockHttpClient.request = vi.fn() as any
    api = new FetchManagementIdentifierApi(mockHttpClient)
  })

  it('dispatches getIdentifiers request with query params', async () => {
    const mockPayload = pagedResultPayloadMock()
    const expectedIdentifierListPagedResult = { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 }
    mockHttpClient.request.mockResolvedValue(mockPayload)

    const params = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      userIds: [],
      userAuthProviders: [],
      identifiers: []
    }
    const result = await api.getIdentifiers(params)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(ManagementIdentifiersRoutes.GET_IDENTIFIERS)
    )
    expect(result).toEqual({ success: true, data: expectedIdentifierListPagedResult })
  })

  it('dispatches getIdentifiers request using GET_USER_IDENTIFIERS route when userId param is provided', async () => {
    const mockPayload = pagedResultPayloadMock()
    const expectedIdentifierListPagedResult = { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 }
    mockHttpClient.request.mockResolvedValue(mockPayload)

    const params = {
      userId: toUserIdOrThrow('usr_1'),
      pageNumber: 1,
      pageSize: 10
    }
    const result = await api.getIdentifiers(params)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('/management/users/usr_1/identifiers')
    )
    expect(result).toEqual({ success: true, data: expectedIdentifierListPagedResult })
  })

  it('dispatches getIdentifier request', async () => {
    const mockPayload = userIdentifierPayloadMock({ id: toUserIdentifierIdOrThrow('ident_1') })
    mockHttpClient.request.mockResolvedValue(mockPayload)

    const result = await api.getIdentifier(toUserIdentifierIdOrThrow('ident_1'))

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('/management/identifiers/ident_1')
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches deleteIdentifier request', async () => {
    mockHttpClient.request.mockResolvedValue(undefined)

    const userId = toUserIdOrThrow('usr_1')
    const result = await api.deleteIdentifier(userId, toUserIdentifierIdOrThrow('ident_1'))

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('/management/identifiers/ident_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteIdentifierPassword request', async () => {
    mockHttpClient.request.mockResolvedValue(undefined)

    const userId = toUserIdOrThrow('usr_1')
    const result = await api.deleteIdentifierPassword(userId, toUserIdentifierIdOrThrow('ident_1'))

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('/management/identifiers/ident_1/password'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
