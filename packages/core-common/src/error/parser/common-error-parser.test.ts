import { describe, it, expect } from 'vitest'
import { CommonErrorCodes, CommonErrorArgs } from '@mudrichenkoevgeny/shared-foundation'
import { CommonErrorParser } from '@/error/parser/common-error-parser'
import { CommonError } from '@/error/model/common-error'
import { ServerError } from '@/error/model/server-error'
import { generateErrorId } from '@/error/model/error-id'
import { ruStrings } from '@/locales/ru/strings'

describe('CommonErrorParser', () => {
  const parser = new CommonErrorParser()
  const ruParser = new CommonErrorParser(ruStrings)
  const dummyErrorId = generateErrorId()

  it('parses UNKNOWN error to internal error message (en & ru)', () => {
    const error = CommonError.unknown()
    expect(parser.parse(error)).toBe('An error has occurred.')
    expect(ruParser.parse(error)).toBe('Произошла ошибка.')
  })

  it('parses INTERNAL error to internal error message', () => {
    const error = CommonError.internal(new Error())
    expect(parser.parse(error)).toBe('An error has occurred.')
    expect(ruParser.parse(error)).toBe('Произошла ошибка.')
  })

  it('parses NOT_FOUND error with resource arg', () => {
    const error = new ServerError(dummyErrorId, CommonErrorCodes.NOT_FOUND, '', {
      [CommonErrorArgs.RESOURCE]: 'User'
    }, false)
    expect(parser.parse(error)).toBe('Resource "User" was not found.')
    expect(ruParser.parse(error)).toBe('Ресурс «User» не найден.')
  })

  it('parses NOT_FOUND error without resource arg (fallback)', () => {
    const error = new ServerError(dummyErrorId, CommonErrorCodes.NOT_FOUND, '', {}, false)
    expect(parser.parse(error)).toBe('Resource not found.')
    expect(ruParser.parse(error)).toBe('Ресурс не найден.')
  })

  it('parses SERVICE_UNAVAILABLE error', () => {
    const error = new ServerError(dummyErrorId, CommonErrorCodes.SERVICE_UNAVAILABLE, '', {}, true)
    expect(parser.parse(error)).toBe('The service is temporarily unavailable.')
    expect(ruParser.parse(error)).toBe('Сервис временно недоступен.')
  })

  it('parses TOO_MANY_REQUESTS error with retry_after_seconds arg', () => {
    const error = new ServerError(dummyErrorId, CommonErrorCodes.TOO_MANY_REQUESTS, '', {
      [CommonErrorArgs.RETRY_AFTER_SECONDS]: '30'
    }, true)
    expect(parser.parse(error)).toBe('Too many requests. Try again in 30 seconds.')
    expect(ruParser.parse(error)).toBe('Слишком много запросов. Повторите через 30 сек.')
  })

  it('parses MISSING_REQUIRED_PARAMETER error with arg', () => {
    const error = new ServerError(dummyErrorId, CommonErrorCodes.MISSING_REQUIRED_PARAMETER, '', {
      [CommonErrorArgs.PARAMETER_NAME]: 'userId'
    }, false)
    expect(parser.parse(error)).toBe('The required parameter "userId" is missing.')
    expect(ruParser.parse(error)).toBe('Отсутствует обязательный параметр «userId».')
  })

  it('parses MISSING_REQUIRED_FIELD error with arg', () => {
    const error = new ServerError(dummyErrorId, CommonErrorCodes.MISSING_REQUIRED_FIELD, '', {
      [CommonErrorArgs.FIELD_NAME]: 'email'
    }, false)
    expect(parser.parse(error)).toBe('The required field "email" is missing.')
    expect(ruParser.parse(error)).toBe('Отсутствует обязательное поле «email».')
  })

  it('parses NO_INTERNET_CONNECTION error', () => {
    const error = CommonError.noInternetConnection(new Error())
    expect(parser.parse(error)).toBe('No internet connection.')
    expect(ruParser.parse(error)).toBe('Отсутствует подключение к интернету.')
  })

  it('parses NETWORK error', () => {
    const error = CommonError.network(new Error())
    expect(parser.parse(error)).toBe('Network error.')
    expect(ruParser.parse(error)).toBe('Ошибка сети.')
  })

  it('returns unknown error message or custom error message for completely unknown error code', () => {
    const errorWithoutMsg = new ServerError(dummyErrorId, 'UNKNOWN_CUSTOM_CODE', '', {}, false)
    expect(parser.parse(errorWithoutMsg)).toBe('An unknown error has occurred.')
    expect(ruParser.parse(errorWithoutMsg)).toBe('Произошла неизвестная ошибка.')

    const errorWithMsg = new ServerError(dummyErrorId, 'UNKNOWN_CUSTOM_CODE', 'Custom error from server', {}, false)
    expect(parser.parse(errorWithMsg)).toBe('Custom error from server')
  })
})
