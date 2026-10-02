import { describe, it, expect } from 'vitest'
import { ServerError } from './ServerError'
import { generateErrorId } from './ErrorId'

describe('ServerError', () => {
  it('constructs server error with args defaulting to empty object', () => {
    const id = generateErrorId()
    const error = new ServerError(id, 'ERR_CODE', 'Server message')

    expect(error.id).toBe(id)
    expect(error.code).toBe('ERR_CODE')
    expect(error.message).toBe('Server message')
    expect(error.args).toEqual({})
    expect(error.isRetryable).toBe(false)
  })
})
