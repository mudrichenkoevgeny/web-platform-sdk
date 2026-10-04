import { describe, it, expect } from 'vitest'
import type { ApiErrorResponse, UserId } from '@mudrichenkoevgeny/shared-foundation'
import { toServerError } from '@/error/mapper/toServerError'
import { generateErrorId } from '@/error/model/ErrorId'

describe('toServerError', () => {
  it('maps ApiErrorResponse to ServerError with valid id', () => {
    const validId = generateErrorId()
    const apiErrorResponse: ApiErrorResponse = {
      id: validId as unknown as UserId,
      code: 'USER_NOT_FOUND',
      message: 'User was not found',
      args: { userId: '123' }
    }

    const serverError = toServerError(apiErrorResponse, true)

    expect(serverError.id).toBe(validId)
    expect(serverError.code).toBe('USER_NOT_FOUND')
    expect(serverError.message).toBe('User was not found')
    expect(serverError.args).toEqual({ userId: '123' })
    expect(serverError.isRetryable).toBe(true)
  })

  it('generates new ErrorId if ApiErrorResponse id is invalid or missing', () => {
    const apiErrorResponse: ApiErrorResponse = {
      id: 'invalid-id' as unknown as UserId,
      code: 'SERVER_ERROR',
      message: 'Server failed',
      args: {}
    }

    const serverError = toServerError(apiErrorResponse)

    expect(serverError.id).not.toBe('invalid-id')
    expect(serverError.id).toBeDefined()
    expect(serverError.code).toBe('SERVER_ERROR')
    expect(serverError.isRetryable).toBe(false)
  })
})
