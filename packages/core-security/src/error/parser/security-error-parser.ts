import {
  SecurityErrorCodes,
  SecurityErrorArgs,
  CommonErrorArgs,
  SecurityModuleStrings,
  securityStrings
} from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, AppErrorParser } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ClientSecurityErrorCodes } from '@/error/naming/client-security-error-codes'

/**
 * AppErrorParser implementation for security-domain error codes.
 */
export class SecurityErrorParser implements AppErrorParser {
  private readonly getStrings: () => SecurityModuleStrings

  /**
   * Constructs a new {@link SecurityErrorParser}.
   *
   * @param stringsOrGetter - Core security strings dictionary or dynamic getter function returning current strings
   */
  public constructor(
    stringsOrGetter: SecurityModuleStrings | (() => SecurityModuleStrings) = securityStrings
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
          (mfaToken) => strings.errors.mfaConfirmationRequired(mfaToken),
          strings.errors.mfaConfirmationRequiredWithoutArgs
        )

      case SecurityErrorCodes.OTP_RETRY_TOO_SOON:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.RETRY_AFTER_SECONDS,
          (seconds) => strings.errors.otpRetryTooSoon(seconds),
          strings.errors.otpRetryTooSoonWithoutArgs
        )

      case SecurityErrorCodes.PASSWORD_TOO_WEAK:
        return strings.errors.passwordTooWeakWithoutArgs

      case SecurityErrorCodes.TOTP_ALREADY_ENABLED:
        return strings.errors.totpAlreadyEnabled

      case SecurityErrorCodes.TOTP_NOT_ENABLED:
        return strings.errors.totpNotEnabled

      case SecurityErrorCodes.MFA_TOKEN_EXPIRED:
        return strings.errors.mfaTokenExpired

      case SecurityErrorCodes.RECOVERY_CODE_ALREADY_USED:
        return strings.errors.recoveryCodeAlreadyUsed

      case SecurityErrorCodes.INVALID_TOTP_CODE:
        return strings.errors.invalidTotpCode

      case SecurityErrorCodes.INVALID_MFA_TOKEN:
        return strings.errors.invalidMfaToken

      case SecurityErrorCodes.IP_NOT_ALLOWED:
        return strings.errors.ipNotAllowed

      case ClientSecurityErrorCodes.PASSWORD_POLICY_UNAVAILABLE:
        return strings.errors.passwordPolicyUnavailable

      case ClientSecurityErrorCodes.PASSWORD_TOO_SHORT:
        return this.resolveLocalizedString(
          args,
          SecurityErrorArgs.PASSWORD_MIN_LENGTH,
          (minLength) => strings.errors.passwordTooShort(minLength),
          strings.errors.passwordTooShortWithoutArgs
        )

      case ClientSecurityErrorCodes.PASSWORD_NO_LETTER:
        return strings.errors.passwordNoLetter

      case ClientSecurityErrorCodes.PASSWORD_NO_UPPERCASE:
        return strings.errors.passwordNoUppercase

      case ClientSecurityErrorCodes.PASSWORD_NO_LOWERCASE:
        return strings.errors.passwordNoLowercase

      case ClientSecurityErrorCodes.PASSWORD_NO_DIGIT:
        return strings.errors.passwordNoDigit

      case ClientSecurityErrorCodes.PASSWORD_NO_SPECIAL_CHAR:
        return strings.errors.passwordNoSpecialChar

      case ClientSecurityErrorCodes.PASSWORD_TOO_COMMON:
        return strings.errors.passwordTooCommon

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
