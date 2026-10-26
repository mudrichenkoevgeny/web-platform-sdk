import {
  SecurityErrorCodes,
  SecurityErrorArgs,
  ClientSecurityErrorCodes,
  PasswordPolicyFailReason,
  CommonErrorArgs,
  SecurityModuleStrings,
  securityStrings
} from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, AppErrorParser } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { getAppErrorArgAsString } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/**
 * AppErrorParser implementation for security-domain error codes.
 */
export class SecurityErrorParser implements AppErrorParser {
  /**
   * Getter function returning the localized strings for the security module.
   *
   * @returns The localized string dictionary for the security module.
   */
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
        return strings.errors.mfaConfirmationRequired

      case SecurityErrorCodes.OTP_RETRY_TOO_SOON:
        return this.resolveLocalizedString(
          args,
          CommonErrorArgs.RETRY_AFTER_SECONDS,
          (seconds) => strings.errors.otpRetryTooSoon(seconds),
          strings.errors.otpRetryTooSoonWithoutArgs
        )

      case SecurityErrorCodes.PASSWORD_TOO_WEAK: {
        const reasons = strings.resolvePasswordTooWeakReasons(args)
        if (reasons.length > 0) {
          return reasons.join('. ')
        }
        return strings.errors.passwordTooWeak
      }

      case PasswordPolicyFailReason.TOO_SHORT:
        return this.resolveLocalizedString(
          args,
          SecurityErrorArgs.PASSWORD_MIN_LENGTH,
          (min) => strings.errors.passwordTooShort(min),
          strings.errors.passwordTooShortWithoutArgs
        )

      case PasswordPolicyFailReason.NO_LETTER:
        return strings.errors.passwordNoLetter

      case PasswordPolicyFailReason.NO_UPPERCASE:
        return strings.errors.passwordNoUppercase

      case PasswordPolicyFailReason.NO_LOWERCASE:
        return strings.errors.passwordNoLowercase

      case PasswordPolicyFailReason.NO_DIGIT:
        return strings.errors.passwordNoDigit

      case PasswordPolicyFailReason.NO_SPECIAL_CHAR:
        return strings.errors.passwordNoSpecialChar

      case PasswordPolicyFailReason.TOO_COMMON:
        return strings.errors.passwordTooCommon

      case SecurityErrorCodes.TOTP_ALREADY_ENABLED:
        return strings.errors.totpAlreadyEnabled

      case SecurityErrorCodes.TOTP_NOT_ENABLED:
        return strings.errors.totpNotEnabled

      case SecurityErrorCodes.MFA_TOKEN_EXPIRED:
      case SecurityErrorCodes.INVALID_MFA_TOKEN:
        return strings.errors.mfaTokenExpired

      case SecurityErrorCodes.RECOVERY_CODE_ALREADY_USED:
        return strings.errors.recoveryCodeAlreadyUsed

      case SecurityErrorCodes.INVALID_TOTP_CODE:
        return strings.errors.invalidTotpCode

      case SecurityErrorCodes.IP_NOT_ALLOWED:
        return strings.errors.ipNotAllowed

      case ClientSecurityErrorCodes.PASSWORD_POLICY_UNAVAILABLE:
        return strings.errors.passwordPolicyUnavailable

      default:
        return null
    }
  }

  /**
   * Resolves a localized string using error arguments, falling back to a message without arguments if the required argument is missing.
   *
   * @param args - The arguments record from the AppError.
   * @param key - The key of the argument to extract.
   * @param withArgsFormatter - Formatting function to generate the localized string when the argument is present.
   * @param fallback - The fallback localized string to return if the argument is missing.
   * @returns The resolved localized string.
   */
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
