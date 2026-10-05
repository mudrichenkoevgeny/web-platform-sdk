import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { AvailableAuthProviders } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Creates a mock {@link AvailableAuthProviders} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock available auth providers
 */
export const availableAuthProvidersMock = (
  overrides?: Partial<AvailableAuthProviders>
): AvailableAuthProviders => ({
  primary: [UserAuthProvider.EMAIL],
  secondary: [UserAuthProvider.GOOGLE],
  ...overrides
})
