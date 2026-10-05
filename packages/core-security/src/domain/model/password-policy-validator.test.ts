import { describe, it, expect } from 'vitest'
import { PasswordPolicyValidator } from '@/domain/model/password-policy-validator'
import type { OpenPasswordPolicy } from '@/domain/model/open-security-settings'

describe('PasswordPolicyValidator', () => {
  const validator = new PasswordPolicyValidator()

  const strictPolicy: OpenPasswordPolicy = {
    minLength: 8,
    requireLetter: true,
    requireUpperCase: true,
    requireLowerCase: true,
    requireDigit: true,
    requireSpecialChar: true
  }

  const relaxedPolicy: OpenPasswordPolicy = {
    minLength: 6,
    requireLetter: false,
    requireUpperCase: false,
    requireLowerCase: false,
    requireDigit: false,
    requireSpecialChar: false
  }

  it('validates successful password', () => {
    const result = validator.validate(strictPolicy, 'Valid123!')
    expect(result.success).toBe(true)
  })

  it('fails TOO_SHORT', () => {
    const result = validator.validate(strictPolicy, 'Val1!')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.reasons).toContain('TOO_SHORT')
    }
  })

  it('fails NO_LETTER', () => {
    const result = validator.validate(strictPolicy, '12345678!')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.reasons).toContain('NO_LETTER')
      expect(result.reasons).toContain('NO_UPPERCASE')
      expect(result.reasons).toContain('NO_LOWERCASE')
    }
  })

  it('fails NO_UPPERCASE', () => {
    const result = validator.validate(strictPolicy, 'valid123!')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.reasons).toContain('NO_UPPERCASE')
    }
  })

  it('fails NO_LOWERCASE', () => {
    const result = validator.validate(strictPolicy, 'VALID123!')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.reasons).toContain('NO_LOWERCASE')
    }
  })

  it('fails NO_DIGIT', () => {
    const result = validator.validate(strictPolicy, 'ValidPassword!')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.reasons).toContain('NO_DIGIT')
    }
  })

  it('fails NO_SPECIAL_CHAR', () => {
    const result = validator.validate(strictPolicy, 'Valid123')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.reasons).toContain('NO_SPECIAL_CHAR')
    }
  })

  it('passes relaxed policy with weak password', () => {
    const result = validator.validate(relaxedPolicy, '123456')
    expect(result.success).toBe(true)
  })

  it('returns multiple failure reasons simultaneously', () => {
    const result = validator.validate(strictPolicy, 'abc')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.reasons).toContain('TOO_SHORT')
      expect(result.reasons).toContain('NO_UPPERCASE')
      expect(result.reasons).toContain('NO_DIGIT')
      expect(result.reasons).toContain('NO_SPECIAL_CHAR')
    }
  })
})
