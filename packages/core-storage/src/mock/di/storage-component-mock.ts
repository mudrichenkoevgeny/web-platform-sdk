import { StorageComponent } from '@/di/storage-component'
import type { StorageComponentConfig } from '@/di/storage-component'
import {
  WebSocketServiceMock,
  HttpClient,
  EncryptedSettingsMock,
  ClientDeviceInfoProviderMock
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenStorageSettingsApiMock } from '@/mock/network/open-storage-settings-api-mock'
import { OpenStorageSettingsStorageMock } from '@/mock/storage/open-storage-settings-storage-mock'

/**
 * Creates a pre-configured {@link StorageComponent} instance for testing and Storybook preview purposes.
 *
 * @param config - Optional configuration overrides for the mock component
 * @returns Fully initialized {@link StorageComponent}
 */
export const createMockStorageComponent = (
  config?: Partial<StorageComponentConfig>
): StorageComponent => {
  const ws = config?.webSocketService ?? new WebSocketServiceMock()
  const httpClient = config?.httpClient ?? new HttpClient({
    baseUrl: 'https://api.example.com',
    clientDeviceInfoProvider: new ClientDeviceInfoProviderMock()
  })
  const encryptedSettings = config?.encryptedSettings ?? new EncryptedSettingsMock()

  return new StorageComponent({
    webSocketService: ws,
    httpClient,
    encryptedSettings,
    openStorageSettingsApi: config?.openStorageSettingsApi ?? new OpenStorageSettingsApiMock(),
    openStorageSettingsStorage: config?.openStorageSettingsStorage ?? new OpenStorageSettingsStorageMock()
  })
}
