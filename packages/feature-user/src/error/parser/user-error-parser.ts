import { UserErrorCodes, UserErrorArgs, CommonErrorArgs, UserModuleStrings, CommonModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError, AppErrorParser } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { formatEpochMillisToDateTime } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ClientUserErrorCodes } from '@/error/naming/client-user-error-codes'

const defaultUserStrings = new UserModuleStrings()
const defaultCommonStrings = new CommonModuleStrings()

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
    stringsOrGetter: UserModuleStrings | (() => UserModuleStrings) = defaultUserStrings
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
        return strings.errors.invalidAccessToken

      case UserErrorCodes.ACCESS_TOKEN_EXPIRED:
        return strings.errors.accessTokenExpired

      case UserErrorCodes.INVALID_REFRESH_TOKEN:
        return strings.errors.invalidRefreshToken

      case UserErrorCodes.INVALID_SESSION:
        return strings.errors.invalidSession

      case UserErrorCodes.USER_BANNED:
        return strings.errors.banned

      case UserErrorCodes.USER_LOCKED: {
        const formattedUntil = formatEpochMillisToDateTime(args[UserErrorArgs.TEMPORARY_LOCKOUT_UNTIL])
        if (formattedUntil) {
          return strings.errors.locked(formattedUntil)
        }
        return strings.errors.lockedWithoutArgs
      }

      case UserErrorCodes.SELF_SERVICE_UNLOCK_DISABLED:
        return strings.errors.selfServiceUnlockDisabled

      case UserErrorCodes.USER_READ_ONLY:
        return strings.errors.readOnly

      case UserErrorCodes.USER_SECURITY_HOLD:
        return strings.errors.securityHold

      case UserErrorCodes.USER_PENDING_DELETION:
        return strings.errors.pendingDeletion

      case UserErrorCodes.USER_ILLEGAL_ACCOUNT_STATUS:
        return strings.errors.illegalStatus

      case UserErrorCodes.USER_FORBIDDEN:
        return strings.errors.forbidden

      case UserErrorCodes.USER_ROLE_NOT_ALLOWED:
        return strings.errors.roleNotAllowed

      case UserErrorCodes.USER_MISSING_PERMISSIONS:
        return strings.errors.missingPermissions

      case UserErrorCodes.USER_INSUFFICIENT_AUTHORITY_LEVEL:
        return strings.errors.insufficientAuthority

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
        return this.resolveLimit(
          args,
          UserErrorArgs.USER_AUTH_PROVIDER,
          UserErrorArgs.MAX_NUMBER_OF_IDENTIFIERS,
          (limit, provider) => strings.errors.identifierLimitReached(limit, provider),
          strings.errors.identifierLimitReachedWithoutArgs
        )

      case UserErrorCodes.TOTAL_USER_IDENTIFIERS_LIMIT_REACHED: {
        const limit = args[UserErrorArgs.MAX_NUMBER_OF_IDENTIFIERS]
        if (limit && limit.trim().length > 0) {
          return strings.errors.totalIdentifiersLimitReached(limit)
        }
        return strings.errors.totalIdentifiersLimitReachedWithoutArgs
      }

      case ClientUserErrorCodes.REGISTRATION_DISABLED:
        return strings.errors.registrationDisabled

      case ClientUserErrorCodes.EXTERNAL_AUTH_CANCELLED:
        return strings.errors.externalAuthCancelled

      case ClientUserErrorCodes.EXTERNAL_AUTH_FAILED:
        return strings.errors.externalAuthFailed

      case ClientUserErrorCodes.TOO_MANY_CONFIRMATION_REQUESTS: {
        const seconds = args[CommonErrorArgs.RETRY_AFTER_SECONDS]
        if (seconds && seconds.trim().length > 0) {
          return defaultCommonStrings.errors.tooManyRequests(seconds)
        }
        return strings.errors.tooManyConfirmationRequests
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
