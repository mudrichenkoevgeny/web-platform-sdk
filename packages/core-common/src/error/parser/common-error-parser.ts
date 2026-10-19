import { CommonErrorCodes, CommonErrorArgs, CommonModuleStrings, commonStrings } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError } from '@/error/model/app-error'
import type { AppErrorParser } from '@/error/parser/app-error-parser'
import { ClientCommonErrorCodes } from '@/error/naming/client-common-error-codes'

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
          (param) => strings.errors.missingParameter(param),
          strings.errors.missingParameterWithoutArgs
        )

      case CommonErrorCodes.INVALID_PARAMETER_VALUE:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.PARAMETER_NAME,
          (param) => strings.errors.invalidParameter(param),
          strings.errors.invalidParameterWithoutArgs
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
          (field) => strings.errors.emptyCollectionField(field),
          strings.errors.emptyCollectionFieldWithoutArgs
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

      case CommonErrorCodes.INTERNAL:
      case CommonErrorCodes.BAD_REQUEST:
      case CommonErrorCodes.INVALID_JSON_BODY:
      case CommonErrorCodes.UNKNOWN:
      case ClientCommonErrorCodes.CONTRACT_VIOLATION:
      case ClientCommonErrorCodes.LIFECYCLE_ERROR:
        return strings.errors.internal

      default:
        if ('message' in appError && typeof appError.message === 'string' && appError.message.trim().length > 0) {
          return appError.message
        }
        return strings.errors.unknown
    }
  }

  private resolveLocalizedString(
    args: Record<string, string>,
    key: string,
    withArgsFormatter: (value: string) => string,
    fallback: string
  ): string {
    const value = args[key]
    if (value && value.trim().length > 0) {
      return withArgsFormatter(value)
    }
    return fallback
  }
}
