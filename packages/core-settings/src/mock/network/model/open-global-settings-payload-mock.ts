import { OpenGlobalSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Creates a mock {@link OpenGlobalSettingsPayload} matching server response structures.
 *
 * @param overrides - Optional property overrides
 * @returns Mock open global settings payload
 */
export const openGlobalSettingsPayloadMock = (
  overrides?: Partial<OpenGlobalSettingsPayload>
): OpenGlobalSettingsPayload => ({
  privacy_policy_url: 'https://example.com/privacy',
  terms_of_service_url: 'https://example.com/terms',
  contact_support_email: 'support@example.com',
  min_supported_app_versions: {
    android: '1.0.0',
    ios: '1.0.0'
  },
  ...overrides
})
