import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchRegistrationApi } from '@/network/api/auth/registration/fetch-registration-api'
import { OpenRegisterRoutes } from '@mudrichenkoevgeny/shared-foundation'

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
    const dummyPayload = { userDetails: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { email: 'user@example.com', password: 'secret_pass', confirmation_code: '123456' }
    const result = await api.registerByEmail(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenRegisterRoutes.REGISTER_BY_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches sendRegistrationConfirmationToEmail request', async () => {
    const dummyPayload = { retryAfterSeconds: 60 } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { email: 'user@example.com' } as any
    const result = await api.sendRegistrationConfirmationToEmail(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenRegisterRoutes.SEND_REGISTER_CONFIRMATION_TO_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })
})
