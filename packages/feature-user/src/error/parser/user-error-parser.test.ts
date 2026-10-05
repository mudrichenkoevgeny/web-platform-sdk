import { describe, it, expect } from 'vitest'
import { UserErrorCodes, UserErrorArgs } from '@mudrichenkoevgeny/shared-foundation'
import { CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ErrorId } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { UserErrorParser } from '@/error/parser/user-error-parser'
import { UserError } from '@/error/model/user-error'
import { enUserStrings, ruUserStrings } from '@/locales/index'
describe('UserErrorParser', () => {
  const parserEn = new UserErrorParser(enUserStrings)
  const parserRu = new UserErrorParser(ruUserStrings)

  it('parses client user feature errors', () => {
    expect(parserEn.parse(UserError.invalidRefreshToken())).toBe('The refresh token is invalid.')
    expect(parserEn.parse(UserError.registrationDisabled())).toBe('Registration is currently disabled')
  })

  it('parses shared foundation user error codes', () => {
    const invalidTokenError = {
      id: 'err-1' as ErrorId,
      code: UserErrorCodes.INVALID_ACCESS_TOKEN,
      args: null,
      isRetryable: false
    } as const

    expect(parserEn.parse(invalidTokenError)).toBe('The access token is invalid.')
    expect(parserRu.parse(invalidTokenError)).toBe('Токен доступа недействителен.')

    const lockedUntilError = {
      id: 'err-2' as ErrorId,
      code: UserErrorCodes.USER_LOCKED,
      args: { [UserErrorArgs.TEMPORARY_LOCKOUT_UNTIL]: String(Date.UTC(2026, 0, 1, 12, 0)) },
      isRetryable: false
    } as const

    expect(parserEn.parse(lockedUntilError)).toContain('This account has been locked until')
  })

  it('parses identifier limit errors with arguments', () => {
    const limitError = {
      id: 'err-3' as ErrorId,
      code: UserErrorCodes.USER_IDENTIFIER_LIMIT_REACHED,
      args: {
        [UserErrorArgs.USER_AUTH_PROVIDER]: 'GOOGLE',
        [UserErrorArgs.MAX_NUMBER_OF_IDENTIFIERS]: '3'
      },
      isRetryable: false
    } as const

    expect(parserEn.parse(limitError)).toBe('The limit of 3 identifiers for "GOOGLE" has been reached.')
  })

  it('returns null for unhandled errors', () => {
    expect(parserEn.parse(CommonError.unknown())).toBeNull()
  })
})
