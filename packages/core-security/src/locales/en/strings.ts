export interface CoreSecurityStrings {
  error_security_mfa_confirmation_required: string
  error_security_mfa_confirmation_required_args: (mfaToken: string) => string
  error_security_totp_already_enabled: string
  error_security_totp_not_enabled: string
  error_security_mfa_token_expired: string
  error_security_invalid_mfa_token: string
  error_security_invalid_totp_code: string
  error_security_recovery_code_used: string
  error_security_otp_retry_too_soon: string
  error_security_otp_retry_too_soon_args: (seconds: string | number) => string
  error_security_password_too_weak: string
  error_security_password_too_weak_args: (
    tooShort: boolean | string,
    minLength: string | number,
    noLetters: boolean | string,
    noUppercase: boolean | string,
    noLowercase: boolean | string,
    noDigits: boolean | string,
    noSpecialChars: boolean | string,
    tooCommon: boolean | string
  ) => string
  error_security_password_policy_unavailable: string
  error_security_password_too_short: string
  error_security_password_too_short_args: (minLength: string | number) => string
  error_security_password_no_letter: string
  error_security_password_no_uppercase: string
  error_security_password_no_lowercase: string
  error_security_password_no_digit: string
  error_security_password_no_special_char: string
  error_security_password_too_common: string
  error_security_ip_not_allowed: string
}

export const enSecurityStrings: CoreSecurityStrings = {
  error_security_mfa_confirmation_required: 'Authentication confirmation is required.',
  error_security_mfa_confirmation_required_args: (mfaToken: string) => `Authentication confirmation is required. MFA token: ${mfaToken}`,
  error_security_totp_already_enabled: 'Two-factor authentication is already enabled for this account.',
  error_security_totp_not_enabled: 'Two-factor authentication is not enabled for this account.',
  error_security_mfa_token_expired: 'The MFA token has expired. Please request a new one.',
  error_security_invalid_mfa_token: 'The MFA token is invalid or malformed.',
  error_security_invalid_totp_code: 'The provided code is invalid.',
  error_security_recovery_code_used: 'This recovery code has already been used.',
  error_security_otp_retry_too_soon: 'Too many attempts. Please try again later.',
  error_security_otp_retry_too_soon_args: (seconds: string | number) => `Too many attempts. Please try again in ${seconds} seconds.`,
  error_security_password_too_weak: 'Password is too weak.',
  error_security_password_too_weak_args: (
    tooShort: boolean | string,
    minLength: string | number,
    noLetters: boolean | string,
    noUppercase: boolean | string,
    noLowercase: boolean | string,
    noDigits: boolean | string,
    noSpecialChars: boolean | string,
    tooCommon: boolean | string
  ) => `Password is too weak. Too short: ${tooShort} (min: ${minLength}), No letters: ${noLetters}, No uppercase: ${noUppercase}, No lowercase: ${noLowercase}, No digits: ${noDigits}, No special chars: ${noSpecialChars}, Too common: ${tooCommon}.`,
  error_security_password_policy_unavailable: 'Failed to load password requirements. Please try again.',
  error_security_password_too_short: 'Password is too short.',
  error_security_password_too_short_args: (minLength: string | number) => `Password must be at least ${minLength} characters long.`,
  error_security_password_no_letter: 'Password must contain at least one letter.',
  error_security_password_no_uppercase: 'Password must contain at least one uppercase letter.',
  error_security_password_no_lowercase: 'Password must contain at least one lowercase letter.',
  error_security_password_no_digit: 'Password must contain at least one digit.',
  error_security_password_no_special_char: 'Password must contain at least one special character.',
  error_security_password_too_common: 'Password is too common and insecure.',
  error_security_ip_not_allowed: 'Request was rejected because the client IP address is not permitted.'
}
