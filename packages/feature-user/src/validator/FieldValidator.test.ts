import { describe, it, expect } from 'vitest'
import { FieldValidator } from './FieldValidator'

describe('FieldValidator', () => {
  it('validates email addresses correctly', () => {
    expect(FieldValidator.isValidEmail('test@example.com')).toBe(true)
    expect(FieldValidator.isValidEmail('user.name+tag@sub.domain.org')).toBe(true)
    expect(FieldValidator.isValidEmail('invalid-email')).toBe(false)
    expect(FieldValidator.isValidEmail('')).toBe(false)
    expect(FieldValidator.isValidEmail(null)).toBe(false)
  })

  it('validates phone numbers correctly', () => {
    expect(FieldValidator.isValidPhone('+1234567890')).toBe(true)
    expect(FieldValidator.isValidPhone('+7 (999) 123-45-67')).toBe(true)
    expect(FieldValidator.isValidPhone('123')).toBe(false)
    expect(FieldValidator.isValidPhone('')).toBe(false)
    expect(FieldValidator.isValidPhone(null)).toBe(false)
  })

  it('validates TOTP codes correctly', () => {
    expect(FieldValidator.isValidTotp('123456')).toBe(true)
    expect(FieldValidator.isValidTotp('12345')).toBe(false)
    expect(FieldValidator.isValidTotp('1234567')).toBe(false)
    expect(FieldValidator.isValidTotp('abcdef')).toBe(false)
    expect(FieldValidator.isValidTotp(null)).toBe(false)
  })

  it('validates names correctly', () => {
    expect(FieldValidator.isValidName('John Doe')).toBe(true)
    expect(FieldValidator.isValidName('J')).toBe(false)
    expect(FieldValidator.isValidName('   ')).toBe(false)
    expect(FieldValidator.isValidName(null)).toBe(false)
  })
})
