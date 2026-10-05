import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementUnlockApi } from '@/network/api/auth/unlock/fetch-self-management-unlock-api'
import { SelfManagementUnlockRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementUnlockApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchSelfManagementUnlockApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchSelfManagementUnlockApi(mockHttpClient)
  })

  it('dispatches sendUnlockEmailConfirmation request', async () => {
    const dummyPayload = { retryAfterSeconds: 60 } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { email: 'admin@example.com' }
    const result = await api.sendUnlockEmailConfirmation(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUnlockRoutes.SEND_UNLOCK_EMAIL_CONFIRMATION,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches unlockByEmail request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const request = { email: 'admin@example.com', confirmation_code: '123456' }
    const result = await api.unlockByEmail(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUnlockRoutes.UNLOCK_BY_EMAIL,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches sendUnlockPhoneConfirmation request', async () => {
    const dummyPayload = { retryAfterSeconds: 60 } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { phone_number: '+1234567890' } as any
    const result = await api.sendUnlockPhoneConfirmation(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUnlockRoutes.SEND_UNLOCK_PHONE_CONFIRMATION,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches unlockByPhone request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const request = { phone_number: '+1234567890', confirmation_code: '123456' }
    const result = await api.unlockByPhone(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUnlockRoutes.UNLOCK_BY_PHONE,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches unlockByExternalAuthProvider request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const request = { auth_provider: 'GOOGLE', external_provider_token: 'token123' } as any
    const result = await api.unlockByExternalAuthProvider(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementUnlockRoutes.UNLOCK_BY_EXTERNAL_PROVIDER,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
