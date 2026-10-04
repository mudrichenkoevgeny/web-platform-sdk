import { CommonComponent, CommonComponentConfig } from '@/di/CommonComponent'
import { EncryptedSettingsMock } from '@/storage/EncryptedSettingsMock'
import { AccessTokenProviderMock } from '@/network/AccessTokenProviderMock'

/**
 * Creates a pre-configured {@link CommonComponent} instance for testing and Storybook preview purposes.
 *
 * @param config - Optional configuration overrides for the mock component
 * @returns Fully initialized {@link CommonComponent}
 */
export const createMockCommonComponent = (
  config?: Partial<CommonComponentConfig>
): CommonComponent => {
  const settings = config?.encryptedSettings ?? new EncryptedSettingsMock()
  const tokenProvider = config?.accessTokenProvider ?? new AccessTokenProviderMock('mock-token')
  const component = new CommonComponent({
    encryptedSettings: settings,
    baseUrl: config?.baseUrl ?? 'https://api.example.com',
    webSocketPath: config?.webSocketPath ?? '/ws',
    accessTokenProvider: tokenProvider,
    deviceInfoProvider: config?.deviceInfoProvider,
    appVersion: config?.appVersion,
    httpClientConfigPlugins: config?.httpClientConfigPlugins,
    customFetch: config?.customFetch,
    webSocketFactory: config?.webSocketFactory,
    logger: config?.logger
  })
  component.init()
  return component
}
