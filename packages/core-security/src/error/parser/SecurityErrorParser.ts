import {
  SecurityErrorCodes,
  SecurityErrorArgs,
  CommonErrorArgs
} from '@mudrichenkoevgeny/shared-foundation'
import { AppError, AppErrorParser } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ClientSecurityErrorCodes } from '../naming/ClientSecurityErrorCodes'
import { enSecurityStrings, CoreSecurityStrings } from '../../locales/index'

/**
 * AppErrorParser implementation for security-domain error codes.
 */
export class SecurityErrorParser implements AppErrorParser {
  private readonly getStrings: () => CoreSecurityStrings

  /**
   * Constructs a new {@link SecurityErrorParser}.
   *
   * @param stringsOrGetter - Core security strings dictionary or dynamic getter function returning current strings
   */
  public constructor(
    stringsOrGetter: CoreSecurityStrings | (() => CoreSecurityStrings) = enSecurityStrings
  ) {
    this.getStrings = typeof stringsOrGetter === 'function' ? stringsOrGetter : () => stringsOrGetter
  }

  /**
   * Parses security domain errors into localized string messages.
   *
   * @param appError - Application error instance
   * @returns Localized string message or null if code is unhandled by this parser
   */
  public parse(appError: AppError): string | null {
    const args = appError.args ?? {}
    const strings = this.getStrings()

    switch (appError.code) {
      case SecurityErrorCodes.MFA_CONFIRMATION_REQUIRED:
        return this.resolveLocalizedString(
          args,
          SecurityErrorArgs.MFA_TOKEN,
          (mfaToken) => strings.error_security_mfa_confirmation_required_args(mfaToken),
          strings.error_security_mfa_confirmation_required
        )

      case SecurityErrorCodes.OTP_RETRY_TOO_SOON:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.RETRY_AFTER_SECONDS,
          (seconds) => strings.error_security_otp_retry_too_soon_args(seconds),
          strings.error_security_otp_retry_too_soon
        )

      case SecurityErrorCodes.PASSWORD_TOO_WEAK: {
        if (Object.keys(args).length === 0) {
          return strings.error_security_password_too_weak
        }
        return strings.error_security_password_too_weak_args(
          args[SecurityErrorArgs.PASSWORD_FAIL_TOO_SHORT] ?? 'false',
          args[SecurityErrorArgs.PASSWORD_MIN_LENGTH] ?? '0',
          args[SecurityErrorArgs.PASSWORD_FAIL_NO_LETTER] ?? 'false',
          args[SecurityErrorArgs.PASSWORD_FAIL_NO_UPPERCASE] ?? 'false',
          args[SecurityErrorArgs.PASSWORD_FAIL_NO_LOWERCASE] ?? 'false',
          args[SecurityErrorArgs.PASSWORD_FAIL_NO_DIGIT] ?? 'false',
          args[SecurityErrorArgs.PASSWORD_FAIL_NO_SPECIAL_CHAR] ?? 'false',
          args[SecurityErrorArgs.PASSWORD_FAIL_TOO_COMMON] ?? 'false'
        )
      }

      case SecurityErrorCodes.TOTP_ALREADY_ENABLED:
        return strings.error_security_totp_already_enabled

      case SecurityErrorCodes.TOTP_NOT_ENABLED:
        return strings.error_security_totp_not_enabled

      case SecurityErrorCodes.MFA_TOKEN_EXPIRED:
        return strings.error_security_mfa_token_expired

      case SecurityErrorCodes.RECOVERY_CODE_ALREADY_USED:
        return strings.error_security_recovery_code_used

      case SecurityErrorCodes.INVALID_TOTP_CODE:
        return strings.error_security_invalid_totp_code

      case SecurityErrorCodes.INVALID_MFA_TOKEN:
        return strings.error_security_invalid_mfa_token

      case SecurityErrorCodes.IP_NOT_ALLOWED:
        return strings.error_security_ip_not_allowed

      case ClientSecurityErrorCodes.PASSWORD_POLICY_UNAVAILABLE:
        return strings.error_security_password_policy_unavailable

      case ClientSecurityErrorCodes.PASSWORD_TOO_SHORT:
        return this.resolveLocalizedString(
          args,
          SecurityErrorArgs.PASSWORD_MIN_LENGTH,
          (minLength) => strings.error_security_password_too_short_args(minLength),
          strings.error_security_password_too_short
        )

      case ClientSecurityErrorCodes.PASSWORD_NO_LETTER:
        return strings.error_security_password_no_letter

      case ClientSecurityErrorCodes.PASSWORD_NO_UPPERCASE:
        return strings.error_security_password_no_uppercase

      case ClientSecurityErrorCodes.PASSWORD_NO_LOWERCASE:
        return strings.error_security_password_no_lowercase

      case ClientSecurityErrorCodes.PASSWORD_NO_DIGIT:
        return strings.error_security_password_no_digit

      case ClientSecurityErrorCodes.PASSWORD_NO_SPECIAL_CHAR:
        return strings.error_security_password_no_special_char

      case ClientSecurityErrorCodes.PASSWORD_TOO_COMMON:
        return strings.error_security_password_too_common

      default:
        return null
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
