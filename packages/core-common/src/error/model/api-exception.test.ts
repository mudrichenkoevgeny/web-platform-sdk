import { describe, it, expect } from 'vitest'
import { ApiException } from '@/error/model/api-exception'
import { createTestApiErrorResponse } from '@mudrichenkoevgeny/shared-foundation'

describe('ApiException', () => {
  it('retains apiErrorResponse payload and prototype', () => {
    const payload = createTestApiErrorResponse({
      code: 'AUTH_FAILED',
      message: 'Invalid credentials',
      args: {}
    })
    const exception = new ApiException(payload)

    expect(exception).toBeInstanceOf(ApiException)
    expect(exception).toBeInstanceOf(Error)
    expect(exception.message).toBe('ApiException')
    expect(exception.apiErrorResponse).toBe(payload)
  })
})
