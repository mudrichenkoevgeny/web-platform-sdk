import { describe, it, expect, vi } from 'vitest'
import type { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenStorageSettingsApi } from './fetch-open-storage-settings-api'

describe('FetchOpenStorageSettingsApi', () => {
  const mockHttpClient: HttpClient = {
    request: vi.fn()
  } as unknown as HttpClient

  const api = new FetchOpenStorageSettingsApi(mockHttpClient)

  it('fetches open storage settings and converts payload to domain model', async () => {
    const mockPayload = {
      min_upload_size_bytes: 1024,
      max_upload_size_bytes: 10485760
    }
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.getSettings()
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.minUploadSizeBytes).toBe(1024)
      expect(result.data.maxUploadSizeBytes).toBe(10485760)
    }
  })
})
