import { describe, it, expect, vi } from 'vitest'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { HttpClient } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { OpenUserConfigurationPayload } from '@mudrichenkoevgeny/shared-foundation'
import { FetchOpenUserConfigurationApi } from '@/network/api/configuration/fetch-open-user-configuration-api'
describe('FetchOpenUserConfigurationApi', () => {
  it('dispatches GET request for open user configuration', async () => {
    const mockPayload: OpenUserConfigurationPayload = {
      open_global_settings: {
        privacy_policy_url: null,
        terms_of_service_url: null,
        contact_support_email: null,
        min_supported_app_versions: {}
      },
      open_security_settings: {
        open_password_policy: {
          min_length: 8,
          require_letter: true,
          require_upper_case: true,
          require_lower_case: true,
          require_digit: true,
          require_special_char: false
        },
        otp_confirmation: {
          retry_after_seconds: 60,
          number_of_symbols: 6,
          expiration_seconds: 300
        }
      },
      open_auth_settings: {
        available_auth_providers: {
          primary: ['EMAIL'],
          secondary: ['GOOGLE']
        },
        max_total_identifiers: 5,
        max_email_identifiers: 2,
        max_phone_identifiers: 2,
        max_identifiers_per_external_provider: 1,
        is_registration_enabled: true
      }
    }

    const mockHttpClient = {
      request: vi.fn().mockResolvedValue(mockPayload)
    } as unknown as HttpClient

    const api = new FetchOpenUserConfigurationApi(mockHttpClient)
    const result = await api.getOpenUserConfiguration()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(mockPayload)
    }
    expect(mockHttpClient.request).toHaveBeenCalledWith('/configuration')
  })
})
