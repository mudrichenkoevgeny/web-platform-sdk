import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementUserSecurityApi } from '@/network/api/user/security/fetch-management-user-security-api'
import { createTestApiErrorResponse, TEST_USER_ID, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementUserSecurityApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementUserSecurityApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementUserSecurityApi(mockHttpClient)
  })

  it('dispatches disableTotp request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow(TEST_USER_ID)
    const result = await api.disableTotp(userId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(`/management/users/${TEST_USER_ID}/totp`),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'USER_NOT_FOUND', message: 'Not found' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.disableTotp(toUserIdOrThrow(TEST_USER_ID))

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('USER_NOT_FOUND')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.disableTotp(toUserIdOrThrow(TEST_USER_ID))

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
