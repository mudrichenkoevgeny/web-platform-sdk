import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementUserConfigurationApi } from '@/network/api/configuration/fetch-management-user-configuration-api'
import { ManagementUserConfigurationRoutes, createTestAccountLockoutPolicyPayload } from '@mudrichenkoevgeny/shared-foundation'

const createTestConfigurationPayload = () => ({
  global_settings: { app_name: 'Platform', privacy_policy_url: null, terms_of_service_url: null, contact_support_email: null, min_supported_app_versions: {} },
  security_settings: { password_policy: { min_length: 8, require_letter: true, require_upper_case: true, require_lower_case: true, require_digit: true, require_special_char: false }, account_lockout_policy: createTestAccountLockoutPolicyPayload(), otp_confirmation: { retry_after_seconds: 60, number_of_symbols: 6, expiration_seconds: 300 } },
  auth_settings: { available_auth_providers: { primary: [], secondary: [] }, max_total_identifiers: 5, max_email_identifiers: 2, max_phone_identifiers: 2, max_identifiers_per_external_provider: 1, is_registration_enabled: true }
})

describe('FetchManagementUserConfigurationApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementUserConfigurationApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementUserConfigurationApi(mockHttpClient)
  })

  it('dispatches getManagementUserConfiguration request', async () => {
    const mockConfigurationPayload = createTestConfigurationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockConfigurationPayload)

    const result = await api.getManagementUserConfiguration()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementUserConfigurationRoutes.GET_CONFIGURATION
    )
    expect(result).toEqual({ success: true, data: mockConfigurationPayload })
  })
})
