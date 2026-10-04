import { OpenGlobalSettings } from '@/domain/model/OpenGlobalSettings'

/**
 * Creates a mock {@link OpenGlobalSettings} object.
 *
 * @param overrides - Optional property overrides
 * @returns Mock open global settings instance
 */
export const openGlobalSettingsMock = (
  overrides?: Partial<OpenGlobalSettings>
): OpenGlobalSettings => ({
  privacyPolicyUrl: 'https://example.com/privacy',
  termsOfServiceUrl: 'https://example.com/terms',
  contactSupportEmail: 'support@example.com',
  minSupportedAppVersions: {
    android: '1.0.0',
    ios: '1.0.0'
  },
  ...overrides
})
