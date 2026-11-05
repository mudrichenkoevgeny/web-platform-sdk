import { describe, it, expect } from 'vitest'
import {
  getAppErrorArgAsString,
  getAppErrorArgAsNumber
} from '@/error/parser/app-error-parser-utils'

describe('app-error-parser-utils', () => {
  describe('getAppErrorArgAsString', () => {
    it('returns null when args is undefined or null', () => {
      expect(getAppErrorArgAsString(undefined, 'key')).toBeNull()
      expect(getAppErrorArgAsString(null, 'key')).toBeNull()
    })

    it('returns trimmed string for string values', () => {
      expect(getAppErrorArgAsString({ key: '  hello  ' }, 'key')).toBe('hello')
      expect(getAppErrorArgAsString({ key: '   ' }, 'key')).toBeNull()
    })

    it('returns string representation for number and boolean values', () => {
      expect(getAppErrorArgAsString({ key: 42 }, 'key')).toBe('42')
      expect(getAppErrorArgAsString({ key: true }, 'key')).toBe('true')
      expect(getAppErrorArgAsString({ key: false }, 'key')).toBe('false')
    })

    it('returns null for object or array or missing values', () => {
      expect(getAppErrorArgAsString({ key: {} }, 'key')).toBeNull()
      expect(getAppErrorArgAsString({ key: [] }, 'key')).toBeNull()
      expect(getAppErrorArgAsString({}, 'key')).toBeNull()
    })
  })

  describe('getAppErrorArgAsNumber', () => {
    it('returns null when args is undefined or null', () => {
      expect(getAppErrorArgAsNumber(undefined, 'key')).toBeNull()
      expect(getAppErrorArgAsNumber(null, 'key')).toBeNull()
    })

    it('returns numeric value when value is a number', () => {
      expect(getAppErrorArgAsNumber({ key: 123 }, 'key')).toBe(123)
      expect(getAppErrorArgAsNumber({ key: 0 }, 'key')).toBe(0)
    })

    it('parses valid numeric string values', () => {
      expect(getAppErrorArgAsNumber({ key: '456.78' }, 'key')).toBe(456.78)
      expect(getAppErrorArgAsNumber({ key: 'invalid' }, 'key')).toBeNull()
    })

    it('returns null for non-numeric types or missing values', () => {
      expect(getAppErrorArgAsNumber({ key: true }, 'key')).toBeNull()
      expect(getAppErrorArgAsNumber({}, 'key')).toBeNull()
    })
  })
})
