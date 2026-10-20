import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementResetPasswordApi } from '@/network/api/auth/reset-password/fetch-self-management-reset-password-api'
import {
  SelfManagementResetPasswordRoutes,
  TEST_EMAIL,
  TEST_IDENTIFIER_ID,
  createTestUserIdentifierPrivatePayload,
  toUserIdentifierIdOrThrow,
  createTestOtpConfirmationPayload
} from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementResetPasswordApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchSelfManagementResetPasswordApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchSelfManagementResetPasswordApi(mockHttpClient)
  })

  it('dispatches resetPassword request', async () => {
    const mockUserIdentifierPayload = createTestUserIdentifierPrivatePayload({
      id: toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockUserIdentifierPayload)

    const request = { email: TEST_EMAIL, new_password: 'new_secret', confirmation_code: '123456' }
    const result = await api.resetPassword(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementResetPasswordRoutes.RESET_PASSWORD,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ success: true, data: mockUserIdentifierPayload })
  })

  it('dispatches sendResetPasswordConfirmationToEmail request', async () => {
    const mockOtpConfirmationPayload = createTestOtpConfirmationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockOtpConfirmationPayload)

    const request = { email: 'admin@example.com' }
    const result = await api.sendResetPasswordConfirmationToEmail(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementResetPasswordRoutes.SEND_RESET_PASSWORD_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ success: true, data: mockOtpConfirmationPayload })
  })
})
