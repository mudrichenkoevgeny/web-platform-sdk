import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { EncryptedSettings } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import { EncryptedOpenStorageSettingsStorage } from './encrypted-open-storage-settings-storage'

describe('EncryptedOpenStorageSettingsStorage', () => {
  let mockEncryptedSettings: EncryptedSettings
  let storage: EncryptedOpenStorageSettingsStorage

  const mockSettings: OpenStorageSettings = {
    minUploadSizeBytes: 1024,
    maxUploadSizeBytes: 10485760
  }

  beforeEach(() => {
    mockEncryptedSettings = {
      get: vi.fn(),
      put: vi.fn(),
      remove: vi.fn()
    } as unknown as EncryptedSettings

    storage = new EncryptedOpenStorageSettingsStorage(mockEncryptedSettings)
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
      max_upload_size_bytes: 10485760
    })
    vi.mocked(mockEncryptedSettings.get).mockResolvedValue(rawJson)

    const result = await storage.getSettings()
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockSettings)
    }
  })

  it('serializes domain model when saving settings', async () => {
    vi.mocked(mockEncryptedSettings.put).mockResolvedValue(undefined)

    const result = await storage.saveSettings(mockSettings)
    expect(result.success).toBe(true)
    expect(mockEncryptedSettings.put).toHaveBeenCalledWith(
      'open_storage_settings',
      expect.stringContaining('min_upload_size_bytes')
    )
  })
})
