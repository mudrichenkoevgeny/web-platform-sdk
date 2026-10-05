import { OpenSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

/** Password policy requirement constraints. */
export interface OpenPasswordPolicy {
  /** Minimum required password character length. */
  readonly minLength: number
  /** Whether password must contain at least one letter. */
  readonly requireLetter: boolean
  /** Whether password must contain at least one uppercase letter. */
  readonly requireUpperCase: boolean
  /** Whether password must contain at least one lowercase letter. */
  readonly requireLowerCase: boolean
  /** Whether password must contain at least one digit character. */
  readonly requireDigit: boolean
  /** Whether password must contain at least one special character. */
  readonly requireSpecialChar: boolean
}

/** One-time password confirmation constraints. */
export interface OtpConfirmation {
  /** Delay duration in seconds before requesting OTP resend. */
  readonly retryAfterSeconds: number
  /** Number of digit/symbol characters in OTP code. */
  readonly numberOfSymbols: number
  /** Validity duration in seconds before OTP code expires. */
  readonly expirationSeconds: number
}

/** Active open security settings domain model. */
export interface OpenSecuritySettings {
  /** Password policy validation configuration. */
  readonly openPasswordPolicy: OpenPasswordPolicy
  /** OTP code confirmation parameters. */
  readonly otpConfirmation: OtpConfirmation
}

/**
 * Maps an {@link OpenSecuritySettingsPayload} server response object into an {@link OpenSecuritySettings} domain model.
 *
 * @param payload - Raw API response payload
 * @returns Mapped domain model
 */
export const toOpenSecuritySettings = (payload: OpenSecuritySettingsPayload): OpenSecuritySettings => ({
  openPasswordPolicy: {
    minLength: payload.open_password_policy.min_length,
    requireLetter: payload.open_password_policy.require_letter,
    requireUpperCase: payload.open_password_policy.require_upper_case,
    requireLowerCase: payload.open_password_policy.require_lower_case,
    requireDigit: payload.open_password_policy.require_digit,
    requireSpecialChar: payload.open_password_policy.require_special_char
  },
  otpConfirmation: {
    retryAfterSeconds: payload.otp_confirmation.retry_after_seconds,
    numberOfSymbols: payload.otp_confirmation.number_of_symbols,
    expirationSeconds: payload.otp_confirmation.expiration_seconds
  }
})

/**
 * Maps an {@link OpenSecuritySettings} domain model into an {@link OpenSecuritySettingsPayload} server payload.
 *
 * @param settings - Security settings domain model
 * @returns Serialized API payload
 */
export const toOpenSecuritySettingsPayload = (settings: OpenSecuritySettings): OpenSecuritySettingsPayload => ({
  open_password_policy: {
    min_length: settings.openPasswordPolicy.minLength,
    require_letter: settings.openPasswordPolicy.requireLetter,
    require_upper_case: settings.openPasswordPolicy.requireUpperCase,
    require_lower_case: settings.openPasswordPolicy.requireLowerCase,
    require_digit: settings.openPasswordPolicy.requireDigit,
    require_special_char: settings.openPasswordPolicy.requireSpecialChar
  },
  otp_confirmation: {
    retry_after_seconds: settings.otpConfirmation.retryAfterSeconds,
    number_of_symbols: settings.otpConfirmation.numberOfSymbols,
    expiration_seconds: settings.otpConfirmation.expirationSeconds
  }
})
