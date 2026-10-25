import { describe, it, expect } from 'vitest'
import {
  WebSocketServiceMock,
  HttpClient,
  EncryptedSettingsMock,
  ClientDeviceInfoProviderMock
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageComponent } from './storage-component'

describe('StorageComponent', () => {
  it('instantiates all dependencies correctly', () => {
    const ws = new WebSocketServiceMock()
    const httpClient = new HttpClient({
      baseUrl: 'https://api.example.com',
      clientDeviceInfoProvider: new ClientDeviceInfoProviderMock()
    })
    const encryptedSettings = new EncryptedSettingsMock()

    const component = new StorageComponent({
      webSocketService: ws,
      httpClient,
      encryptedSettings
    })

    expect(component.storageSettingsStorage).toBeDefined()
    expect(component.openStorageSettingsApi).toBeDefined()
    expect(component.storageSettingsRepository).toBeDefined()
    expect(component.getOpenStorageSettingsUseCase).toBeDefined()
    expect(component.refreshOpenStorageSettingsUseCase).toBeDefined()
    expect(component.storageWebSocketMessageHandler).toBeDefined()
  })
})
