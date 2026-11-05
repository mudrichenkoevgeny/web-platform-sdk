import { describe, it, expect } from 'vitest'
import { AppErrorParserMock } from '@/mock/error/app-error-parser-mock'
import { CommonError } from '@/error/model/common-error'

describe('AppErrorParserMock', () => {
  it('AppErrorParserMock parses registered codes and fallback', () => {
    const parser = new AppErrorParserMock('Default Fallback')
    parser.mockParseForCode('UNKNOWN', 'Custom Unknown')

    expect(parser.parse(CommonError.unknown())).toBe('Custom Unknown')
    expect(parser.parse(CommonError.network('err'))).toBe('Default Fallback')
  })
})
