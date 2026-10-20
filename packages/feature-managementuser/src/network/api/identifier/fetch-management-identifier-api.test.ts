import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HttpClientMock, appendQueryParamsToPath } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementIdentifierApi } from '@/network/api/identifier/fetch-management-identifier-api'
import { ManagementIdentifiersRoutes, ManagementGlobalIdentifierListParamsParser, ManagementUserIdentifierListParamsParser, UserApiPaths, SortOrder, TEST_IDENTIFIER_ID, TEST_USER_ID, toUserIdOrThrow, toUserIdentifierIdOrThrow, createTestUserIdentifierPrivatePayload, createTestPagedResultPayload, createTestPagedResult } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementIdentifierApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementIdentifierApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementIdentifierApi(mockHttpClient)
  })

  it('dispatches getIdentifiers request with query params', async () => {
    const mockPayload = createTestPagedResultPayload({ page_size: 10 })
    const expectedIdentifierListPagedResult = createTestPagedResult({ pageSize: 10 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

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

    const expectedUrl = appendQueryParamsToPath(
      ManagementIdentifiersRoutes.GET_IDENTIFIERS,
      ManagementGlobalIdentifierListParamsParser.toQueryMap(params)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(result).toEqual({ success: true, data: expectedIdentifierListPagedResult })
  })

  it('dispatches getIdentifiers request using GET_USER_IDENTIFIERS route when userId param is provided', async () => {
    const mockPayload = createTestPagedResultPayload({ page_size: 10 })
    const expectedIdentifierListPagedResult = createTestPagedResult({ pageSize: 10 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const params = {
      userId: toUserIdOrThrow(TEST_USER_ID),
      pageNumber: 1,
      pageSize: 10
    }
    const result = await api.getIdentifiers(params)

    const expectedUrl = appendQueryParamsToPath(
      ManagementIdentifiersRoutes.GET_USER_IDENTIFIERS.replace(`{${UserApiPaths.USER_ID}}`, TEST_USER_ID),
      ManagementUserIdentifierListParamsParser.toQueryMap(params)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(result).toEqual({ success: true, data: expectedIdentifierListPagedResult })
  })

  it('dispatches getIdentifier request', async () => {
    const mockPayload = createTestUserIdentifierPrivatePayload({ id: toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.getIdentifier(toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID))

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementIdentifiersRoutes.GET_IDENTIFIER.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, TEST_IDENTIFIER_ID)
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches deleteIdentifier request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const result = await api.deleteIdentifier(userId, toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID))

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementIdentifiersRoutes.DELETE_IDENTIFIER.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, TEST_IDENTIFIER_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches deleteIdentifierPassword request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const result = await api.deleteIdentifierPassword(userId, toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID))

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementIdentifiersRoutes.DELETE_IDENTIFIER_PASSWORD.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, TEST_IDENTIFIER_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
