import { describe, it, expect, vi } from 'vitest'
import type { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementStorageSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { FetchManagementStorageSettingsApi } from './fetch-management-storage-settings-api'

describe('FetchManagementStorageSettingsApi', () => {
  const mockHttpClient: HttpClient = {
    request: vi.fn()
  } as unknown as HttpClient

  const api = new FetchManagementStorageSettingsApi(mockHttpClient)

  const mockSettings = createTestManagementStorageSettingsPayload()

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
