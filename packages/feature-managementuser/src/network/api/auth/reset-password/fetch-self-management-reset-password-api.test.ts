import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementResetPasswordApi } from '@/network/api/auth/reset-password/fetch-self-management-reset-password-api'
import { SelfManagementResetPasswordRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementResetPasswordApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchSelfManagementResetPasswordApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchSelfManagementResetPasswordApi(mockHttpClient)
  })

  it('dispatches resetPassword request', async () => {
    const dummyPayload = { id: 'ident_1' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { email: 'admin@example.com', new_password: 'new_secret', confirmation_code: '123456' }
    const result = await api.resetPassword(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementResetPasswordRoutes.RESET_PASSWORD,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches sendResetPasswordConfirmationToEmail request', async () => {
    const dummyPayload = { retryAfterSeconds: 60 } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { email: 'admin@example.com' }
    const result = await api.sendResetPasswordConfirmationToEmail(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementResetPasswordRoutes.SEND_RESET_PASSWORD_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })
})
