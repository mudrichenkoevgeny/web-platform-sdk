import type { OtpConfirmationPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Creates a mock {@link OtpConfirmationPayload} instance for testing. */
export const otpConfirmationPayloadMock = (
  overrides?: Partial<OtpConfirmationPayload>
): OtpConfirmationPayload => ({
  retry_after_seconds: 60,
  number_of_symbols: 6,
  expiration_seconds: 300,
  ...overrides
})
