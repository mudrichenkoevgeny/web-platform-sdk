import { SettingsComponent } from '@/di/SettingsComponent'
import type { SettingsComponentConfig } from "@/di/SettingsComponent";
import {
  WebSocketServiceMock,
  HttpClient,
  EncryptedSettingsMock,
  DeviceInfoProviderMock
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenGlobalSettingsApiMock } from '@/network/OpenGlobalSettingsApiMock'
import { OpenGlobalSettingsStorageMock } from '@/storage/OpenGlobalSettingsStorageMock'
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
    deviceInfoProvider: new DeviceInfoProviderMock()
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
