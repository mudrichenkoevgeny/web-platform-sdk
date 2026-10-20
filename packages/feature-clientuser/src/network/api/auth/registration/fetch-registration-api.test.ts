import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchRegistrationApi } from '@/network/api/auth/registration/fetch-registration-api'
import {
  OpenRegistrationRoutes,
  TEST_EMAIL,
  createTestAuthDataPayload,
  createTestOtpConfirmationPayload
} from '@mudrichenkoevgeny/shared-foundation'

describe('FetchRegistrationApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchRegistrationApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchRegistrationApi(mockHttpClient)
  })

  it('dispatches registerByEmail request', async () => {
    const mockAuthDataPayload = createTestAuthDataPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuthDataPayload)

    const request = { email: TEST_EMAIL, password: 'secret_pass', confirmation_code: '123456' }
    const result = await api.registerByEmail(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenRegistrationRoutes.REGISTRATION_BY_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ success: true, data: mockAuthDataPayload })
  })

  it('dispatches sendRegistrationConfirmationToEmail request', async () => {
    const mockOtpConfirmationPayload = createTestOtpConfirmationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockOtpConfirmationPayload)

    const request = { email: TEST_EMAIL }
    const result = await api.sendRegistrationConfirmationToEmail(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenRegistrationRoutes.SEND_REGISTRATION_CONFIRMATION_TO_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ success: true, data: mockOtpConfirmationPayload })
  })
})
