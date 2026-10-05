import { describe, it, expect } from 'vitest'
import { generateErrorId, toErrorIdOrNull, toErrorIdOrThrow } from '@/error/model/error-id'

describe('ErrorId', () => {
  it('generateErrorId creates a valid ErrorId UUID', () => {
    const errorId = generateErrorId()
    expect(toErrorIdOrNull(errorId)).toBe(errorId)
  })

  it('toErrorIdOrNull returns ErrorId for valid UUID string', () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000'
    expect(toErrorIdOrNull(validUuid)).toBe(validUuid)
  })

  it('toErrorIdOrNull returns null for null, undefined or empty string', () => {
    expect(toErrorIdOrNull(null)).toBeNull()
    expect(toErrorIdOrNull(undefined)).toBeNull()
    expect(toErrorIdOrNull('')).toBeNull()
    expect(toErrorIdOrNull('   ')).toBeNull()
  })

  it('toErrorIdOrNull returns null for invalid UUID string', () => {
    expect(toErrorIdOrNull('invalid-uuid')).toBeNull()
  })

  it('toErrorIdOrThrow returns ErrorId for valid UUID string', () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000'
    expect(toErrorIdOrThrow(validUuid)).toBe(validUuid)
  })

  it('toErrorIdOrThrow throws Error for invalid UUID string', () => {
    expect(() => toErrorIdOrThrow('invalid-uuid')).toThrow('Invalid ErrorId UUID format: invalid-uuid')
  })
})
