import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementLoginApi } from '@/network/api/auth/login/fetch-self-management-login-api'
import { SelfManagementLoginRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementLoginApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchSelfManagementLoginApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchSelfManagementLoginApi(mockHttpClient)
  })

  it('dispatches loginByEmail request', async () => {
    const dummyPayload = { user_private: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.loginByEmail('admin@example.com', 'secret')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementLoginRoutes.LOGIN_BY_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'admin@example.com', password: 'secret' })
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches loginByTotp request', async () => {
    const dummyPayload = { user_private: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.loginByTotp('mfa123', '654321')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementLoginRoutes.LOGIN_BY_TOTP,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ mfa_token: 'mfa123', totp_code: '654321' })
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches loginByTotpRecoveryCode request', async () => {
    const dummyPayload = { user_private: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.loginByTotpRecoveryCode('mfa123', 'rec_123')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementLoginRoutes.LOGIN_BY_TOTP_RECOVERY_CODE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ mfa_token: 'mfa123', totp_code: 'rec_123' })
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })
})
