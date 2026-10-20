import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementSecuritySettingsApi } from '@/network/api/security/settings/fetch-management-security-settings-api'
import { ManagementSecuritySettingsRoutes, createTestAccountLockoutPolicyPayload } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementSecuritySettingsApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementSecuritySettingsApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementSecuritySettingsApi(mockHttpClient)
  })

  it('dispatches getManagementSecuritySettings request', async () => {
    const mockSettingsPayload = {
      password_policy: { min_length: 8, require_letter: true, require_upper_case: true, require_lower_case: true, require_digit: true, require_special_char: false },
      account_lockout_policy: createTestAccountLockoutPolicyPayload(),
      otp_confirmation: { retry_after_seconds: 60, number_of_symbols: 6, expiration_seconds: 300 }
    }
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSettingsPayload)

    const result = await api.getManagementSecuritySettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSecuritySettingsRoutes.GET_MANAGEMENT_SECURITY_SETTINGS
    )
    expect(result).toEqual({ success: true, data: mockSettingsPayload })
  })

  it('dispatches updateManagementSecuritySettings request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const request = { password_policy: { min_length: 8, require_letter: true, require_upper_case: true, require_lower_case: true, require_digit: true, require_special_char: false }, account_lockout_policy: createTestAccountLockoutPolicyPayload(), otp_confirmation: { retry_after_seconds: 60, number_of_symbols: 6, expiration_seconds: 300 } }
    const result = await api.updateManagementSecuritySettings(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSecuritySettingsRoutes.UPDATE_MANAGEMENT_SECURITY_SETTINGS,
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches resetManagementSecuritySettings request', async () => {
    const mockSettingsPayload = {
      password_policy: { min_length: 8, require_letter: true, require_upper_case: true, require_lower_case: true, require_digit: true, require_special_char: false },
      account_lockout_policy: createTestAccountLockoutPolicyPayload(),
      otp_confirmation: { retry_after_seconds: 60, number_of_symbols: 6, expiration_seconds: 300 }
    }
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSettingsPayload)

    const result = await api.resetManagementSecuritySettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSecuritySettingsRoutes.RESET_MANAGEMENT_SECURITY_SETTINGS,
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual({ success: true, data: mockSettingsPayload })
  })
})
