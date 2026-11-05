import { describe, it, expect } from 'vitest'
import type { AppError } from '@/error/model/app-error'
import type { ErrorId } from '@/error/model/error-id'
import { AccountLockoutType } from '@mudrichenkoevgeny/shared-foundation'

describe('AppError', () => {
  it('instantiates object matching AppError interface structure', () => {
    const error: AppError = {
      id: 'test-error-id' as ErrorId,
      code: 'TEST_CODE',
      args: { key: 'val' },
      isRetryable: true,
      retryAfterSeconds: 30,
      mfaToken: 'mfa-123',
      lockoutType: AccountLockoutType.TEMPORARY,
      lockoutUntil: 1600000000000
    }

    expect(error.id).toBe('test-error-id')
    expect(error.code).toBe('TEST_CODE')
    expect(error.args).toEqual({ key: 'val' })
    expect(error.isRetryable).toBe(true)
    expect(error.retryAfterSeconds).toBe(30)
    expect(error.mfaToken).toBe('mfa-123')
    expect(error.lockoutType).toBe(AccountLockoutType.TEMPORARY)
    expect(error.lockoutUntil).toBe(1600000000000)
  })
})
