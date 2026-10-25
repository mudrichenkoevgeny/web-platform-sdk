import {
  SecurityErrorCodes,
  SecurityErrorArgs,
  CommonErrorArgs,
  ClientSecurityErrorCodes,
  SecurityModuleStrings,
  securityStrings
} from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, AppErrorParser } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { getAppErrorArgAsString } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

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

      default:
        return null
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
