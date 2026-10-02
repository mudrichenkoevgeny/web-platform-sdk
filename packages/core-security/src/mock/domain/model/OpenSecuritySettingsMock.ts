import {
  OpenPasswordPolicy,
  OtpConfirmation,
  OpenSecuritySettings
} from '../../../domain/model/OpenSecuritySettings'

/**
 * Creates a mock {@link OpenPasswordPolicy} object.
 *
 * @param overrides - Optional property overrides
 * @returns Mock open password policy instance
 */
export const openPasswordPolicyMock = (
  overrides?: Partial<OpenPasswordPolicy>
): OpenPasswordPolicy => ({
  minLength: 8,
  requireLetter: true,
  requireUpperCase: true,
  requireLowerCase: true,
  requireDigit: true,
  requireSpecialChar: true,
  ...overrides
})

/**
 * Creates a mock {@link OtpConfirmation} object.
 *
 * @param overrides - Optional property overrides
 * @returns Mock OTP confirmation instance
 */
export const otpConfirmationMock = (
  overrides?: Partial<OtpConfirmation>
): OtpConfirmation => ({
  retryAfterSeconds: 60,
  numberOfSymbols: 6,
  expirationSeconds: 300,
  ...overrides
})

/**
 * Creates a mock {@link OpenSecuritySettings} object.
 *
 * @param overrides - Optional property overrides for child objects
 * @returns Mock open security settings instance
 */
export const openSecuritySettingsMock = (overrides?: {
  openPasswordPolicy?: Partial<OpenPasswordPolicy>
  otpConfirmation?: Partial<OtpConfirmation>
}): OpenSecuritySettings => ({
  openPasswordPolicy: openPasswordPolicyMock(overrides?.openPasswordPolicy),
  otpConfirmation: otpConfirmationMock(overrides?.otpConfirmation)
})
