import { describe, it, expect, vi } from 'vitest'
import { isNoInternetException } from '@/network/utils/isNoInternetException'

describe('isNoInternetException', () => {
  it('returns true when navigator.onLine is false', () => {
    const originalNavigator = globalThis.navigator
    vi.stubGlobal('navigator', { onLine: false })

    expect(isNoInternetException(new Error('something'))).toBe(true)

    vi.stubGlobal('navigator', originalNavigator)
  })

  it('returns true for Error with failed to fetch message', () => {
    expect(isNoInternetException(new Error('Failed to fetch'))).toBe(true)
    expect(isNoInternetException(new Error('NetworkError when attempting to fetch resource'))).toBe(true)
  })

  it('returns false for generic errors when online', () => {
    const originalNavigator = globalThis.navigator
    vi.stubGlobal('navigator', { onLine: true })

    expect(isNoInternetException(new Error('Validation error'))).toBe(false)
    expect(isNoInternetException('plain string')).toBe(false)

    vi.stubGlobal('navigator', originalNavigator)
  })
})
