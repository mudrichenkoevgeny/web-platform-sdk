import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ApiException, HttpClientMock, appendQueryParamsToPath, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementIdentifierApi } from '@/network/api/identifier/fetch-management-identifier-api'
import {
  ManagementIdentifiersRoutes,
  ManagementGlobalIdentifierListParamsParser,
  ManagementUserIdentifierListParamsParser,
  UserApiPaths,
  SortOrder,
  TEST_IDENTIFIER_ID,
  TEST_USER_ID,
  toUserIdOrThrow,
  toUserIdentifierIdOrThrow,
  createTestUserIdentifierPrivatePayload,
  createTestPagedResultPayload,
  createTestApiErrorResponse
} from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementIdentifierApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementIdentifierApi

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
    api = new FetchManagementIdentifierApi(mockHttpClient)
  })

  it('dispatches getIdentifiers request with query params', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(identifierPagedPayload)

    const identifierListParams = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      userIds: [],
      userAuthProviders: [],
      identifiers: []
    }
    const result = await api.getIdentifiers(identifierListParams)

    const expectedUrl = appendQueryParamsToPath(
      ManagementIdentifiersRoutes.GET_IDENTIFIERS,
      ManagementGlobalIdentifierListParamsParser.toQueryMap(identifierListParams)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches getIdentifiers request using GET_USER_IDENTIFIERS route when userId param is provided', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(identifierPagedPayload)

    const userIdentifierListParams = {
      userId: toUserIdOrThrow(TEST_USER_ID),
      pageNumber: 1,
      pageSize: 10
    }
    const result = await api.getIdentifiers(userIdentifierListParams)

    const expectedUrl = appendQueryParamsToPath(
      ManagementIdentifiersRoutes.GET_USER_IDENTIFIERS.replace(`{${UserApiPaths.USER_ID}}`, TEST_USER_ID),
      ManagementUserIdentifierListParamsParser.toQueryMap(userIdentifierListParams)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches getIdentifier request', async () => {
    const mockIdentifierPayload = createTestUserIdentifierPrivatePayload({ id: toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockIdentifierPayload)

    const result = await api.getIdentifier(toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID))

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementIdentifiersRoutes.GET_IDENTIFIER.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, TEST_IDENTIFIER_ID)
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches deleteIdentifier request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const result = await api.deleteIdentifier(userId, toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID))

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementIdentifiersRoutes.DELETE_IDENTIFIER.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, TEST_IDENTIFIER_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches deleteIdentifierPassword request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const result = await api.deleteIdentifierPassword(userId, toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID))

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementIdentifiersRoutes.DELETE_IDENTIFIER_PASSWORD.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, TEST_IDENTIFIER_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'IDENTIFIER_NOT_FOUND', message: 'Not found' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.getIdentifier(toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID))

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('IDENTIFIER_NOT_FOUND')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.getIdentifier(toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID))

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
