import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementLoginApi } from '@/network/api/auth/login/fetch-self-management-login-api'
import { SelfManagementLoginRoutes, createTestAuthDataPayload } from '@mudrichenkoevgeny/shared-foundation'

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
    expect(result).toEqual({ success: true, data: mockAuthDataPayload })
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
    expect(result).toEqual({ success: true, data: mockAuthDataPayload })
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
    expect(result).toEqual({ success: true, data: mockAuthDataPayload })
  })
})
