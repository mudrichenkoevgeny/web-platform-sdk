import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchResetPasswordApi } from '@/network/api/auth/reset-password/fetch-reset-password-api'
import { OpenResetPasswordRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchResetPasswordApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchResetPasswordApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchResetPasswordApi(mockHttpClient)
  })

  it('dispatches resetPassword request', async () => {
    const dummyPayload = { id: 'ident_1' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { email: 'user@example.com', new_password: 'new_secret', confirmation_code: '123456' }
    const result = await api.resetPassword(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenResetPasswordRoutes.RESET_EMAIL_PASSWORD,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches sendResetPasswordConfirmationToEmail request', async () => {
    const dummyPayload = { retryAfterSeconds: 60 } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { email: 'user@example.com' }
    const result = await api.sendResetPasswordConfirmationToEmail(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenResetPasswordRoutes.SEND_RESET_EMAIL_PASSWORD_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })
})
