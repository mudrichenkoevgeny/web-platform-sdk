import { describe, it, expect } from 'vitest'
import { SecurityError } from '@/error/model/SecurityError'
import { ClientSecurityErrorCodes } from '@/error/naming/ClientSecurityErrorCodes'

describe('SecurityError', () => {
  it('creates passwordPolicyUnavailable error as a plain object', () => {
    const error = SecurityError.passwordPolicyUnavailable()
    expect(error.code).toBe(ClientSecurityErrorCodes.PASSWORD_POLICY_UNAVAILABLE)
    expect(error.isRetryable).toBe(true)
    expect(error.args).toBeNull()
    expect(error.id).toBeDefined()
  })

  it('creates passwordTooShort error with arguments', () => {
    const error = SecurityError.passwordTooShort(8)
    expect(error.code).toBe(ClientSecurityErrorCodes.PASSWORD_TOO_SHORT)
    expect(error.isRetryable).toBe(false)
    expect(error.args).toEqual({ passwordMinLength: '8' })
  })

  it('creates passwordTooShort error without minLength', () => {
    const error = SecurityError.passwordTooShort()
    expect(error.args).toBeNull()
  })

  it('creates passwordNoLetter error', () => {
    const error = SecurityError.passwordNoLetter()
    expect(error.code).toBe(ClientSecurityErrorCodes.PASSWORD_NO_LETTER)
  })

  it('creates passwordNoUpperCase error', () => {
    const error = SecurityError.passwordNoUpperCase()
    expect(error.code).toBe(ClientSecurityErrorCodes.PASSWORD_NO_UPPERCASE)
  })

  it('creates passwordNoLowerCase error', () => {
    const error = SecurityError.passwordNoLowerCase()
    expect(error.code).toBe(ClientSecurityErrorCodes.PASSWORD_NO_LOWERCASE)
  })

  it('creates passwordNoDigit error', () => {
    const error = SecurityError.passwordNoDigit()
    expect(error.code).toBe(ClientSecurityErrorCodes.PASSWORD_NO_DIGIT)
  })

  it('creates passwordNoSpecialChar error', () => {
    const error = SecurityError.passwordNoSpecialChar()
    expect(error.code).toBe(ClientSecurityErrorCodes.PASSWORD_NO_SPECIAL_CHAR)
  })

  it('creates passwordTooCommon error', () => {
    const error = SecurityError.passwordTooCommon()
    expect(error.code).toBe(ClientSecurityErrorCodes.PASSWORD_TOO_COMMON)
  })

  it('supports JSON serialization / deserialization without losing structure', () => {
    const original = SecurityError.passwordTooShort(12)
    const serialized = JSON.stringify(original)
    const deserialized = JSON.parse(serialized) as typeof original

    expect(deserialized).toEqual(original)
    expect(deserialized.code).toBe('PASSWORD_TOO_SHORT')
    expect(deserialized.args).toEqual({ passwordMinLength: '12' })
  })
})
