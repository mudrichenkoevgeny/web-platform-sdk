import { describe, it, expect } from 'vitest'
import {
  WebSocketServiceMock,
  HttpClient,
  EncryptedSettingsMock,
  DeviceInfoProviderMock
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SecurityComponent } from './SecurityComponent'

describe('SecurityComponent', () => {
  it('initializes all modules and exposes dependencies', () => {
    const ws = new WebSocketServiceMock()
    const httpClient = new HttpClient({
      baseUrl: 'https://api.example.com',
      deviceInfoProvider: new DeviceInfoProviderMock()
    })
    const encryptedSettings = new EncryptedSettingsMock()

    const component = new SecurityComponent({
      webSocketService: ws,
      httpClient,
      encryptedSettings
    })

    expect(component.securitySettingsStorage).toBeDefined()
    expect(component.openSecuritySettingsApi).toBeDefined()
    expect(component.securitySettingsRepository).toBeDefined()
    expect(component.passwordPolicyValidator).toBeDefined()
    expect(component.refreshSecuritySettingsUseCase).toBeDefined()
    expect(component.validatePasswordUseCase).toBeDefined()
    expect(component.securityWebSocketMessageHandler).toBeDefined()
  })
})
