import { describe, it, expect, beforeEach } from 'vitest'
import { EncryptedSettingsMock, isFailure, CommonErrorContractViolation } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import { EncryptedManagementStorageSettingsStorage } from './encrypted-management-storage-settings-storage'

describe('EncryptedManagementStorageSettingsStorage', () => {
  let mockEncryptedSettings: EncryptedSettingsMock
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
    mockEncryptedSettings = new EncryptedSettingsMock()
    storage = new EncryptedManagementStorageSettingsStorage(mockEncryptedSettings)
  })

  it('returns null when no settings are stored', async () => {
    const result = await storage.getSettings()
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBeNull()
    }
  })

  it('saves and deserializes stored settings into domain model', async () => {
    const saveResult = await storage.saveSettings(mockSettings)
    expect(saveResult.success).toBe(true)

    const result = await storage.getSettings()
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockSettings)
    }
  })

  it('clears stored settings', async () => {
    await storage.saveSettings(mockSettings)
    const clearResult = await storage.clearSettings()
    expect(clearResult.success).toBe(true)

    const result = await storage.getSettings()
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBeNull()
    }
  })

  it('returns failure when stored JSON is corrupted', async () => {
    await mockEncryptedSettings.put('management_storage_settings', 'invalid-json-{')

    const result = await storage.getSettings()
    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(CommonErrorContractViolation)
    }
  })
})
