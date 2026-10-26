import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { WebSocketService, SocketFrame } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  StorageWebSocketEventTypes,
  createTestOpenStorageSettingsPayload,
  createTestOpenStorageSettings,
  toOpenStorageSettings
} from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettingsApi } from '../../network/api/storage-settings/open-storage-settings-api'
import type { OpenStorageSettingsStorage } from '../../storage/storage-settings/open-storage-settings-storage'
import { OpenStorageSettingsRepositoryImpl } from './open-storage-settings-repository-impl'

describe('OpenStorageSettingsRepositoryImpl', () => {
  let mockApi: OpenStorageSettingsApi
  let mockStorage: OpenStorageSettingsStorage
  let mockWebSocketService: WebSocketService
  let wsCallback: ((frame: SocketFrame) => void) | null = null

  const mockPayload = createTestOpenStorageSettingsPayload()
  const mockDomainSettings = createTestOpenStorageSettings()

  beforeEach(() => {
    wsCallback = null

    mockApi = {
      getOpenStorageSettings: vi.fn().mockResolvedValue(appResultSuccess(mockPayload))
    }

    mockStorage = {
      getOpenStorageSettings: vi.fn().mockResolvedValue(null),
      updateOpenStorageSettings: vi.fn().mockResolvedValue(undefined),
      clearOpenStorageSettings: vi.fn().mockResolvedValue(undefined)
    }

    mockWebSocketService = {
      observeEvents: vi.fn((cb) => {
        wsCallback = cb
        return () => {}
      })
    } as unknown as WebSocketService
  })

  it('fetches settings from network when memory and cache are empty', async () => {
    const repo = new OpenStorageSettingsRepositoryImpl(mockApi, mockStorage, mockWebSocketService)
    const result = await repo.getOpenStorageSettings()

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockDomainSettings)
    }
  })

  it('uses cached settings if available in storage on preload', async () => {
    vi.mocked(mockStorage.getOpenStorageSettings).mockResolvedValue(mockDomainSettings)

    const repo = new OpenStorageSettingsRepositoryImpl(mockApi, mockStorage, mockWebSocketService)
    const result = await repo.getOpenStorageSettings()

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockDomainSettings)
    }
  })

  it('updates memory and storage on WS OPEN_STORAGE_SETTINGS_UPDATED event', async () => {
    const repo = new OpenStorageSettingsRepositoryImpl(mockApi, mockStorage, mockWebSocketService)
    await repo.getOpenStorageSettings()

    const updatedPayload = createTestOpenStorageSettingsPayload({
      min_upload_size_bytes: 1024,
      max_upload_size_bytes: 209715200
    })

    if (wsCallback) {
      wsCallback({
        id: 'frame-1',
        type: StorageWebSocketEventTypes.OPEN_STORAGE_SETTINGS_UPDATED,
        payload: updatedPayload,
        metadata: {},
        timestamp: Date.now()
      })
    }

    expect(mockStorage.updateOpenStorageSettings).toHaveBeenCalledWith(toOpenStorageSettings(updatedPayload))
  })
})
