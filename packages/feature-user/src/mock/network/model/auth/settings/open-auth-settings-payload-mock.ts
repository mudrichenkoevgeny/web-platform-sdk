import { OpenAuthSettingsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { availableAuthProvidersPayloadMock } from '@/mock/network/model/auth/settings/availableAuthProvidersPayloadMock'

/**
 * Creates a mock {@link OpenAuthSettingsPayload} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock open auth settings payload
 */
export const openAuthSettingsPayloadMock = (
  overrides?: Partial<OpenAuthSettingsPayload>
): OpenAuthSettingsPayload => ({
  available_auth_providers: availableAuthProvidersPayloadMock(),
  max_total_identifiers: 5,
  max_email_identifiers: 2,
  max_phone_identifiers: 2,
  max_identifiers_per_external_provider: 2,
  is_registration_enabled: true,
  ...overrides
})
