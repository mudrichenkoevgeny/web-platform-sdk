import { CommonErrorCodes, CommonErrorArgs } from '@mudrichenkoevgeny/shared-foundation'
import { AppError } from '@/model/AppError'
import type { AppErrorParser } from '@/error/parser/AppErrorParser'
import { ClientCommonErrorCodes } from '@/naming/ClientCommonErrorCodes'
import { enStrings } from '@/locales/index'
import type { CoreCommonStrings } from "@/locales/index";

/**
 * Default error parser resolving common SDK and server error codes to localized strings.
 */
export class CommonErrorParser implements AppErrorParser {
  /**
   * Constructs a new {@link CommonErrorParser}.
   *
   * @param strings - Core common string dictionary instance (defaults to English)
   */
  public constructor(private readonly strings: CoreCommonStrings = enStrings) {}

  /**
   * Translates an {@link AppError} code and parameters into a localized user-facing message.
   *
   * @param appError - Application error instance to format
   * @returns Localized error message string
   */
  public parse(appError: AppError): string {
    const args = appError.args ?? {}

    switch (appError.code) {
      case CommonErrorCodes.NOT_FOUND:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.RESOURCE,
          (res) => this.strings.error_common_not_found_args(res),
          this.strings.error_common_not_found
        )

      case CommonErrorCodes.MISSING_REQUIRED_PARAMETER:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.PARAMETER_NAME,
          (param) => this.strings.error_common_missing_parameter_args(param),
          this.strings.error_common_missing_parameter
        )

      case CommonErrorCodes.INVALID_PARAMETER_VALUE:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.PARAMETER_NAME,
          (param) => this.strings.error_common_invalid_parameter_args(param),
          this.strings.error_common_invalid_parameter
        )

      case CommonErrorCodes.MISSING_REQUIRED_FIELD:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.FIELD_NAME,
          (field) => this.strings.error_common_missing_field_args(field),
          this.strings.error_common_missing_field
        )

      case CommonErrorCodes.BLANK_STRING_FIELD:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.FIELD_NAME,
          (field) => this.strings.error_common_blank_field_args(field),
          this.strings.error_common_blank_field
        )

      case CommonErrorCodes.EMPTY_COLLECTION_FIELD:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.FIELD_NAME,
          (field) => this.strings.error_common_empty_field_args(field),
          this.strings.error_common_empty_field
        )

      case CommonErrorCodes.INVALID_FIELD_VALUE:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.FIELD_NAME,
          (field) => this.strings.error_common_invalid_field_args(field),
          this.strings.error_common_invalid_field
        )

      case CommonErrorCodes.TOO_MANY_REQUESTS:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.RETRY_AFTER_SECONDS,
          (seconds) => this.strings.error_common_too_many_requests_args(seconds),
          this.strings.error_common_too_many_requests
        )

      case CommonErrorCodes.SERVICE_UNAVAILABLE:
        return this.strings.error_common_service_unavailable

      case ClientCommonErrorCodes.NO_INTERNET_CONNECTION:
        return this.strings.error_common_no_internet

      case ClientCommonErrorCodes.NETWORK:
        return this.strings.error_common_network

      case CommonErrorCodes.INTERNAL:
      case CommonErrorCodes.BAD_REQUEST:
      case CommonErrorCodes.INVALID_JSON_BODY:
      case CommonErrorCodes.UNKNOWN:
      case ClientCommonErrorCodes.CONTRACT_VIOLATION:
      case ClientCommonErrorCodes.LIFECYCLE_ERROR:
        return this.strings.error_common_internal

      default:
        return this.strings.error_common_unknown
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
