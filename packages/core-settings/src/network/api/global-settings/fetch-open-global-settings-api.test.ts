import { describe, it, expect, vi } from 'vitest'
import type { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { FetchOpenGlobalSettingsApi } from './fetch-open-global-settings-api'

describe('FetchOpenGlobalSettingsApi', () => {
  const mockHttpClient: HttpClient = {
    request: vi.fn()
  } as unknown as HttpClient

  const api = new FetchOpenGlobalSettingsApi(mockHttpClient)

  it('fetches open global settings successfully', async () => {
    const mockPayload: OpenGlobalSettingsPayload = {
      userRegistrationEnabled: true,
      defaultUserRole: 'CLIENT',
      defaultLocale: 'en'
    }

    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.getOpenGlobalSettings()
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockPayload)
    }
  })
})
