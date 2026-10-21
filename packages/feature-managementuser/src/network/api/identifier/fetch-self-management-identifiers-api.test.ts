import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HttpClientMock, appendQueryParamsToPath } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementIdentifiersApi } from '@/network/api/identifier/fetch-self-management-identifiers-api'
import {
  createTestUserIdentifierPrivatePayload,
  SelfManagementIdentifierRoutes,
  SelfIdentifierListParamsParser,
  SortOrder,
  TEST_IDENTIFIER_ID,
  toUserIdentifierIdOrThrow,
  createTestPagedResult,
  createTestPagedResultPayload
} from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementIdentifiersApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchSelfManagementIdentifiersApi

  const identifierPagedPayload = createTestPagedResultPayload({
    items: [],
    total_count: 0,
    page_number: 1,
    page_size: 10,
    total_pages: 0
  })

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchSelfManagementIdentifiersApi(mockHttpClient)
  })

  it('dispatches getUserIdentifier request', async () => {
    const identifierPayload = createTestUserIdentifierPrivatePayload({ id: toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(identifierPayload)

    const identifierId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const identifierResult = await api.getUserIdentifier(identifierId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementIdentifierRoutes.GET_IDENTIFIER.replace('{user_identifier_id}', TEST_IDENTIFIER_ID)
    )
    expect(identifierResult).toEqual({ success: true, data: identifierPayload })
  })

  it('dispatches getUserIdentifiers request with query params', async () => {
    const expectedIdentifierListPagedResult = createTestPagedResult({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(identifierPagedPayload)

    const selfIdentifierListParams = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      userAuthProviders: [],
      identifiers: []
    }
    const identifierListResult = await api.getUserIdentifiers(selfIdentifierListParams)

    const expectedUrl = appendQueryParamsToPath(
      SelfManagementIdentifierRoutes.GET_IDENTIFIERS,
      SelfIdentifierListParamsParser.toQueryMap(selfIdentifierListParams)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(identifierListResult).toEqual({ success: true, data: expectedIdentifierListPagedResult })
  })

  it('dispatches emailChangePassword request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const identifierId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const emailPasswordChangeRequest = { old_password: 'old', new_password: 'new' }
    const emailChangePasswordResult = await api.emailChangePassword(identifierId, emailPasswordChangeRequest)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementIdentifierRoutes.IDENTIFIER_EMAIL_CHANGE_PASSWORD.replace('{user_identifier_id}', TEST_IDENTIFIER_ID),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(emailPasswordChangeRequest) })
    )
    expect(emailChangePasswordResult).toEqual({ success: true, data: undefined })
  })
})
