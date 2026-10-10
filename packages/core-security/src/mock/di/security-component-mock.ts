import { SecurityComponent } from '@/di/security-component'
import type { SecurityComponentConfig } from '@/di/security-component'
import {
  WebSocketServiceMock,
  HttpClient,
  EncryptedSettingsMock,
  ClientDeviceInfoProviderMock
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenSecuritySettingsApiMock } from '@/mock/network/open-security-settings-api-mock'
import { OpenSecuritySettingsStorageMock } from '@/mock/storage/open-security-settings-storage-mock'
/**
 * Creates a pre-configured {@link SecurityComponent} instance for testing and Storybook preview purposes.
 *
 * @param config - Optional configuration overrides for the mock component
 * @returns Fully initialized {@link SecurityComponent}
 */
export const createMockSecurityComponent = (
  config?: Partial<SecurityComponentConfig>
): SecurityComponent => {
  const ws = config?.webSocketService ?? new WebSocketServiceMock()
  const httpClient = config?.httpClient ?? new HttpClient({
    baseUrl: 'https://api.example.com',
    clientDeviceInfoProvider: new ClientDeviceInfoProviderMock()
  })
  const encryptedSettings = config?.encryptedSettings ?? new EncryptedSettingsMock()

  return new SecurityComponent({
    webSocketService: ws,
    httpClient,
    encryptedSettings,
    openSecuritySettingsApi: config?.openSecuritySettingsApi ?? new OpenSecuritySettingsApiMock(),
    openSecuritySettingsStorage: config?.openSecuritySettingsStorage ?? new OpenSecuritySettingsStorageMock(),
    passwordPolicyValidator: config?.passwordPolicyValidator
  })
}
