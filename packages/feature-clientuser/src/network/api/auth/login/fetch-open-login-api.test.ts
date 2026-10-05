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
    const dummyPayload = { userDetails: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { email: 'test@example.com', password: 'secret' }
    const result = await api.loginByEmail(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches loginByPhone request', async () => {
    const dummyPayload = { userDetails: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { phone_number: '+1234567890', confirmation_code: '123456' }
    const result = await api.loginByPhone(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_PHONE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches loginByExternalAuthProvider request', async () => {
    const dummyPayload = { userDetails: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { authProvider: 'GOOGLE', externalProviderToken: 'token123' } as any
    const result = await api.loginByExternalAuthProvider(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_EXTERNAL_AUTH_PROVIDER,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches loginByTotp request', async () => {
    const dummyPayload = { userDetails: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { mfa_token: 'mfa123', totp_code: '654321' }
    const result = await api.loginByTotp(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_TOTP,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches loginByTotpRecoveryCode request', async () => {
    const dummyPayload = { userDetails: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { mfa_token: 'mfa123', totp_code: 'rec_123' }
    const result = await api.loginByTotpRecoveryCode(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_TOTP_RECOVERY_CODE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches sendLoginConfirmationToPhone request', async () => {
    const dummyPayload = { retryAfterSeconds: 60 } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { phoneNumber: '+1234567890' } as any
    const result = await api.sendLoginConfirmationToPhone(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.SEND_LOGIN_CONFIRMATION_TO_PHONE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })
})
