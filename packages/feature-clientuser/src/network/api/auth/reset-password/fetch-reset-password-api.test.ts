import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchResetPasswordApi } from '@/network/api/auth/reset-password/fetch-reset-password-api'
import {
  OpenResetPasswordRoutes,
  TEST_EMAIL,
  TEST_IDENTIFIER_ID,
  toUserIdentifierPrivatePayload,
  createTestUserIdentifierPrivate,
  toUserIdentifierIdOrThrow,
  createTestOtpConfirmationPayload
} from '@mudrichenkoevgeny/shared-foundation'

describe('FetchResetPasswordApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchResetPasswordApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchResetPasswordApi(mockHttpClient)
  })

  it('dispatches resetPassword request', async () => {
    const mockUserIdentifierPayload = toUserIdentifierPrivatePayload(
      createTestUserIdentifierPrivate({ id: toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID) })
    )
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockUserIdentifierPayload)

    const request = { email: TEST_EMAIL, new_password: 'new_secret', confirmation_code: '123456' }
    const result = await api.resetPassword(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenResetPasswordRoutes.RESET_EMAIL_PASSWORD,
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

    const request = { email: TEST_EMAIL }
    const result = await api.sendResetPasswordConfirmationToEmail(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenResetPasswordRoutes.SEND_RESET_EMAIL_PASSWORD_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ success: true, data: mockOtpConfirmationPayload })
  })
})
