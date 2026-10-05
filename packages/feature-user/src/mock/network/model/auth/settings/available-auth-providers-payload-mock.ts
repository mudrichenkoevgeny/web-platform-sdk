import { AvailableAuthProvidersPayload } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Creates a mock {@link AvailableAuthProvidersPayload} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock available auth providers payload
 */
export const availableAuthProvidersPayloadMock = (
  overrides?: Partial<AvailableAuthProvidersPayload>
): AvailableAuthProvidersPayload => ({
  primary: ['email'],
  secondary: ['google'],
  ...overrides
})
