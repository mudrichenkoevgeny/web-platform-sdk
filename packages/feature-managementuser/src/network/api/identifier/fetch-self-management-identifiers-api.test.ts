import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HttpClientMock, appendQueryParamsToPath } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementIdentifiersApi } from '@/network/api/identifier/fetch-self-management-identifiers-api'
import { createTestUserIdentifierPrivatePayload, SelfManagementIdentifierRoutes, SelfIdentifierListParamsParser, SortOrder, TEST_IDENTIFIER_ID, toUserIdentifierIdOrThrow, createTestPagedResultPayload, createTestPagedResult } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementIdentifiersApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchSelfManagementIdentifiersApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchSelfManagementIdentifiersApi(mockHttpClient)
  })

  it('dispatches getUserIdentifier request', async () => {
    const mockPayload = createTestUserIdentifierPrivatePayload({ id: toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const id = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const result = await api.getUserIdentifier(id)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementIdentifierRoutes.GET_IDENTIFIER.replace('{user_identifier_id}', TEST_IDENTIFIER_ID)
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches getUserIdentifiers request with query params', async () => {
    const mockPayload = createTestPagedResultPayload({ page_size: 10 })
    const expectedIdentifierListPagedResult = createTestPagedResult({ pageSize: 10 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const params = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      userAuthProviders: [],
      identifiers: []
    }
    const result = await api.getUserIdentifiers(params)

    const expectedUrl = appendQueryParamsToPath(
      SelfManagementIdentifierRoutes.GET_IDENTIFIERS,
      SelfIdentifierListParamsParser.toQueryMap(params)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(result).toEqual({ success: true, data: expectedIdentifierListPagedResult })
  })

  it('dispatches emailChangePassword request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const identifierId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const request = { old_password: 'old', new_password: 'new' }
    const result = await api.emailChangePassword(identifierId, request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementIdentifierRoutes.IDENTIFIER_EMAIL_CHANGE_PASSWORD.replace('{user_identifier_id}', TEST_IDENTIFIER_ID),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
