import { describe, it, expect, vi } from 'vitest'
import type { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { FetchManagementStorageSettingsApi } from './fetch-management-storage-settings-api'

describe('FetchManagementStorageSettingsApi', () => {
  const mockHttpClient: HttpClient = {
    request: vi.fn()
  } as unknown as HttpClient

  const api = new FetchManagementStorageSettingsApi(mockHttpClient)

  const mockSettings: ManagementStorageSettingsPayload = {
    minUploadSizeBytes: 1,
    maxUploadSizeBytes: 52428800,
    totalStorageQuotaForOpenUserBytes: 104857600,
    totalStorageQuotaForManagementUserBytes: 1073741824,
    presignedUrlExpirationSeconds: 900,
    maxPendingUploadsForOpenUser: 5,
    maxPendingUploadsForManagementUser: 20,
    isDeduplicationEnabled: true,
    deletedFilesCleanupIntervalSeconds: 86400
  }

  it('calls getManagementStorageSettings and returns payload', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSettings)

    const result = await api.getManagementStorageSettings()
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockSettings)
    }
  })

  it('calls updateManagementStorageSettings with PUT method and payload', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSettings)

    const result = await api.updateManagementStorageSettings(mockSettings)
    expect(result.success).toBe(true)
  })

  it('calls resetManagementStorageSettings with POST method', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSettings)

    const result = await api.resetManagementStorageSettings()
    expect(result.success).toBe(true)
  })
})
