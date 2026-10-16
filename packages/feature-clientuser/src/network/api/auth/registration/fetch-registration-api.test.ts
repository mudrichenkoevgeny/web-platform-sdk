import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchRegistrationApi } from '@/network/api/auth/registration/fetch-registration-api'
import { OpenRegistrationRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchRegistrationApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchRegistrationApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchRegistrationApi(mockHttpClient)
  })

  it('dispatches registerByEmail request', async () => {
    const dummyPayload = { user_private: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { email: 'user@example.com', password: 'secret_pass', confirmation_code: '123456' }
    const result = await api.registerByEmail(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenRegistrationRoutes.REGISTRATION_BY_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches sendRegistrationConfirmationToEmail request', async () => {
    const dummyPayload = { retryAfterSeconds: 60 } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { email: 'user@example.com' } as any
    const result = await api.sendRegistrationConfirmationToEmail(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenRegistrationRoutes.SEND_REGISTRATION_CONFIRMATION_TO_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })
})
