import { describe, it, expect, vi } from 'vitest'
import { appResultSuccess, WebSocketServiceMock, EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  SettingsWebSocketEventTypes,
  createTestOpenGlobalSettingsPayload,
  createTestOpenGlobalSettings
} from '@mudrichenkoevgeny/shared-foundation'
import { OpenGlobalSettingsRepositoryImpl } from '@/repository/open-global-settings-repository-impl'
import type { OpenGlobalSettingsApi } from '@/network/api/global-settings/open-global-settings-api'
import { EncryptedOpenGlobalSettingsStorage } from '@/storage/global-settings/encrypted-open-global-settings-storage'

describe('OpenGlobalSettingsRepositoryImpl', () => {
  const samplePayload = createTestOpenGlobalSettingsPayload()
  const sampleSettings = createTestOpenGlobalSettings()

  class MockApi implements OpenGlobalSettingsApi {
    public getOpenGlobalSettingsCallCount = 0
    public async getOpenGlobalSettings(): Promise<AppResult<typeof samplePayload, AppError>> {
      this.getOpenGlobalSettingsCallCount++
      return appResultSuccess(samplePayload)
    }
  }

  it('loads from network if cache is empty', async () => {
    const api = new MockApi()
    const storage = new EncryptedOpenGlobalSettingsStorage(new EncryptedSettingsMock())
    const ws = new WebSocketServiceMock()

    const repo = new OpenGlobalSettingsRepositoryImpl(api, storage, ws)
    const result = await repo.getOpenGlobalSettings()

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(sampleSettings)
    }
    expect(api.getOpenGlobalSettingsCallCount).toBe(1)
  })

  it('loads from storage without calling network if cache exists', async () => {
    const api = new MockApi()
    const storage = new EncryptedOpenGlobalSettingsStorage(new EncryptedSettingsMock())
    await storage.updateOpenGlobalSettings(sampleSettings)
    const ws = new WebSocketServiceMock()

    const repo = new OpenGlobalSettingsRepositoryImpl(api, storage, ws)
    const result = await repo.getOpenGlobalSettings()

    expect(result.success).toBe(true)
    expect(api.getOpenGlobalSettingsCallCount).toBe(0)
  })

  it('forces network refresh when refreshOpenGlobalSettings is called', async () => {
    const api = new MockApi()
    const storage = new EncryptedOpenGlobalSettingsStorage(new EncryptedSettingsMock())
    await storage.updateOpenGlobalSettings(sampleSettings)
    const ws = new WebSocketServiceMock()

    const repo = new OpenGlobalSettingsRepositoryImpl(api, storage, ws)
    await repo.refreshOpenGlobalSettings()

    expect(api.getOpenGlobalSettingsCallCount).toBe(1)
  })

  it('updates state and storage when WebSocket update is received', async () => {
    const api = new MockApi()
    const storage = new EncryptedOpenGlobalSettingsStorage(new EncryptedSettingsMock())
    const ws = new WebSocketServiceMock()

    const repo = new OpenGlobalSettingsRepositoryImpl(api, storage, ws)

    const observer = vi.fn()
    repo.observeOpenGlobalSettings(observer)

    await repo.getOpenGlobalSettings()

    const wsPayload = createTestOpenGlobalSettingsPayload({
      privacy_policy_url: 'https://new.example.com/privacy'
    })

    ws.emitFrameLocally({
      id: 'frame1',
      type: SettingsWebSocketEventTypes.OPEN_GLOBAL_SETTINGS_UPDATED,
      payload: wsPayload,
      timestamp: Date.now()
    })

    const updatedSettings = await storage.getOpenGlobalSettings()
    expect(updatedSettings?.privacyPolicyUrl).toBe('https://new.example.com/privacy')

    const currentResult = await repo.getOpenGlobalSettings()
    if (currentResult.success) {
      expect(currentResult.data.privacyPolicyUrl).toBe('https://new.example.com/privacy')
    }

    expect(observer).toHaveBeenCalled()
  })
})
