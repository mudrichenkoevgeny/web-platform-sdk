import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettingsApi } from '../../network/api/open/open-storage-settings-api'
import type { OpenStorageSettingsStorage } from '../../storage/open/open-storage-settings-storage'
import { OpenStorageSettingsRepositoryImpl } from './open-storage-settings-repository-impl'

describe('OpenStorageSettingsRepositoryImpl', () => {
  let mockApi: OpenStorageSettingsApi
  let mockStorage: OpenStorageSettingsStorage

  const mockSettings: OpenStorageSettings = {
    minUploadSizeBytes: 1024,
    maxUploadSizeBytes: 10485760
  }

  beforeEach(() => {
    mockApi = {
      getSettings: vi.fn()
    }

    mockStorage = {
      getSettings: vi.fn(),
      saveSettings: vi.fn(),
      clearSettings: vi.fn()
    }
  })

  it('returns cached settings if present in getSettings', async () => {
    vi.mocked(mockStorage.getSettings).mockResolvedValue(appResultSuccess(mockSettings))

    const repository = new OpenStorageSettingsRepositoryImpl(mockApi, mockStorage)
    const result = await repository.getSettings()

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockSettings)
    }
    expect(mockApi.getSettings).not.toHaveBeenCalled()
  })

  it('fetches from API and saves to cache when local cache is empty', async () => {
    vi.mocked(mockStorage.getSettings).mockResolvedValue(appResultSuccess(null))
    vi.mocked(mockApi.getSettings).mockResolvedValue(appResultSuccess(mockSettings))

    const repository = new OpenStorageSettingsRepositoryImpl(mockApi, mockStorage)
    const result = await repository.getSettings()

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockSettings)
    }
    expect(mockStorage.saveSettings).toHaveBeenCalledWith(mockSettings)
  })
})
