import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenLoginApi } from '@/network/api/auth/login/fetch-open-login-api'
import {
  OpenLoginRoutes,
  TEST_EMAIL,
  TEST_PHONE,
  createTestAuthDataPayload,
  createTestOtpConfirmationPayload
} from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenLoginApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenLoginApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenLoginApi(mockHttpClient)
  })

  it('dispatches loginByEmail request', async () => {
    const mockAuthDataPayload = createTestAuthDataPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthDataPayload)

    const result = await api.loginByEmail(TEST_EMAIL, 'secret')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: TEST_EMAIL, password: 'secret' })
      })
    )
    expect(result).toEqual({ success: true, data: mockAuthDataPayload })
  })

  it('dispatches loginByPhone request', async () => {
    const mockAuthDataPayload = createTestAuthDataPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthDataPayload)

    const result = await api.loginByPhone(TEST_PHONE, '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_PHONE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ phone_number: TEST_PHONE, confirmation_code: '123456' })
      })
    )
    expect(result).toEqual({ success: true, data: mockAuthDataPayload })
  })

  it('dispatches loginByExternalAuthProvider request', async () => {
    const mockAuthDataPayload = createTestAuthDataPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthDataPayload)

    const result = await api.loginByExternalAuthProvider('google', 'token123')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_EXTERNAL_AUTH_PROVIDER,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ auth_provider: 'GOOGLE', external_provider_token: 'token123' })
      })
    )
    expect(result).toEqual({ success: true, data: mockAuthDataPayload })
  })

  it('dispatches loginByTotp request', async () => {
    const mockAuthDataPayload = createTestAuthDataPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthDataPayload)

    const result = await api.loginByTotp('mfa123', '654321')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.LOGIN_BY_TOTP,
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
      OpenLoginRoutes.LOGIN_BY_TOTP_RECOVERY_CODE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ mfa_token: 'mfa123', totp_code: 'rec_123' })
      })
    )
    expect(result).toEqual({ success: true, data: mockAuthDataPayload })
  })

  it('dispatches sendLoginConfirmationToPhone request', async () => {
    const mockOtpConfirmationPayload = createTestOtpConfirmationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockOtpConfirmationPayload)

    const result = await api.sendLoginConfirmationToPhone(TEST_PHONE)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenLoginRoutes.SEND_LOGIN_CONFIRMATION_TO_PHONE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ phone_number: TEST_PHONE })
      })
    )
    expect(result).toEqual({ success: true, data: mockOtpConfirmationPayload })
  })
})
