import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenLoginApi } from '@/network/api/auth/login/fetch-open-login-api'
import { OpenLoginRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenLoginApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchOpenLoginApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchOpenLoginApi(mockHttpClient)
  })

  it('dispatches loginByEmail request', async () => {
    const dummyPayload = { user_private: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.loginByEmail('test@example.com', 'secret')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'secret' })
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches loginByPhone request', async () => {
    const dummyPayload = { user_private: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.loginByPhone('+1234567890', '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_PHONE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ phone_number: '+1234567890', confirmation_code: '123456' })
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches loginByExternalAuthProvider request', async () => {
    const dummyPayload = { user_private: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.loginByExternalAuthProvider('GOOGLE' as any, 'token123')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_EXTERNAL_AUTH_PROVIDER,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ auth_provider: 'GOOGLE', external_provider_token: 'token123' })
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches loginByTotp request', async () => {
    const dummyPayload = { user_private: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.loginByTotp('mfa123', '654321')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_TOTP,
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
      OpenLoginRoutes.LOGIN_BY_TOTP_RECOVERY_CODE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ mfa_token: 'mfa123', totp_code: 'rec_123' })
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches sendLoginConfirmationToPhone request', async () => {
    const dummyPayload = { retryAfterSeconds: 60 } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.sendLoginConfirmationToPhone('+1234567890')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.SEND_LOGIN_CONFIRMATION_TO_PHONE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ phone_number: '+1234567890' })
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })
})
