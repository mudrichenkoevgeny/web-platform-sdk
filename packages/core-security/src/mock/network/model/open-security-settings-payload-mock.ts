import type { OpenSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Creates a mock {@link OpenSecuritySettingsPayload} matching server response structures.
 *
 * @param overrides - Optional property overrides
 * @returns Mock open security settings payload
 */
export const openSecuritySettingsPayloadMock = (
  overrides?: Partial<OpenSecuritySettingsPayload>
): OpenSecuritySettingsPayload => ({
  open_password_policy: {
    min_length: 8,
    require_letter: true,
    require_upper_case: true,
    require_lower_case: true,
    require_digit: true,
    require_special_char: true,
    ...(overrides?.open_password_policy ?? {})
  },
  otp_confirmation: {
    retry_after_seconds: 60,
    number_of_symbols: 6,
    expiration_seconds: 300,
    ...(overrides?.otp_confirmation ?? {})
  },
  ...overrides
})
