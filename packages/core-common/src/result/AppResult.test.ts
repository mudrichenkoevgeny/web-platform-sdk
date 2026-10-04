import { describe, it, expect, vi } from 'vitest'
import {
  appResultSuccess,
  appResultFailure,
  isSuccess,
  isFailure,
  foldResult,
  onSuccess,
  onError,
  flatMap,
  flatMapSuccess,
  mapSuccess
} from '@/result/AppResult'
import { CommonError } from '@/error/model/CommonError'
import { ClientCommonErrorCodes } from '@/error/naming/ClientCommonErrorCodes'

describe('AppResult', () => {
  it('appResultSuccess creates a success result', () => {
    const result = appResultSuccess('test-data')
    expect(result).toEqual({ success: true, data: 'test-data' })
  })

  it('appResultFailure creates a failure result', () => {
    const result = appResultFailure('test-error')
    expect(result).toEqual({ success: false, error: 'test-error' })
  })

  it('isSuccess returns true for success result', () => {
    const result = appResultSuccess(1)
    expect(isSuccess(result)).toBe(true)
  })

  it('isSuccess returns false for failure result', () => {
    const result = appResultFailure(1)
    expect(isSuccess(result)).toBe(false)
  })

  it('isFailure returns true for failure result', () => {
    const result = appResultFailure(1)
    expect(isFailure(result)).toBe(true)
  })

  it('isFailure returns false for success result', () => {
    const result = appResultSuccess(1)
    expect(isFailure(result)).toBe(false)
  })

  it('foldResult calls onSuccess for success result', () => {
    const result = appResultSuccess('test-data')
    const onSuccessFn = vi.fn()
    const onFailureFn = vi.fn()

    foldResult(result, onSuccessFn, onFailureFn)

    expect(onSuccessFn).toHaveBeenCalledWith('test-data')
    expect(onFailureFn).not.toHaveBeenCalled()
  })

  it('foldResult calls onFailure for failure result', () => {
    const result = appResultFailure('test-error')
    const onSuccessFn = vi.fn()
    const onFailureFn = vi.fn()

    foldResult(result, onSuccessFn, onFailureFn)

    expect(onFailureFn).toHaveBeenCalledWith('test-error')
    expect(onSuccessFn).not.toHaveBeenCalled()
  })

  it('onSuccess executes block and returns receiver on success', () => {
    const result = appResultSuccess('data')
    const block = vi.fn()

    const returned = onSuccess(result, block)

    expect(block).toHaveBeenCalledWith('data')
    expect(returned).toBe(result)
  })

  it('onSuccess does not execute block on failure', () => {
    const result = appResultFailure('error')
    const block = vi.fn()

    const returned = onSuccess(result, block)

    expect(block).not.toHaveBeenCalled()
    expect(returned).toBe(result)
  })

  it('onError executes block and returns receiver on failure', () => {
    const result = appResultFailure('error')
    const block = vi.fn()

    const returned = onError(result, block)

    expect(block).toHaveBeenCalledWith('error')
    expect(returned).toBe(result)
  })

  it('onError does not execute block on success', () => {
    const result = appResultSuccess('data')
    const block = vi.fn()

    const returned = onError(result, block)

    expect(block).not.toHaveBeenCalled()
    expect(returned).toBe(result)
  })

  it('flatMap transforms success to new result', () => {
    const result = appResultSuccess(2)
    const transformed = flatMap(result, data => appResultSuccess(data * 2))

    expect(transformed).toEqual({ success: true, data: 4 })
  })

  it('flatMap ignores failure and returns it', () => {
    const result = appResultFailure('error')
    const transformed = flatMap(result, (data: number) => appResultSuccess(data * 2))

    expect(transformed).toEqual({ success: false, error: 'error' })
  })

  it('flatMapSuccess aliases flatMap', () => {
    expect(flatMapSuccess).toBe(flatMap)
  })

  it('mapSuccess maps success data', () => {
    const result = appResultSuccess(5)
    const transformed = mapSuccess(result, data => data.toString())

    expect(transformed).toEqual({ success: true, data: '5' })
  })

  it('mapSuccess catches error and returns ContractViolation', () => {
    const result = appResultSuccess(5)
    const thrownError = new Error('test')

    const transformed = mapSuccess(result, () => {
      throw thrownError
    })

    expect(transformed.success).toBe(false)
    if (!transformed.success) {
      expect(transformed.error).toBeInstanceOf(CommonError)
      expect(transformed.error.code).toBe(ClientCommonErrorCodes.CONTRACT_VIOLATION)
    }
  })

  it('mapSuccess returns original failure', () => {
    const originalError = CommonError.unknown()
    const result = appResultFailure(originalError)

    const transformed = mapSuccess(result, (data: number) => data.toString())

    expect(transformed).toEqual({ success: false, error: originalError })
  })
})
