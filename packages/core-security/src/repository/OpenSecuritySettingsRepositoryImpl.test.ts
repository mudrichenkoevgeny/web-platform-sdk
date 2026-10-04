import { describe, it, expect, vi } from 'vitest'
import { AppResult, AppError, WebSocketServiceMock, EncryptedSettingsMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { OpenSecuritySettingsRepositoryImpl } from './OpenSecuritySettingsRepositoryImpl'
import { OpenSecuritySettingsApi } from '@/network/securitysettings/OpenSecuritySettingsApi'
import { EncryptedOpenSecuritySettingsStorage } from '@/storage/securitysettings/EncryptedOpenSecuritySettingsStorage'
import { toOpenSecuritySettings } from '@/domain/model/OpenSecuritySettings'
import { SecurityWebSocketEventTypes } from '@/network/contract/SecurityWebSocketEventTypes'

describe('OpenSecuritySettingsRepositoryImpl', () => {
  const samplePayload: OpenSecuritySettingsPayload = {
    open_password_policy: {
      min_length: 8,
      require_letter: true,
      require_upper_case: true,
      require_lower_case: true,
      require_digit: true,
      require_special_char: false
    },
    otp_confirmation: {
      retry_after_seconds: 60,
      number_of_symbols: 6,
      expiration_seconds: 300
    }
  }

  const sampleSettings = toOpenSecuritySettings(samplePayload)

  class MockApi implements OpenSecuritySettingsApi {
    public getSecuritySettingsCallCount = 0
    public async getSecuritySettings(): Promise<AppResult<OpenSecuritySettingsPayload, AppError>> {
      this.getSecuritySettingsCallCount++
      return { success: true, data: samplePayload }
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

    // Wait for potential preload to finish so observer stabilizes
    await repo.getOpenSecuritySettings()

    const wsPayload: OpenSecuritySettingsPayload = {
      open_password_policy: { ...samplePayload.open_password_policy, min_length: 12 },
      otp_confirmation: samplePayload.otp_confirmation
    }

    ws.emitFrameLocally({
      id: 'frame1',
      type: SecurityWebSocketEventTypes.SECURITY_SETTINGS_UPDATED,
      payload: wsPayload,
      timestamp: Date.now()
    })

    const updatedSettings = await storage.getOpenSecuritySettings()
    expect(updatedSettings?.openPasswordPolicy.minLength).toBe(12)

    const currentResult = await repo.getOpenSecuritySettings()
    if (currentResult.success) {
      expect(currentResult.data.openPasswordPolicy.minLength).toBe(12)
    }

    expect(observer).toHaveBeenCalled()
  })
})
