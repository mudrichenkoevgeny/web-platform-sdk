import { describe, it, expect } from 'vitest'
import { UserErrorCodes, UserErrorArgs, UserModuleStrings, CommonLocales } from '@mudrichenkoevgeny/shared-foundation'
import { CommonError, generateErrorId } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserErrorParser } from '@/error/parser/user-error-parser'
import { UserError } from '@/error/model/user-error'

describe('UserErrorParser', () => {
  const parserEn = new UserErrorParser(new UserModuleStrings(undefined, CommonLocales.ENGLISH))
  const parserRu = new UserErrorParser(new UserModuleStrings(undefined, CommonLocales.RUSSIAN))

  it('parses client user feature errors', () => {
    expect(parserEn.parse(UserError.invalidRefreshToken())).toBe('The session is invalid. Please log in again.')
    expect(parserEn.parse(UserError.registrationDisabled())).toBe('Registration is currently disabled.')
    expect(parserEn.parse(UserError.externalAuthCancelled())).toBe('Authentication was cancelled.')
    expect(parserEn.parse(UserError.externalAuthFailed())).toBe('External authentication failed.')
    expect(parserEn.parse(UserError.tooManyConfirmationRequests(60))).toBe('Too many requests. Try again in 60 seconds.')
    expect(parserRu.parse(UserError.externalAuthCancelled())).toBe('Авторизация была отменена.')
  })

  it('parses shared foundation user error codes', () => {
    const invalidTokenError = {
      id: generateErrorId(),
      code: UserErrorCodes.INVALID_ACCESS_TOKEN,
      args: null,
      isRetryable: false
    } as const

    expect(parserEn.parse(invalidTokenError)).toBe('The session is invalid. Please log in again.')
    expect(parserRu.parse(invalidTokenError)).toBe('Сессия недействительна. Пожалуйста, войдите снова.')

    const lockedUntilError = {
      id: generateErrorId(),
      code: UserErrorCodes.USER_LOCKED,
      args: { [UserErrorArgs.TEMPORARY_LOCKOUT_UNTIL]: String(Date.UTC(2026, 0, 1, 12, 0)) },
      isRetryable: false
    } as const

    expect(parserEn.parse(lockedUntilError)).toContain('This account has been locked')
  })

  it('parses identifier limit errors with arguments', () => {
    const limitError = {
      id: generateErrorId(),
      code: UserErrorCodes.USER_IDENTIFIER_LIMIT_REACHED,
      args: {
        [UserErrorArgs.USER_AUTH_PROVIDER]: 'GOOGLE',
        [UserErrorArgs.MAX_NUMBER_OF_IDENTIFIERS]: '3'
      },
      isRetryable: false
    } as const

    expect(parserEn.parse(limitError)).toBe("The limit of 3 sign-in methods for 'External Provider' has been reached.")
  })

  it('returns null for unhandled errors', () => {
    expect(parserEn.parse(CommonError.unknown())).toBeNull()
  })
})
