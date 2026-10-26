import { describe, it, expect, vi } from 'vitest'
import { appResultSuccess, WebSocketServiceMock, EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  SecurityWebSocketEventTypes,
  createTestOpenSecuritySettingsPayload,
  toOpenSecuritySettings
} from '@mudrichenkoevgeny/shared-foundation'
import { OpenSecuritySettingsRepositoryImpl } from '@/repository/open-security-settings-repository-impl'
import type { OpenSecuritySettingsApi } from '@/network/api/security-settings/open-security-settings-api'
import { EncryptedOpenSecuritySettingsStorage } from '@/storage/security-settings/encrypted-open-security-settings-storage'

describe('OpenSecuritySettingsRepositoryImpl', () => {
  const samplePayload = createTestOpenSecuritySettingsPayload()
  const sampleSettings = toOpenSecuritySettings(samplePayload)

  class MockApi implements OpenSecuritySettingsApi {
    public getSecuritySettingsCallCount = 0
    public async getSecuritySettings(): Promise<AppResult<typeof samplePayload, AppError>> {
      this.getSecuritySettingsCallCount++
      return appResultSuccess(samplePayload)
    }
  }

  it('loads from network if cache is empty', async () => {
    const api = new MockApi()
    const storage = new EncryptedOpenSecuritySettingsStorage(new EncryptedSettingsMock())
    const ws = new WebSocketServiceMock()

    const repo = new OpenSecuritySettingsRepositoryImpl(api, storage, ws)
    const result = await repo.getOpenSecuritySettings()

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(sampleSettings)
    }
    expect(api.getSecuritySettingsCallCount).toBe(1)
  })

  it('loads from storage without calling network if cache exists', async () => {
    const api = new MockApi()
    const storage = new EncryptedOpenSecuritySettingsStorage(new EncryptedSettingsMock())
    await storage.updateOpenSecuritySettings(sampleSettings)
    const ws = new WebSocketServiceMock()

    const repo = new OpenSecuritySettingsRepositoryImpl(api, storage, ws)
    const result = await repo.getOpenSecuritySettings()

    expect(result.success).toBe(true)
    expect(api.getSecuritySettingsCallCount).toBe(0)
  })

  it('forces network refresh when refreshOpenSecuritySettings is called', async () => {
    const api = new MockApi()
    const storage = new EncryptedOpenSecuritySettingsStorage(new EncryptedSettingsMock())
    await storage.updateOpenSecuritySettings(sampleSettings)
    const ws = new WebSocketServiceMock()

    const repo = new OpenSecuritySettingsRepositoryImpl(api, storage, ws)
    await repo.refreshOpenSecuritySettings()

    expect(api.getSecuritySettingsCallCount).toBe(1)
  })

  it('updates state and storage when WebSocket update is received', async () => {
    const api = new MockApi()
    const storage = new EncryptedOpenSecuritySettingsStorage(new EncryptedSettingsMock())
    const ws = new WebSocketServiceMock()

    const repo = new OpenSecuritySettingsRepositoryImpl(api, storage, ws)

    const observer = vi.fn()
    repo.observeOpenSecuritySettings(observer)

    await repo.getOpenSecuritySettings()

    const wsPayload = createTestOpenSecuritySettingsPayload({
      open_password_policy: {
        min_length: 12,
        require_letter: true,
        require_upper_case: true,
        require_lower_case: true,
        require_digit: true,
        require_special_char: false
      }
    })

    ws.emitFrameLocally({
      id: 'frame1',
      type: SecurityWebSocketEventTypes.OPEN_SECURITY_SETTINGS_UPDATED,
      payload: wsPayload,
      timestamp: Date.now()
    })

    const updatedSettings = await storage.getOpenSecuritySettings()
    expect(updatedSettings?.passwordPolicy.minLength).toBe(12)

    const currentResult = await repo.getOpenSecuritySettings()
    if (currentResult.success) {
      expect(currentResult.data.passwordPolicy.minLength).toBe(12)
    }

    expect(observer).toHaveBeenCalled()
  })
})
