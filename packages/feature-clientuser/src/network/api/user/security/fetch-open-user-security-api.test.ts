import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenUserSecurityApi } from '@/network/api/user/security/fetch-open-user-security-api'
import {
  OpenUserSecurityRoutes,
  createTestTotpSetupPayload,
  createTestTotpRecoveryCodesPayload
} from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenUserSecurityApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenUserSecurityApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenUserSecurityApi(mockHttpClient)
  })

  it('dispatches setupTotp request', async () => {
    const mockTotpSetupPayload = createTestTotpSetupPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockTotpSetupPayload)

    const result = await api.setupTotp()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserSecurityRoutes.SETUP_TOTP,
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual({ success: true, data: mockTotpSetupPayload })
  })

  it('dispatches enableTotp request', async () => {
    const mockTotpRecoveryCodesPayload = createTestTotpRecoveryCodesPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockTotpRecoveryCodesPayload)

    const result = await api.enableTotp('mfa1', '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserSecurityRoutes.ENABLE_TOTP,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ mfa_token: 'mfa1', totp_code: '123456' }) })
    )
    expect(result).toEqual({ success: true, data: mockTotpRecoveryCodesPayload })
  })

  it('dispatches disableTotp request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.disableTotp()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserSecurityRoutes.DISABLE_TOTP,
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches getRecoveryCodes request', async () => {
    const mockTotpRecoveryCodesPayload = createTestTotpRecoveryCodesPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockTotpRecoveryCodesPayload)

    const result = await api.getRecoveryCodes()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserSecurityRoutes.GET_RECOVERY_CODES
    )
    expect(result).toEqual({ success: true, data: mockTotpRecoveryCodesPayload })
  })

  it('dispatches regenerateRecoveryCodes request', async () => {
    const mockTotpRecoveryCodesPayload = createTestTotpRecoveryCodesPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockTotpRecoveryCodesPayload)

    const result = await api.regenerateRecoveryCodes()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserSecurityRoutes.REGENERATE_RECOVERY_CODES,
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual({ success: true, data: mockTotpRecoveryCodesPayload })
  })
})
