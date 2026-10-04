import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenUserSecurityApi } from '@/network/api/user/security/FetchOpenUserSecurityApi'
import { OpenUserSecurityRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenUserSecurityApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchOpenUserSecurityApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchOpenUserSecurityApi(mockHttpClient)
  })

  it('dispatches setupTotp request', async () => {
    const dummyPayload = { secretKey: 'secret' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.setupTotp()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserSecurityRoutes.SETUP_TOTP,
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches enableTotp request', async () => {
    const dummyPayload = { codes: ['c1'] } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { mfa_token: 'mfa1', totp_code: '123456' }
    const result = await api.enableTotp(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserSecurityRoutes.ENABLE_TOTP,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches disableTotp request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.disableTotp()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserSecurityRoutes.DISABLE_TOTP,
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ data: undefined, kind: 'Success' })
  })

  it('dispatches getRecoveryCodes request', async () => {
    const dummyPayload = { codes: ['c1'] } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getRecoveryCodes()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserSecurityRoutes.GET_RECOVERY_CODES
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches regenerateRecoveryCodes request', async () => {
    const dummyPayload = { codes: ['c2'] } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.regenerateRecoveryCodes()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserSecurityRoutes.REGENERATE_RECOVERY_CODES,
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })
})
