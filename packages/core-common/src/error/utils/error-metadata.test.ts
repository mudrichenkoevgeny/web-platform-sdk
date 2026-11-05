import { describe, it, expect } from 'vitest'
import {
  getAppErrorRetryAfterSeconds,
  getAppErrorMfaToken,
  getAppErrorAccountLockoutType,
  getAppErrorTemporaryLockoutUntil
} from '@/error/utils/error-metadata'
import type { AppError } from '@/error/model/app-error'
import type { ErrorId } from '@/error/model/error-id'
import { AccountLockoutType } from '@mudrichenkoevgeny/shared-foundation'

describe('error-metadata', () => {
  it('extracts metadata values when present', () => {
    const error: AppError = {
      id: 'err-1' as ErrorId,
      code: 'TEST',
      isRetryable: true,
      retryAfterSeconds: 60,
      mfaToken: 'token-abc',
      lockoutType: AccountLockoutType.TEMPORARY,
      lockoutUntil: 1700000000000
    }

    expect(getAppErrorRetryAfterSeconds(error)).toBe(60)
    expect(getAppErrorMfaToken(error)).toBe('token-abc')
    expect(getAppErrorAccountLockoutType(error)).toBe(AccountLockoutType.TEMPORARY)
    expect(getAppErrorTemporaryLockoutUntil(error)).toBe(1700000000000)
  })

  it('returns default fallback values when metadata fields are missing', () => {
    const error: AppError = {
      id: 'err-2' as ErrorId,
      code: 'TEST_EMPTY',
      isRetryable: false
    }

    expect(getAppErrorRetryAfterSeconds(error)).toBe(0)
    expect(getAppErrorMfaToken(error)).toBeNull()
    expect(getAppErrorAccountLockoutType(error)).toBeNull()
    expect(getAppErrorTemporaryLockoutUntil(error)).toBeNull()
  })
})
