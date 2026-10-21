import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenUnlockApi } from '@/network/api/auth/unlock/fetch-open-unlock-api'
import { OpenUnlockRoutes, TEST_EMAIL, TEST_PHONE, createTestOtpConfirmationPayload, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenUnlockApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenUnlockApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenUnlockApi(mockHttpClient)
  })

  it('dispatches sendUnlockEmailConfirmation request', async () => {
    const mockOtpConfirmationPayload = createTestOtpConfirmationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockOtpConfirmationPayload)

    const result = await api.sendUnlockEmailConfirmation(TEST_EMAIL)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.SEND_UNLOCK_EMAIL_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: TEST_EMAIL })
      })
    )
    expect(result).toEqual({ success: true, data: mockOtpConfirmationPayload })
  })

  it('dispatches unlockByEmail request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.unlockByEmail(TEST_EMAIL, '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.UNLOCK_BY_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: TEST_EMAIL, confirmation_code: '123456' })
      })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches sendUnlockPhoneConfirmation request', async () => {
    const mockOtpConfirmationPayload = createTestOtpConfirmationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockOtpConfirmationPayload)

    const result = await api.sendUnlockPhoneConfirmation(TEST_PHONE)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.SEND_UNLOCK_PHONE_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ phone_number: TEST_PHONE })
      })
    )
    expect(result).toEqual({ success: true, data: mockOtpConfirmationPayload })
  })

  it('dispatches unlockByPhone request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.unlockByPhone(TEST_PHONE, '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.UNLOCK_BY_PHONE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ phone_number: TEST_PHONE, confirmation_code: '123456' })
      })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches unlockByExternalAuthProvider request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.unlockByExternalAuthProvider(UserAuthProvider.GOOGLE, 'token123')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.UNLOCK_BY_EXTERNAL_PROVIDER,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ auth_provider: UserAuthProvider.GOOGLE, external_provider_token: 'token123' })
      })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
