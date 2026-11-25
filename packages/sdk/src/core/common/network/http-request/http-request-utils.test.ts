import { describe, it, expect } from 'vitest'
import { IS_PUBLIC_API_HEADER, markAsPublic } from './http-request-utils'

describe('http-request-utils', () => {
  it('adds IS_PUBLIC_API_HEADER to request init headers', () => {
    const init = markAsPublic({ method: 'GET' })
    expect(init.method).toBe('GET')
    const headers = new Headers(init.headers)
    expect(headers.get(IS_PUBLIC_API_HEADER)).toBe('true')
  })

  it('preserves existing headers when marking as public', () => {
    const init = markAsPublic({
      headers: { 'Content-Type': 'application/json' }
    })
    const headers = new Headers(init.headers)
    expect(headers.get(IS_PUBLIC_API_HEADER)).toBe('true')
    expect(headers.get('Content-Type')).toBe('application/json')
  })
})
