import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementUserApi } from '@/network/api/user/fetch-self-management-user-api'
import { createTestApiErrorResponse, createTestUserPrivatePayload, SelfManagementUserRoutes, TEST_USER_ID, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementUserApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchSelfManagementUserApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchSelfManagementUserApi(mockHttpClient)
  })

  it('dispatches getUser request', async () => {
    const mockUserPayload = createTestUserPrivatePayload({ id: toUserIdOrThrow(TEST_USER_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockUserPayload)

    const result = await api.getUser()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUserRoutes.GET_USER
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'UNAUTHORIZED', message: 'Unauthorized' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.getUser()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('UNAUTHORIZED')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.getUser()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
