import { describe, it, expect } from 'vitest'
import { SecurityErrorCodes, SecurityErrorArgs, CommonErrorArgs } from '@mudrichenkoevgeny/shared-foundation'
import { CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ErrorId } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { SecurityErrorParser } from '@/error/parser/SecurityErrorParser'
import { SecurityError } from '@/model/SecurityError'
import { enSecurityStrings, ruSecurityStrings } from '@/locales/index'
describe('SecurityErrorParser', () => {
  const parserEn = new SecurityErrorParser(enSecurityStrings)
  const parserRu = new SecurityErrorParser(ruSecurityStrings)

  it('parses client password policy validation errors', () => {
    expect(parserEn.parse(SecurityError.passwordPolicyUnavailable())).toBe(
      'Failed to load password requirements. Please try again.'
    )
    expect(parserEn.parse(SecurityError.passwordTooShort(10))).toBe(
      'Password must be at least 10 characters long.'
    )
    expect(parserEn.parse(SecurityError.passwordNoLetter())).toBe(
      'Password must contain at least one letter.'
    )
    expect(parserEn.parse(SecurityError.passwordNoUpperCase())).toBe(
      'Password must contain at least one uppercase letter.'
    )
    expect(parserEn.parse(SecurityError.passwordNoLowerCase())).toBe(
      'Password must contain at least one lowercase letter.'
    )
    expect(parserEn.parse(SecurityError.passwordNoDigit())).toBe(
      'Password must contain at least one digit.'
    )
    expect(parserEn.parse(SecurityError.passwordNoSpecialChar())).toBe(
      'Password must contain at least one special character.'
    )
    expect(parserEn.parse(SecurityError.passwordTooCommon())).toBe(
      'Password is too common and insecure.'
    )
  })

  it('supports dynamic language getter function for reactive localizations', () => {
    let currentLanguage = enSecurityStrings
    const dynamicParser = new SecurityErrorParser(() => currentLanguage)

    expect(dynamicParser.parse(SecurityError.passwordTooShort(8))).toBe(
      'Password must be at least 8 characters long.'
    )

    currentLanguage = ruSecurityStrings

    expect(dynamicParser.parse(SecurityError.passwordTooShort(8))).toBe(
      'Пароль должен содержать не менее 8 символов.'
    )
  })

  it('parses shared foundation security error codes', () => {
    const mfaError = {
      id: 'err-1' as ErrorId,
      code: SecurityErrorCodes.MFA_CONFIRMATION_REQUIRED,
      args: { [SecurityErrorArgs.MFA_TOKEN]: 'token-123' },
      isRetryable: false
    } as const

    expect(parserEn.parse(mfaError)).toBe('Authentication confirmation is required. MFA token: token-123')
    expect(parserRu.parse(mfaError)).toBe('Требуется подтверждение аутентификации. Токен MFA: token-123')

    const otpError = {
      id: 'err-2' as ErrorId,
      code: SecurityErrorCodes.OTP_RETRY_TOO_SOON,
      args: { [CommonErrorArgs.RETRY_AFTER_SECONDS]: '60' },
      isRetryable: true
    } as const

    expect(parserEn.parse(otpError)).toBe('Too many attempts. Please try again in 60 seconds.')

    const totpAlreadyEnabled = {
      id: 'err-3' as ErrorId,
      code: SecurityErrorCodes.TOTP_ALREADY_ENABLED,
      args: null,
      isRetryable: false
    } as const

    expect(parserEn.parse(totpAlreadyEnabled)).toBe('Two-factor authentication is already enabled for this account.')
  })

  it('returns null for unhandled non-security error codes', () => {
    expect(parserEn.parse(CommonError.unknown())).toBeNull()
  })
})
