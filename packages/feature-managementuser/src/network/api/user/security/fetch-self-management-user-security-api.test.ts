import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementUserSecurityApi } from '@/network/api/user/security/fetch-self-management-user-security-api'
import {
  SelfManagementUserSecurityRoutes,
  createTestApiErrorResponse,
  createTestTotpSetupPayload,
  createTestTotpRecoveryCodesPayload
} from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementUserSecurityApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchSelfManagementUserSecurityApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchSelfManagementUserSecurityApi(mockHttpClient)
  })

  it('dispatches setupTotp request', async () => {
    const mockTotpSetupPayload = createTestTotpSetupPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockTotpSetupPayload)

    const result = await api.setupTotp()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUserSecurityRoutes.SETUP_TOTP,
      expect.objectContaining({ method: 'POST' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches enableTotp request', async () => {
    const mockTotpRecoveryCodesPayload = createTestTotpRecoveryCodesPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockTotpRecoveryCodesPayload)

    const result = await api.enableTotp('mfa1', '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUserSecurityRoutes.ENABLE_TOTP,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ mfa_token: 'mfa1', totp_code: '123456' }) })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches disableTotp request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.disableTotp()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUserSecurityRoutes.DISABLE_TOTP,
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches getRecoveryCodes request', async () => {
    const mockTotpRecoveryCodesPayload = createTestTotpRecoveryCodesPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockTotpRecoveryCodesPayload)

    const result = await api.getRecoveryCodes()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUserSecurityRoutes.GET_RECOVERY_CODES
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches regenerateRecoveryCodes request', async () => {
    const mockTotpRecoveryCodesPayload = createTestTotpRecoveryCodesPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockTotpRecoveryCodesPayload)

    const result = await api.regenerateRecoveryCodes()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUserSecurityRoutes.REGENERATE_RECOVERY_CODES,
      expect.objectContaining({ method: 'POST' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'INVALID_TOTP_CODE', message: 'Invalid code' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.enableTotp('mfa1', 'wrong')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('INVALID_TOTP_CODE')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.setupTotp()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})
