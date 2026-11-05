import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementUnlockApi } from '@/network/api/auth/unlock/fetch-self-management-unlock-api'
import { SelfManagementUnlockRoutes, createTestApiErrorResponse, createTestOtpConfirmationPayload } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementUnlockApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchSelfManagementUnlockApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchSelfManagementUnlockApi(mockHttpClient)
  })

  it('dispatches sendUnlockEmailConfirmation request', async () => {
    const mockOtpConfirmationPayload = createTestOtpConfirmationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockOtpConfirmationPayload)

    const result = await api.sendUnlockEmailConfirmation('admin@example.com')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUnlockRoutes.SEND_UNLOCK_EMAIL_CONFIRMATION,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: 'admin@example.com' }) })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches unlockByEmail request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.unlockByEmail('admin@example.com', '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUnlockRoutes.UNLOCK_BY_EMAIL,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: 'admin@example.com', confirmation_code: '123456' }) })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'INVALID_CONFIRMATION_CODE', message: 'Wrong code' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.unlockByEmail('admin@example.com', 'wrong')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('INVALID_CONFIRMATION_CODE')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.sendUnlockEmailConfirmation('admin@example.com')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
