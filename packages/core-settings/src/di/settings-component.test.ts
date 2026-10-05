import { describe, it, expect } from 'vitest'
import {
  WebSocketServiceMock,
  HttpClient,
  EncryptedSettingsMock,
  DeviceInfoProviderMock
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SettingsComponent } from '@/di/settings-component'

describe('SettingsComponent', () => {
  it('initializes all modules and exposes dependencies', () => {
    const ws = new WebSocketServiceMock()
    const httpClient = new HttpClient({
      baseUrl: 'https://api.example.com',
      deviceInfoProvider: new DeviceInfoProviderMock()
    })
    const encryptedSettings = new EncryptedSettingsMock()

    const component = new SettingsComponent({
      webSocketService: ws,
      httpClient,
      encryptedSettings
    })

    expect(component.globalSettingsStorage).toBeDefined()
    expect(component.openGlobalSettingsApi).toBeDefined()
    expect(component.globalSettingsRepository).toBeDefined()
    expect(component.getOpenGlobalSettingsUseCase).toBeDefined()
    expect(component.refreshOpenGlobalSettingsUseCase).toBeDefined()
    expect(component.settingsWebSocketMessageHandler).toBeDefined()
  })
})
