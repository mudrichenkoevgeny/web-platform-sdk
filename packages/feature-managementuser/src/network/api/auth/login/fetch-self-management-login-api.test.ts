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
    const dummyPayload = { userDetails: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { email: 'admin@example.com', password: 'secret' }
    const result = await api.loginByEmail(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementLoginRoutes.LOGIN_BY_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches loginByTotp request', async () => {
    const dummyPayload = { userDetails: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { mfa_token: 'mfa123', totp_code: '654321' }
    const result = await api.loginByTotp(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementLoginRoutes.LOGIN_BY_TOTP,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches loginByTotpRecoveryCode request', async () => {
    const dummyPayload = { userDetails: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { mfa_token: 'mfa123', totp_code: 'rec_123' }
    const result = await api.loginByTotpRecoveryCode(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementLoginRoutes.LOGIN_BY_TOTP_RECOVERY_CODE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })
})
