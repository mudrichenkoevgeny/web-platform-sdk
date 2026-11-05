import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementLoginApi } from '@/network/api/auth/login/fetch-self-management-login-api'
import { SelfManagementLoginRoutes, createTestApiErrorResponse, createTestAuthDataPayload } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementLoginApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchSelfManagementLoginApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchSelfManagementLoginApi(mockHttpClient)
  })

  it('dispatches loginByEmail request', async () => {
    const mockAuthDataPayload = createTestAuthDataPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthDataPayload)

    const result = await api.loginByEmail('admin@example.com', 'secret')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementLoginRoutes.LOGIN_BY_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'admin@example.com', password: 'secret' })
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches loginByTotp request', async () => {
    const mockAuthDataPayload = createTestAuthDataPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthDataPayload)

    const result = await api.loginByTotp('mfa123', '654321')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementLoginRoutes.LOGIN_BY_TOTP,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ mfa_token: 'mfa123', totp_code: '654321' })
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches loginByTotpRecoveryCode request', async () => {
    const mockAuthDataPayload = createTestAuthDataPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthDataPayload)

    const result = await api.loginByTotpRecoveryCode('mfa123', 'rec_123')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementLoginRoutes.LOGIN_BY_TOTP_RECOVERY_CODE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ mfa_token: 'mfa123', totp_code: 'rec_123' })
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'UNAUTHORIZED', message: 'Bad password' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.loginByEmail('admin@example.com', 'wrong')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('UNAUTHORIZED')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.loginByEmail('admin@example.com', 'secret')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
