import { describe, it, expect, vi, afterEach } from 'vitest'
import { generateUuid } from './uuid-utils'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('generateUuid', () => {
  const originalCrypto = globalThis.crypto

  afterEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(globalThis, 'crypto', {
      value: originalCrypto,
      writable: true,
      configurable: true
    })
  })

  it('generates valid UUID v4 format using native crypto.randomUUID when available', () => {
    const uuid = generateUuid()
    expect(uuid).toMatch(UUID_REGEX)
  })

  it('generates distinct UUIDs across multiple calls', () => {
    const uuid1 = generateUuid()
    const uuid2 = generateUuid()
    expect(uuid1).not.toBe(uuid2)
  })

  it('falls back to custom PRNG algorithm when crypto.randomUUID is unavailable', () => {
    Object.defineProperty(globalThis, 'crypto', {
      value: undefined,
      writable: true,
      configurable: true
    })

    const uuid = generateUuid()
    expect(uuid).toMatch(UUID_REGEX)
  })
})
