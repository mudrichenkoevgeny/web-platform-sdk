import { CommonErrorCodes, CommonErrorArgs, ClientCommonErrorCodes, CommonModuleStrings, commonStrings } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError } from '@/error/model/app-error'
import type { AppErrorParser } from '@/error/parser/app-error-parser'
import { getAppErrorArgAsString } from '@/error/parser/app-error-parser-utils'

/**
 * Default error parser resolving common SDK and server error codes to localized strings.
 */
export class CommonErrorParser implements AppErrorParser {
  private readonly getStrings: () => CommonModuleStrings

  /**
   * Constructs a new {@link CommonErrorParser}.
   *
   * @param stringsOrGetter - Core common string dictionary or dynamic getter function returning current strings
   */
  public constructor(
    stringsOrGetter: CommonModuleStrings | (() => CommonModuleStrings) = commonStrings
  ) {
    this.getStrings = typeof stringsOrGetter === 'function' ? stringsOrGetter : () => stringsOrGetter
  }

  /**
   * Translates an {@link AppError} code and parameters into a localized user-facing message.
   *
   * @param appError - Application error instance to format
   * @returns Localized error message string
   */
  public parse(appError: AppError): string {
    const args = appError.args ?? {}
    const strings = this.getStrings()

    switch (appError.code) {
      case CommonErrorCodes.NOT_FOUND:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.RESOURCE,
          (resource) => strings.errors.notFound(resource),
          strings.errors.notFoundWithoutArgs
        )

      case CommonErrorCodes.MISSING_REQUIRED_PARAMETER:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.PARAMETER_NAME,
          (param) => strings.errors.missingField(param),
          strings.errors.missingFieldWithoutArgs
        )

      case CommonErrorCodes.INVALID_PARAMETER_VALUE:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.PARAMETER_NAME,
          (param) => strings.errors.invalidField(param),
          strings.errors.invalidFieldWithoutArgs
        )

      case CommonErrorCodes.MISSING_REQUIRED_FIELD:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.FIELD_NAME,
          (field) => strings.errors.missingField(field),
          strings.errors.missingFieldWithoutArgs
        )

      case CommonErrorCodes.BLANK_STRING_FIELD:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.FIELD_NAME,
          (field) => strings.errors.blankField(field),
          strings.errors.blankFieldWithoutArgs
        )

      case CommonErrorCodes.EMPTY_COLLECTION_FIELD:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.FIELD_NAME,
          (field) => strings.errors.blankField(field),
          strings.errors.blankFieldWithoutArgs
        )

      case CommonErrorCodes.INVALID_FIELD_VALUE:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.FIELD_NAME,
          (field) => strings.errors.invalidField(field),
          strings.errors.invalidFieldWithoutArgs
        )

      case CommonErrorCodes.TOO_MANY_REQUESTS:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.RETRY_AFTER_SECONDS,
          (seconds) => strings.errors.tooManyRequests(seconds),
          strings.errors.tooManyRequestsWithoutArgs
        )

      case CommonErrorCodes.SERVICE_UNAVAILABLE:
        return strings.errors.serviceUnavailable

      case ClientCommonErrorCodes.NO_INTERNET_CONNECTION:
        return strings.errors.noInternet

      case ClientCommonErrorCodes.NETWORK:
        return strings.errors.network

      case CommonErrorCodes.BAD_REQUEST:
      case CommonErrorCodes.INVALID_JSON_BODY:
      case ClientCommonErrorCodes.CONTRACT_VIOLATION:
        return strings.errors.badRequest

      case CommonErrorCodes.INTERNAL:
      case ClientCommonErrorCodes.LIFECYCLE_ERROR:
        return strings.errors.internal

      case CommonErrorCodes.UNKNOWN:
      default:
        return strings.errors.unknown
    }
  }

  private resolveLocalizedString(
    args: Record<string, unknown>,
    key: string,
    withArgsFormatter: (value: string) => string,
    fallback: string
  ): string {
    const value = getAppErrorArgAsString(args, key)
    if (value) {
      return withArgsFormatter(value)
    }
    return fallback
  }
}
