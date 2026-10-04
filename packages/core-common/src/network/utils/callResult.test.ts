import { describe, it, expect } from 'vitest'
import { UserId } from '@mudrichenkoevgeny/shared-foundation'
import { callResult } from './callResult'
import { ApiException } from '@/error/model/ApiException'
import { ServerError } from '@/error/model/ServerError'
import { CommonErrorNoInternetConnection, CommonErrorNetwork, CommonErrorContractViolation, CommonErrorInternal } from '@/error/model/CommonError'
import { isSuccess, isFailure } from '@/result/AppResult'

describe('callResult', () => {
  it('returns AppResultSuccess on successful call', async () => {
    const result = await callResult(async () => ({ id: 1 }))

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual({ id: 1 })
    }
  })

  it('maps ApiException to ServerError in AppResultFailure', async () => {
    const apiErrorResponse = {
      id: '123e4567-e89b-12d3-a456-426614174000' as unknown as UserId,
      code: 'UNAUTHORIZED',
      message: 'Not authorized',
      args: {}
    }
    const result = await callResult(async () => {
      throw new ApiException(apiErrorResponse)
    }, true)

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect((result.error as ServerError).code).toBe('UNAUTHORIZED')
      expect(result.error.isRetryable).toBe(true)
    }
  })

  it('maps TypeError / Failed to fetch to NoInternetConnection or Network', async () => {
    const networkError = new TypeError('Failed to fetch')
    const result = await callResult(async () => {
      throw networkError
    }, true)

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNoInternetConnection ||
        result.error instanceof CommonErrorNetwork
      ).toBe(true)
    }
  })

  it('maps SyntaxError to ContractViolation', async () => {
    const jsonError = new SyntaxError('Unexpected token in JSON')
    const result = await callResult(async () => {
      throw jsonError
    })

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(CommonErrorContractViolation)
    }
  })

  it('maps unknown Error to Internal error', async () => {
    const unknownError = new Error('Random failure')
    const result = await callResult(async () => {
      throw unknownError
    })

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(CommonErrorInternal)
    }
  })
})
