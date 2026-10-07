import { CommonErrorCodes, CommonErrorArgs } from '@mudrichenkoevgeny/shared-foundation'
import { AppError } from '@/error/model/app-error'
import type { AppErrorParser } from '@/error/parser/app-error-parser'
import { ClientCommonErrorCodes } from '@/error/naming/client-common-error-codes'
import { enStrings } from '@/locales/index'
import type { CoreCommonStrings } from "@/locales/index";

/**
 * Default error parser resolving common SDK and server error codes to localized strings.
 */
export class CommonErrorParser implements AppErrorParser {
  private readonly getStrings: () => CoreCommonStrings

  /**
   * Constructs a new {@link CommonErrorParser}.
   *
   * @param stringsOrGetter - Core common string dictionary or dynamic getter function returning current strings
   */
  public constructor(
    stringsOrGetter: CoreCommonStrings | (() => CoreCommonStrings) = enStrings
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
          (res) => strings.error_common_not_found_args(res),
          strings.error_common_not_found
        )

      case CommonErrorCodes.MISSING_REQUIRED_PARAMETER:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.PARAMETER_NAME,
          (param) => strings.error_common_missing_parameter_args(param),
          strings.error_common_missing_parameter
        )

      case CommonErrorCodes.INVALID_PARAMETER_VALUE:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.PARAMETER_NAME,
          (param) => strings.error_common_invalid_parameter_args(param),
          strings.error_common_invalid_parameter
        )

      case CommonErrorCodes.MISSING_REQUIRED_FIELD:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.FIELD_NAME,
          (field) => strings.error_common_missing_field_args(field),
          strings.error_common_missing_field
        )

      case CommonErrorCodes.BLANK_STRING_FIELD:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.FIELD_NAME,
          (field) => strings.error_common_blank_field_args(field),
          strings.error_common_blank_field
        )

      case CommonErrorCodes.EMPTY_COLLECTION_FIELD:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.FIELD_NAME,
          (field) => strings.error_common_empty_field_args(field),
          strings.error_common_empty_field
        )

      case CommonErrorCodes.INVALID_FIELD_VALUE:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.FIELD_NAME,
          (field) => strings.error_common_invalid_field_args(field),
          strings.error_common_invalid_field
        )

      case CommonErrorCodes.TOO_MANY_REQUESTS:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.RETRY_AFTER_SECONDS,
          (seconds) => strings.error_common_too_many_requests_args(seconds),
          strings.error_common_too_many_requests
        )

      case CommonErrorCodes.SERVICE_UNAVAILABLE:
        return strings.error_common_service_unavailable

      case ClientCommonErrorCodes.NO_INTERNET_CONNECTION:
        return strings.error_common_no_internet

      case ClientCommonErrorCodes.NETWORK:
        return strings.error_common_network

      case CommonErrorCodes.INTERNAL:
      case CommonErrorCodes.BAD_REQUEST:
      case CommonErrorCodes.INVALID_JSON_BODY:
      case CommonErrorCodes.UNKNOWN:
      case ClientCommonErrorCodes.CONTRACT_VIOLATION:
      case ClientCommonErrorCodes.LIFECYCLE_ERROR:
        return strings.error_common_internal

      default:
        if ('message' in appError && typeof appError.message === 'string' && appError.message.trim().length > 0) {
          return appError.message
        }
        return strings.error_common_unknown
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
