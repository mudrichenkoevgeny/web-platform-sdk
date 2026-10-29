import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import { EncryptedManagementStorageSettingsStorage } from './encrypted-management-storage-settings-storage'

describe('EncryptedManagementStorageSettingsStorage', () => {
  let mockEncryptedSettings: EncryptedSettings
  let storage: EncryptedManagementStorageSettingsStorage

  const mockSettings: ManagementStorageSettings = {
    minUploadSizeBytes: 1024,
    maxUploadSizeBytes: 104857600,
    totalStorageQuotaForOpenUserBytes: null,
    totalStorageQuotaForManagementUserBytes: null,
    presignedUrlExpirationSeconds: 3600,
    maxPendingUploadsForOpenUser: 10,
    maxPendingUploadsForManagementUser: 100,
    isDeduplicationEnabled: true,
    deletedFilesCleanupIntervalSeconds: 86400
  }

  beforeEach(() => {
    mockEncryptedSettings = {
      get: vi.fn(),
      put: vi.fn(),
      remove: vi.fn()
    } as unknown as EncryptedSettings

    storage = new EncryptedManagementStorageSettingsStorage(mockEncryptedSettings)
  })

  it('returns null when no settings are stored', async () => {
    vi.mocked(mockEncryptedSettings.get).mockResolvedValue(null)

    const result = await storage.getSettings()
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBeNull()
    }
  })

  it('deserializes stored JSON payload into domain model', async () => {
    const rawJson = JSON.stringify({
      min_upload_size_bytes: 1024,
      max_upload_size_bytes: 104857600,
      total_storage_quota_for_open_user_bytes: null,
      total_storage_quota_for_management_user_bytes: null,
      presigned_url_expiration_seconds: 3600,
      max_pending_uploads_for_open_user: 10,
      max_pending_uploads_for_management_user: 100,
      is_deduplication_enabled: true,
      deleted_files_cleanup_interval_seconds: 86400
    })
    vi.mocked(mockEncryptedSettings.get).mockResolvedValue(rawJson)

    const result = await storage.getSettings()
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockSettings)
    }
  })
})
