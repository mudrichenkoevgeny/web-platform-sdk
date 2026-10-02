import { describe, it, expect, vi } from 'vitest'
import {
  HttpClient,
  DeviceInfoProviderMock,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenSecuritySettingsApi } from './FetchOpenSecuritySettingsApi'
import { OpenSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenSecuritySettingsApi', () => {
  const samplePayload: OpenSecuritySettingsPayload = {
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
  }

  it('fetches open security settings successfully', async () => {
    const mockResponse = new Response(JSON.stringify(samplePayload), { status: 200 })
    const customFetch = vi.fn().mockResolvedValue(mockResponse)
    const deviceInfoProvider = new DeviceInfoProviderMock()

    const httpClient = new HttpClient({
      baseUrl: 'https://api.example.com',
      deviceInfoProvider,
      customFetch
    })

    const api = new FetchOpenSecuritySettingsApi(httpClient)
    const result = await api.getSecuritySettings()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(samplePayload)
    }

    expect(customFetch).toHaveBeenCalledWith(
      'https://api.example.com/security/settings',
      expect.any(Object)
    )
  })
})
