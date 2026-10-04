import { describe, it, expect, vi } from 'vitest'
import {
  HttpClient,
  DeviceInfoProviderMock,
  isSuccess
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenGlobalSettingsApi } from '@/network/globalsettings/FetchOpenGlobalSettingsApi'
import type { OpenGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenGlobalSettingsApi', () => {
  const samplePayload: OpenGlobalSettingsPayload = {
    privacy_policy_url: 'https://example.com/privacy',
    terms_of_service_url: 'https://example.com/terms',
    contact_support_email: 'support@example.com',
    min_supported_app_versions: {
      android: '1.0.0',
      ios: '1.0.0'
    }
  }

  it('fetches open global settings successfully', async () => {
    const mockResponse = new Response(JSON.stringify(samplePayload), { status: 200 })
    const customFetch = vi.fn().mockResolvedValue(mockResponse)
    const deviceInfoProvider = new DeviceInfoProviderMock()

    const httpClient = new HttpClient({
      baseUrl: 'https://api.example.com',
      deviceInfoProvider,
      customFetch
    })

    const api = new FetchOpenGlobalSettingsApi(httpClient)
    const result = await api.getOpenGlobalSettings()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(samplePayload)
    }

    expect(customFetch).toHaveBeenCalledWith(
      'https://api.example.com/global-settings',
      expect.any(Object)
    )
  })
})
