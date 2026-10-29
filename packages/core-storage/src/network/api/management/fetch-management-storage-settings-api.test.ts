import { describe, it, expect, vi } from 'vitest'
import type { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementStorageSettingsApi } from './fetch-management-storage-settings-api'

describe('FetchManagementStorageSettingsApi', () => {
  const mockHttpClient: HttpClient = {
    request: vi.fn()
  } as unknown as HttpClient

  const api = new FetchManagementStorageSettingsApi(mockHttpClient)

  it('fetches management storage settings', async () => {
    const mockPayload = {
      min_upload_size_bytes: 1024,
      max_upload_size_bytes: 104857600,
      total_storage_quota_for_open_user_bytes: null,
      total_storage_quota_for_management_user_bytes: null,
      presigned_url_expiration_seconds: 3600,
      max_pending_uploads_for_open_user: 10,
      max_pending_uploads_for_management_user: 100,
      is_deduplication_enabled: true,
      deleted_files_cleanup_interval_seconds: 86400
    }
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.getSettings()
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.minUploadSizeBytes).toBe(1024)
      expect(result.data.maxUploadSizeBytes).toBe(104857600)
    }
  })
})
