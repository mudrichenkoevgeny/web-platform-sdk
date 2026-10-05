import { describe, it, expect } from 'vitest'
import { ApiException } from '@/error/model/api-exception'

describe('ApiException', () => {
  it('retains apiErrorResponse payload and prototype', () => {
    const payload = {
      id: '123e4567-e89b-12d3-a456-426614174000' as any,
      code: 'AUTH_FAILED',
      message: 'Invalid credentials',
      args: {}
    }
    const exception = new ApiException(payload)

    expect(exception).toBeInstanceOf(ApiException)
    expect(exception).toBeInstanceOf(Error)
    expect(exception.message).toBe('ApiException')
    expect(exception.apiErrorResponse).toBe(payload)
  })
})
