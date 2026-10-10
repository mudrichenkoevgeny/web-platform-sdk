import { SettingsComponent } from '@/di/settings-component'
import type { SettingsComponentConfig } from '@/di/settings-component'
import {
  WebSocketServiceMock,
  HttpClient,
  EncryptedSettingsMock,
  ClientDeviceInfoProviderMock
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenGlobalSettingsApiMock } from '@/mock/network/open-global-settings-api-mock'
import { OpenGlobalSettingsStorageMock } from '@/mock/storage/open-global-settings-storage-mock'
/**
 * Creates a pre-configured {@link SettingsComponent} instance for testing and Storybook preview purposes.
 *
 * @param config - Optional configuration overrides for the mock component
 * @returns Fully initialized {@link SettingsComponent}
 */
export const createMockSettingsComponent = (
  config?: Partial<SettingsComponentConfig>
): SettingsComponent => {
  const ws = config?.webSocketService ?? new WebSocketServiceMock()
  const httpClient = config?.httpClient ?? new HttpClient({
    baseUrl: 'https://api.example.com',
    clientDeviceInfoProvider: new ClientDeviceInfoProviderMock()
  })
  const encryptedSettings = config?.encryptedSettings ?? new EncryptedSettingsMock()

  return new SettingsComponent({
    webSocketService: ws,
    httpClient,
    encryptedSettings,
    openGlobalSettingsApi: config?.openGlobalSettingsApi ?? new OpenGlobalSettingsApiMock(),
    openGlobalSettingsStorage: config?.openGlobalSettingsStorage ?? new OpenGlobalSettingsStorageMock()
  })
}
