import { describe, it, expect } from 'vitest'
import { AppErrorParserBuilder, AppErrorParserResolver } from './AppErrorParserBuilder'
import { AppErrorParser } from './AppErrorParser'
import { CommonError } from '../model/CommonError'
import { AppError } from '../model/AppError'

describe('AppErrorParserBuilder', () => {
  const commonParser: AppErrorParser = {
    parse(error: AppError) {
      if (error.code === 'COMMON_ERROR') {
        return 'Common error message'
      }
      return 'Fallback error message'
    }
  }

  const specificParser: AppErrorParser = {
    parse(error: AppError) {
      if (error.code === 'SPECIFIC_ERROR') {
        return 'Specific error message'
      }
      return null
    }
  }

  it('builds AppErrorParserResolver', () => {
    const resolver = AppErrorParserBuilder.build(commonParser, [specificParser])
    expect(resolver).toBeInstanceOf(AppErrorParserResolver)
  })

  it('delegates to specificParsers first in order', () => {
    const resolver = AppErrorParserBuilder.build(commonParser, [specificParser])
    const specificError = CommonError.contractViolation(undefined, undefined, false)
    Object.defineProperty(specificError, 'code', { value: 'SPECIFIC_ERROR' })

    expect(resolver.parse(specificError)).toBe('Specific error message')
  })

  it('falls back to commonParser if no specific parser handles error', () => {
    const resolver = AppErrorParserBuilder.build(commonParser, [specificParser])
    const commonError = CommonError.unknown()
    Object.defineProperty(commonError, 'code', { value: 'COMMON_ERROR' })

    expect(resolver.parse(commonError)).toBe('Common error message')
  })
})
