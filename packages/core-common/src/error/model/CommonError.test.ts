import { describe, it, expect } from 'vitest'
import {
  CommonError,
  CommonErrorUnknown,
  CommonErrorInternal,
  CommonErrorNoInternetConnection,
  CommonErrorNetwork,
  CommonErrorContractViolation,
  CommonErrorLifecycle
} from '@/error/model/CommonError'

describe('CommonError', () => {
  it('creates unknown error', () => {
    const err = CommonError.unknown()
    expect(err).toBeInstanceOf(CommonErrorUnknown)
    expect(err.code).toBe('UNKNOWN')
    expect(err.isRetryable).toBe(false)
  })

  it('creates internal error', () => {
    const cause = new Error('fail')
    const err = CommonError.internal(cause)
    expect(err).toBeInstanceOf(CommonErrorInternal)
    expect(err.throwable).toBe(cause)
    expect(err.code).toBe('INTERNAL')
  })

  it('creates noInternetConnection error', () => {
    const err = CommonError.noInternetConnection('offline')
    expect(err).toBeInstanceOf(CommonErrorNoInternetConnection)
    expect(err.code).toBe('NO_INTERNET_CONNECTION')
    expect(err.isRetryable).toBe(true)
  })

  it('creates network error', () => {
    const err = CommonError.network('timeout')
    expect(err).toBeInstanceOf(CommonErrorNetwork)
    expect(err.code).toBe('NETWORK')
    expect(err.isRetryable).toBe(true)
  })

  it('creates contractViolation error', () => {
    const err = CommonError.contractViolation(undefined, { key: 'val' })
    expect(err).toBeInstanceOf(CommonErrorContractViolation)
    expect(err.code).toBe('CONTRACT_VIOLATION')
    expect(err.args).toEqual({ key: 'val' })
  })

  it('creates lifecycle error', () => {
    const err = CommonError.lifecycle('invalid state')
    expect(err).toBeInstanceOf(CommonErrorLifecycle)
    expect(err.code).toBe('LIFECYCLE_ERROR')
    expect(err.args).toEqual({ message: 'invalid state' })
  })
})
