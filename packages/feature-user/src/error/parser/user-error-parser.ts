import { UserErrorCodes, UserErrorArgs, CommonErrorArgs, ClientUserErrorCodes, UserModuleStrings, userStrings, commonStrings } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, AppErrorParser } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { formatEpochMillisToDateTime, getAppErrorArgAsString, getAppErrorArgAsNumber } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/**
 * AppErrorParser implementation for user-related error codes.
 */
export class UserErrorParser implements AppErrorParser {
  private readonly getStrings: () => UserModuleStrings

  /**
   * Constructs a new {@link UserErrorParser}.
   *
   * @param stringsOrGetter - Feature user strings dictionary or dynamic getter function
   */
  public constructor(
    stringsOrGetter: UserModuleStrings | (() => UserModuleStrings) = userStrings
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
      case UserErrorCodes.ACCESS_TOKEN_EXPIRED:
        return strings.errors.invalidSession

      case UserErrorCodes.INVALID_REFRESH_TOKEN:
        return strings.errors.invalidSession

      case UserErrorCodes.INVALID_SESSION:
      case UserErrorCodes.USER_ILLEGAL_ACCOUNT_STATUS:
        return strings.errors.invalidSession

      case UserErrorCodes.USER_BANNED:
        return strings.errors.banned

      case UserErrorCodes.USER_LOCKED: {
        const lockoutType = getAppErrorArgAsString(args, UserErrorArgs.ACCOUNT_LOCKOUT_TYPE)
        const rawUntil = getAppErrorArgAsNumber(args, UserErrorArgs.TEMPORARY_LOCKOUT_UNTIL)
        const formattedUntil = rawUntil ? formatEpochMillisToDateTime(rawUntil) : null
        return strings.resolveUserLockedMessage(lockoutType, formattedUntil)
      }

      case UserErrorCodes.SELF_SERVICE_UNLOCK_DISABLED:
        return strings.errors.selfServiceUnlockDisabled

      case UserErrorCodes.USER_READ_ONLY:
        return strings.errors.readOnly

      case UserErrorCodes.USER_SECURITY_HOLD:
        return strings.errors.securityHold

      case UserErrorCodes.USER_PENDING_DELETION:
        return strings.errors.pendingDeletion

      case UserErrorCodes.USER_FORBIDDEN:
      case UserErrorCodes.USER_ROLE_NOT_ALLOWED:
        return strings.errors.forbidden

      case UserErrorCodes.USER_MISSING_PERMISSIONS:
        return strings.errors.missingPermissions

      case UserErrorCodes.USER_INSUFFICIENT_AUTHORITY_LEVEL:
        return strings.errors.roleTooHigh

      case UserErrorCodes.USER_NOT_FOUND:
        return strings.errors.notFound

      case UserErrorCodes.INVALID_CREDENTIALS:
        return strings.errors.invalidCredentials

      case UserErrorCodes.WRONG_PASSWORD:
        return strings.errors.wrongPassword

      case UserErrorCodes.PASSWORD_SETUP_REQUIRED:
        return strings.errors.passwordSetupRequired

      case UserErrorCodes.USER_IDENTIFIER_PASSWORD_NOT_SUPPORTED:
        return strings.errors.identifierPasswordNotSupported

      case UserErrorCodes.USER_IDENTIFIER_PASSWORD_NOT_SET:
        return strings.errors.identifierPasswordNotSet

      case UserErrorCodes.WRONG_CONFIRMATION_CODE:
        return strings.errors.wrongConfirmationCode

      case UserErrorCodes.EXTERNAL_IDENTIFIER_LINKAGE_FAILED:
        return strings.errors.externalLinkageFailed

      case UserErrorCodes.CAN_NOT_DELETE_USER_IDENTIFIER:
        return strings.errors.canNotDeleteIdentifier

      case UserErrorCodes.CAN_NOT_CREATE_USER_IDENTIFIER:
        return strings.errors.canNotCreateIdentifier

      case UserErrorCodes.EMAIL_NOT_ALLOWED:
        return strings.errors.emailNotAllowed

      case UserErrorCodes.USER_IDENTIFIER_LIMIT_REACHED:
        return strings.resolveUserIdentifierLimitReachedMessage(
          commonStrings,
          getAppErrorArgAsString(args, UserErrorArgs.MAX_NUMBER_OF_IDENTIFIERS),
          getAppErrorArgAsString(args, UserErrorArgs.USER_AUTH_PROVIDER)
        )

      case UserErrorCodes.TOTAL_USER_IDENTIFIERS_LIMIT_REACHED:
        return strings.resolveTotalUserIdentifiersLimitReachedMessage(
          getAppErrorArgAsString(args, UserErrorArgs.MAX_NUMBER_OF_IDENTIFIERS)
        )

      case UserErrorCodes.REGISTRATION_DISABLED:
        return strings.errors.registrationDisabled

      case ClientUserErrorCodes.EXTERNAL_AUTH_CANCELLED:
        return strings.errors.externalAuthCancelled

      case ClientUserErrorCodes.EXTERNAL_AUTH_FAILED:
        return strings.errors.externalAuthFailed

      case ClientUserErrorCodes.TOO_MANY_CONFIRMATION_REQUESTS: {
        const seconds = getAppErrorArgAsString(args, CommonErrorArgs.RETRY_AFTER_SECONDS)
        if (seconds) {
          return commonStrings.errors.tooManyRequests(seconds)
        }
        return strings.errors.tooManyConfirmationRequests
      }

      default:
        return null
    }
  }
}
