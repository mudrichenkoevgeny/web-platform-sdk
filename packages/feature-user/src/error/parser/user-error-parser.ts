import { UserErrorCodes, UserErrorArgs, CommonErrorArgs } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, AppErrorParser } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { formatEpochMillisToDateTime } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ClientUserErrorCodes } from '@/error/naming/client-user-error-codes'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";

/**
 * AppErrorParser implementation for user-related error codes.
 */
export class UserErrorParser implements AppErrorParser {
  private readonly getStrings: () => FeatureUserStrings

  /**
   * Constructs a new {@link UserErrorParser}.
   *
   * @param stringsOrGetter - Feature user strings dictionary or dynamic getter function
   */
  public constructor(
    stringsOrGetter: FeatureUserStrings | (() => FeatureUserStrings) = enUserStrings
  ) {
    this.getStrings = typeof stringsOrGetter === 'function' ? stringsOrGetter : () => stringsOrGetter
  }

  /**
   * Parses user domain errors into localized string messages.
   *
   * @param appError - Application error instance
   * @returns Localized string message or null if code is unhandled by this parser
   */
  public parse(appError: AppError): string | null {
    const args = appError.args ?? {}
    const strings = this.getStrings()

    switch (appError.code) {
      case UserErrorCodes.INVALID_ACCESS_TOKEN:
        return strings.error_user_invalid_access_token

      case UserErrorCodes.ACCESS_TOKEN_EXPIRED:
        return strings.error_user_access_token_expired

      case UserErrorCodes.INVALID_REFRESH_TOKEN:
        return strings.error_user_invalid_refresh_token

      case UserErrorCodes.INVALID_SESSION:
        return strings.error_user_invalid_session

      case UserErrorCodes.USER_BANNED:
        return strings.error_user_banned

      case UserErrorCodes.USER_LOCKED: {
        const formattedUntil = formatEpochMillisToDateTime(args[UserErrorArgs.TEMPORARY_LOCKOUT_UNTIL])
        if (formattedUntil) {
          return strings.error_user_locked_until(formattedUntil)
        }
        return strings.error_user_locked
      }

      case UserErrorCodes.SELF_SERVICE_UNLOCK_DISABLED:
        return strings.error_user_self_service_unlock_disabled

      case UserErrorCodes.USER_READ_ONLY:
        return strings.error_user_read_only

      case UserErrorCodes.USER_SECURITY_HOLD:
        return strings.error_user_security_hold

      case UserErrorCodes.USER_PENDING_DELETION:
        return strings.error_user_pending_deletion

      case UserErrorCodes.USER_ILLEGAL_ACCOUNT_STATUS:
        return strings.error_user_illegal_status

      case UserErrorCodes.USER_FORBIDDEN:
        return strings.error_user_forbidden

      case UserErrorCodes.USER_ROLE_NOT_ALLOWED:
        return strings.error_user_role_not_allowed

      case UserErrorCodes.USER_MISSING_PERMISSIONS:
        return strings.error_user_missing_permissions

      case UserErrorCodes.USER_INSUFFICIENT_AUTHORITY_LEVEL:
        return strings.error_user_insufficient_authority

      case UserErrorCodes.USER_NOT_FOUND:
        return strings.error_user_not_found

      case UserErrorCodes.INVALID_CREDENTIALS:
        return strings.error_user_invalid_credentials

      case UserErrorCodes.WRONG_PASSWORD:
        return strings.error_user_wrong_password

      case UserErrorCodes.PASSWORD_SETUP_REQUIRED:
        return strings.error_user_password_setup_required

      case UserErrorCodes.USER_IDENTIFIER_PASSWORD_NOT_SUPPORTED:
        return strings.error_user_identifier_password_not_supported

      case UserErrorCodes.USER_IDENTIFIER_PASSWORD_NOT_SET:
        return strings.error_user_identifier_password_not_set

      case UserErrorCodes.WRONG_CONFIRMATION_CODE:
        return strings.error_user_wrong_confirmation_code

      case UserErrorCodes.EXTERNAL_IDENTIFIER_LINKAGE_FAILED:
        return strings.error_user_external_linkage_failed

      case UserErrorCodes.CAN_NOT_DELETE_USER_IDENTIFIER:
        return strings.error_user_can_not_delete_identifier

      case UserErrorCodes.CAN_NOT_CREATE_USER_IDENTIFIER:
        return strings.error_user_can_not_create_identifier

      case UserErrorCodes.EMAIL_NOT_ALLOWED:
        return strings.error_user_email_not_allowed

      case UserErrorCodes.USER_IDENTIFIER_LIMIT_REACHED:
        return this.resolveLimit(
          args,
          UserErrorArgs.USER_AUTH_PROVIDER,
          UserErrorArgs.MAX_NUMBER_OF_IDENTIFIERS,
          (limit, provider) => strings.error_user_identifier_limit_reached_args(limit, provider),
          strings.error_user_identifier_limit_reached
        )

      case UserErrorCodes.TOTAL_USER_IDENTIFIERS_LIMIT_REACHED: {
        const limit = args[UserErrorArgs.MAX_NUMBER_OF_IDENTIFIERS]
        if (limit && limit.trim().length > 0) {
          return strings.error_user_total_identifiers_limit_reached_args(limit)
        }
        return strings.error_user_total_identifiers_limit_reached
      }

      case ClientUserErrorCodes.REGISTRATION_DISABLED:
        return strings.error_user_registration_disabled

      case ClientUserErrorCodes.EXTERNAL_AUTH_CANCELLED:
        return strings.error_user_external_auth_cancelled

      case ClientUserErrorCodes.EXTERNAL_AUTH_FAILED:
        return strings.error_user_external_auth_failed

      case ClientUserErrorCodes.TOO_MANY_CONFIRMATION_REQUESTS: {
        const seconds = args[CommonErrorArgs.RETRY_AFTER_SECONDS]
        if (seconds && seconds.trim().length > 0) {
          return strings.error_common_too_many_requests_args(seconds)
        }
        return strings.error_user_too_many_confirmation_requests
      }

      default:
        return null
    }
  }

  private resolveLimit(
    args: Record<string, string>,
    providerKey: string,
    limitKey: string,
    withArgsFormatter: (limit: string, provider: string) => string,
    fallback: string
  ): string {
    const provider = args[providerKey]
    const limit = args[limitKey]
    if (provider && provider.trim().length > 0 && limit && limit.trim().length > 0) {
      return withArgsFormatter(limit, provider)
    }
    return fallback
  }
}
