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

    const request = { email: 'user@example.com' } as any
    const result = await api.sendUnlockEmailConfirmation(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.SEND_UNLOCK_EMAIL_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches unlockByEmail request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const request = { email: 'user@example.com', confirmation_code: '123456' }
    const result = await api.unlockByEmail(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.UNLOCK_BY_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ data: undefined, kind: 'Success' })
  })

  it('dispatches sendUnlockPhoneConfirmation request', async () => {
    const dummyPayload = { retryAfterSeconds: 60 } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { phoneNumber: '+1234567890' } as any
    const result = await api.sendUnlockPhoneConfirmation(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.SEND_UNLOCK_PHONE_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches unlockByPhone request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const request = { phone_number: '+1234567890', confirmation_code: '123456' }
    const result = await api.unlockByPhone(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.UNLOCK_BY_PHONE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ data: undefined, kind: 'Success' })
  })

  it('dispatches unlockByExternalAuthProvider request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const request = { authProvider: 'GOOGLE', externalProviderToken: 'token123' } as any
    const result = await api.unlockByExternalAuthProvider(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUnlockRoutes.UNLOCK_BY_EXTERNAL_PROVIDER,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
    expect(result).toEqual({ data: undefined, kind: 'Success' })
  })
})
