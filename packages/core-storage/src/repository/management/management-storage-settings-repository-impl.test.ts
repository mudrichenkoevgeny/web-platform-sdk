import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsApi } from '../../network/api/management/management-storage-settings-api'
import type { ManagementStorageSettingsStorage } from '../../storage/management/management-storage-settings-storage'
import { ManagementStorageSettingsRepositoryImpl } from './management-storage-settings-repository-impl'

describe('ManagementStorageSettingsRepositoryImpl', () => {
  let mockApi: ManagementStorageSettingsApi
  let mockStorage: ManagementStorageSettingsStorage

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
    mockApi = {
      getSettings: vi.fn(),
      updateSettings: vi.fn(),
      resetSettings: vi.fn()
    }

    mockStorage = {
      getSettings: vi.fn(),
      saveSettings: vi.fn(),
      clearSettings: vi.fn()
    }
  })

  it('returns cached settings if present in getSettings', async () => {
    vi.mocked(mockStorage.getSettings).mockResolvedValue(appResultSuccess(mockSettings))

    const repository = new ManagementStorageSettingsRepositoryImpl(mockApi, mockStorage)
    const result = await repository.getSettings()

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockSettings)
    }
  })
})
