import { describe, it, expect } from 'vitest'
import type { AppErrorParser } from '@/error/parser/app-error-parser'
import type { AppError } from '@/error/model/app-error'
import type { ErrorId } from '@/error/model/error-id'

describe('AppErrorParser', () => {
  it('allows implementation of parse method', () => {
    const customParser: AppErrorParser = {
      parse(error: AppError): string | null {
        if (error.code === 'TEST_ERROR') {
          return 'Test Error Message'
        }
        return null
      }
    }

    const matchingError: AppError = {
      id: 'id-1' as ErrorId,
      code: 'TEST_ERROR',
      isRetryable: false
    }

    const unknownError: AppError = {
      id: 'id-2' as ErrorId,
      code: 'UNKNOWN_ERROR',
      isRetryable: false
    }

    expect(customParser.parse(matchingError)).toBe('Test Error Message')
    expect(customParser.parse(unknownError)).toBeNull()
  })
})
