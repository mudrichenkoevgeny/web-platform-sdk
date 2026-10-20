import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HttpClientMock, appendQueryParamsToPath } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementIdentifiersApi } from '@/network/api/identifier/fetch-self-management-identifiers-api'
import { createTestUserIdentifierPrivatePayload, SelfManagementIdentifierRoutes, SelfIdentifierListParamsParser, SortOrder, TEST_IDENTIFIER_ID, toUserIdentifierIdOrThrow, createTestPagedResult } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementIdentifiersApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchSelfManagementIdentifiersApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchSelfManagementIdentifiersApi(mockHttpClient)
  })

  it('dispatches getUserIdentifier request', async () => {
    const mockIdentifierPayload = createTestUserIdentifierPrivatePayload({ id: toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockIdentifierPayload)

    const identifierId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const identifierResult = await api.getUserIdentifier(identifierId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementIdentifierRoutes.GET_IDENTIFIER.replace('{user_identifier_id}', TEST_IDENTIFIER_ID)
    )
    expect(identifierResult).toEqual({ success: true, data: mockIdentifierPayload })
  })

  it('dispatches getUserIdentifiers request with query params', async () => {
    const mockIdentifierListPayload = createTestPagedResult({ pageSize: 10 })
    const expectedIdentifierListPagedResult = createTestPagedResult({ pageSize: 10 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockIdentifierListPayload)

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
