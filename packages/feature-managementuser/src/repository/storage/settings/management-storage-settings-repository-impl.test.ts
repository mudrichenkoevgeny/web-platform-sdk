import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, isSuccess, WebSocketServiceMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  StorageWebSocketEventTypes,
  toManagementStorageSettings,
  createTestManagementStorageSettingsPayload
} from '@mudrichenkoevgeny/shared-foundation'
import { ManagementStorageSettingsRepositoryImpl } from './management-storage-settings-repository-impl'
import { FetchManagementStorageSettingsApi } from '@/network/api/storage/settings/fetch-management-storage-settings-api'
import { EncryptedManagementStorageSettingsStorage } from '@/storage/storage-settings/encrypted-management-storage-settings-storage'

describe('ManagementStorageSettingsRepositoryImpl', () => {
  let mockApi: FetchManagementStorageSettingsApi
  let mockStorage: EncryptedManagementStorageSettingsStorage
  let mockWsService: WebSocketServiceMock
  let repository: ManagementStorageSettingsRepositoryImpl

  const mockSettingsPayload = createTestManagementStorageSettingsPayload()
  const mockSettings = toManagementStorageSettings(mockSettingsPayload)

  beforeEach(() => {
    mockApi = {
      getManagementStorageSettings: vi.fn().mockResolvedValue(appResultSuccess(mockSettingsPayload)),
      updateManagementStorageSettings: vi.fn().mockResolvedValue(appResultSuccess(mockSettingsPayload)),
      resetManagementStorageSettings: vi.fn().mockResolvedValue(appResultSuccess(mockSettingsPayload))
    } as unknown as FetchManagementStorageSettingsApi

    mockStorage = {
      getManagementStorageSettings: vi.fn().mockResolvedValue(null),
      updateManagementStorageSettings: vi.fn().mockResolvedValue(undefined),
      clearManagementStorageSettings: vi.fn().mockResolvedValue(undefined)
    } as unknown as EncryptedManagementStorageSettingsStorage

    mockWsService = new WebSocketServiceMock()

    repository = new ManagementStorageSettingsRepositoryImpl(mockApi, mockStorage, mockWsService)
  })

  it('fetches settings from network when cache and storage are empty', async () => {
    const settingsResult = await repository.getManagementStorageSettings()
    expect(mockStorage.getManagementStorageSettings).toHaveBeenCalled()
    expect(mockApi.getManagementStorageSettings).toHaveBeenCalled()
    expect(isSuccess(settingsResult)).toBe(true)
  })

  it('saves remote settings and updates storage', async () => {
    const saveResult = await repository.saveRemoteManagementStorageSettings(mockSettings)
    expect(mockApi.updateManagementStorageSettings).toHaveBeenCalled()
    expect(mockStorage.updateManagementStorageSettings).toHaveBeenCalledWith(mockSettings)
    expect(isSuccess(saveResult)).toBe(true)
  })

  it('resets remote settings and updates storage', async () => {
    const resetResult = await repository.resetRemoteManagementStorageSettings()
    expect(mockApi.resetManagementStorageSettings).toHaveBeenCalled()
    expect(mockStorage.updateManagementStorageSettings).toHaveBeenCalled()
    expect(isSuccess(resetResult)).toBe(true)
  })

  it('updates settings on WebSocket MANAGEMENT_STORAGE_SETTINGS_UPDATED event', async () => {
    const listener = vi.fn()
    repository.observeManagementStorageSettings(listener)

    mockWsService.emitFrameLocally({
      id: 'evt_1',
      type: StorageWebSocketEventTypes.MANAGEMENT_STORAGE_SETTINGS_UPDATED,
      payload: mockSettingsPayload,
      metadata: {},
      timestamp: Date.now()
    })

    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(mockStorage.updateManagementStorageSettings).toHaveBeenCalled()
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      minUploadSizeBytes: expect.any(Number)
    }))
  })
})
