import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementUnlockApi } from '@/network/api/auth/unlock/fetch-self-management-unlock-api'
import { SelfManagementUnlockRoutes, createTestOtpConfirmationPayload } from '@mudrichenkoevgeny/shared-foundation'

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
})
