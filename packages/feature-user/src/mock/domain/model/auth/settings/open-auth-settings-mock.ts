import type { OpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import { availableAuthProvidersMock } from '@/mock/domain/model/auth/settings/available-auth-providers-mock'

/**
 * Creates a mock {@link OpenAuthSettings} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock open auth settings
 */
export const openAuthSettingsMock = (
  overrides?: Partial<OpenAuthSettings>
): OpenAuthSettings => ({
  availableAuthProviders: availableAuthProvidersMock(),
  maxTotalIdentifiers: 5,
  maxEmailIdentifiers: 2,
  maxPhoneIdentifiers: 2,
  maxIdentifiersPerExternalProvider: 2,
  isRegistrationEnabled: true,
  ...overrides
})
