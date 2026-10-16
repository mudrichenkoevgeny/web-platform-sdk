import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenUnlockApi } from '@/network/api/auth/unlock/fetch-open-unlock-api'
import { OpenUnlockRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenUnlockApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchOpenUnlockApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchOpenUnlockApi(mockHttpClient)
  })

  it('dispatches sendUnlockEmailConfirmation request', async () => {
    const dummyPayload = { retryAfterSeconds: 60 } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.sendUnlockEmailConfirmation('user@example.com')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.SEND_UNLOCK_EMAIL_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com' })
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches unlockByEmail request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.unlockByEmail('user@example.com', '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.UNLOCK_BY_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com', confirmation_code: '123456' })
      })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches sendUnlockPhoneConfirmation request', async () => {
    const dummyPayload = { retryAfterSeconds: 60 } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.sendUnlockPhoneConfirmation('+1234567890')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.SEND_UNLOCK_PHONE_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ phone_number: '+1234567890' })
      })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches unlockByPhone request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.unlockByPhone('+1234567890', '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.UNLOCK_BY_PHONE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ phone_number: '+1234567890', confirmation_code: '123456' })
      })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches unlockByExternalAuthProvider request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.unlockByExternalAuthProvider('GOOGLE', 'token123')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.UNLOCK_BY_EXTERNAL_PROVIDER,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ auth_provider: 'GOOGLE', external_provider_token: 'token123' })
      })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})
