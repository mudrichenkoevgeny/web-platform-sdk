import { describe, it, expect, vi } from 'vitest'
import type { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestOpenStorageSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { FetchOpenStorageSettingsApi } from './fetch-open-storage-settings-api'

describe('FetchOpenStorageSettingsApi', () => {
  const mockHttpClient: HttpClient = {
    request: vi.fn()
  } as unknown as HttpClient

  const api = new FetchOpenStorageSettingsApi(mockHttpClient)

  it('fetches open storage settings successfully', async () => {
    const mockPayload = createTestOpenStorageSettingsPayload()

    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.getOpenStorageSettings()
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockPayload)
    }
  })
})
