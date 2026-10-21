import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementUnlockApi } from '@/network/api/auth/unlock/fetch-self-management-unlock-api'
import { SelfManagementUnlockRoutes, TEST_PHONE, createTestOtpConfirmationPayload, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'

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

    const emailConfirmationResult = await api.sendUnlockEmailConfirmation('admin@example.com')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUnlockRoutes.SEND_UNLOCK_EMAIL_CONFIRMATION,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: 'admin@example.com' }) })
    )
    expect(emailConfirmationResult).toEqual({ success: true, data: mockOtpConfirmationPayload })
  })

  it('dispatches unlockByEmail request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const unlockByEmailResult = await api.unlockByEmail('admin@example.com', '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUnlockRoutes.UNLOCK_BY_EMAIL,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: 'admin@example.com', confirmation_code: '123456' }) })
    )
    expect(unlockByEmailResult).toEqual({ success: true, data: undefined })
  })

  it('dispatches sendUnlockPhoneConfirmation request', async () => {
    const mockOtpConfirmationPayload = createTestOtpConfirmationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockOtpConfirmationPayload)

    const phoneConfirmationResult = await api.sendUnlockPhoneConfirmation(TEST_PHONE)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUnlockRoutes.SEND_UNLOCK_PHONE_CONFIRMATION,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ phone_number: TEST_PHONE }) })
    )
    expect(phoneConfirmationResult).toEqual({ success: true, data: mockOtpConfirmationPayload })
  })

  it('dispatches unlockByPhone request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const unlockByPhoneResult = await api.unlockByPhone(TEST_PHONE, '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUnlockRoutes.UNLOCK_BY_PHONE,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ phone_number: TEST_PHONE, confirmation_code: '123456' }) })
    )
    expect(unlockByPhoneResult).toEqual({ success: true, data: undefined })
  })

  it('dispatches unlockByExternalAuthProvider request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const unlockByProviderResult = await api.unlockByExternalAuthProvider(UserAuthProvider.GOOGLE, 'token123')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUnlockRoutes.UNLOCK_BY_EXTERNAL_PROVIDER,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ auth_provider: UserAuthProvider.GOOGLE, external_provider_token: 'token123' }) })
    )
    expect(unlockByProviderResult).toEqual({ success: true, data: undefined })
  })
})
