import { describe, it, expect, vi } from 'vitest'
import type { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestOpenSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { FetchOpenSecuritySettingsApi } from './fetch-open-security-settings-api'

describe('FetchOpenSecuritySettingsApi', () => {
  const mockHttpClient: HttpClient = {
    request: vi.fn()
  } as unknown as HttpClient

  const api = new FetchOpenSecuritySettingsApi(mockHttpClient)

  it('fetches open security settings successfully', async () => {
    const mockPayload = createTestOpenSecuritySettingsPayload()

    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.getSecuritySettings()
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockPayload)
    }
  })
})
