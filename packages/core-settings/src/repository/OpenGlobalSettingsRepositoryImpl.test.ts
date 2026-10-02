import { describe, it, expect, vi } from 'vitest'
import { AppResult, AppError, WebSocketServiceMock, EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { OpenGlobalSettingsRepositoryImpl } from './OpenGlobalSettingsRepositoryImpl'
import { OpenGlobalSettingsApi } from '../network/globalsettings/OpenGlobalSettingsApi'
import { EncryptedOpenGlobalSettingsStorage } from '../storage/globalsettings/EncryptedOpenGlobalSettingsStorage'
import { toOpenGlobalSettings } from '../domain/model/OpenGlobalSettings'
import { SettingsWebSocketEventTypes } from '../network/contract/SettingsWebSocketEventTypes'

describe('OpenGlobalSettingsRepositoryImpl', () => {
  const samplePayload: OpenGlobalSettingsPayload = {
    privacy_policy_url: 'https://example.com/privacy',
    terms_of_service_url: 'https://example.com/terms',
    contact_support_email: 'support@example.com',
    min_supported_app_versions: {
      android: '1.0.0',
      ios: '1.0.0'
    }
  }

  const sampleSettings = toOpenGlobalSettings(samplePayload)

  class MockApi implements OpenGlobalSettingsApi {
    public getOpenGlobalSettingsCallCount = 0
    public async getOpenGlobalSettings(): Promise<AppResult<OpenGlobalSettingsPayload, AppError>> {
      this.getOpenGlobalSettingsCallCount++
      return { success: true, data: samplePayload }
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

    await repo.getOpenGlobalSettings() // Wait for preload

    const wsPayload: OpenGlobalSettingsPayload = {
      ...samplePayload,
      privacy_policy_url: 'https://new.example.com/privacy'
    }

    ws.emitFrameLocally({
      id: 'frame1',
      type: SettingsWebSocketEventTypes.GLOBAL_SETTINGS_UPDATED,
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
