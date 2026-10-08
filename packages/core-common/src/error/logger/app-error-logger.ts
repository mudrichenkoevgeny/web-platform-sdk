import type { AppError } from '@/error/model/app-error'
import {
  CommonErrorInternal,
  CommonErrorNoInternetConnection,
  CommonErrorNetwork,
  CommonErrorContractViolation
} from '@/error/model/common-error'

/**
 * Formats an {@link AppError} into a detailed string suitable for logging.
 *
 * @param appError - Application error instance
 * @returns Formatted log entry string
 */
export const getLogMessage = (appError: AppError): string => {
  let message = `id=${appError.id}, code=${appError.code}`

  if (appError.args && Object.keys(appError.args).length > 0) {
    message += `, args=${JSON.stringify(appError.args)}`
  }

  let throwable: unknown = undefined
  if (
    appError instanceof CommonErrorInternal ||
    appError instanceof CommonErrorNoInternetConnection ||
    appError instanceof CommonErrorNetwork ||
    appError instanceof CommonErrorContractViolation
  ) {
    throwable = appError.throwable
  }

  if (throwable !== undefined) {
    if (throwable instanceof Error && throwable.stack) {
      message += `, cause=${throwable.stack}`
    } else if (throwable !== null) {
      message += `, cause=${String(throwable)}`
    }
  }

  return message
}

/**
 * Utility class for logging application errors to the console.
 */
export class AppErrorLogger {
  /**
   * Logs an {@link AppError} to console error output.
   *
   * @param error - Application error instance to log
   */
  public logAppError(error: AppError): void {
    console.error(getLogMessage(error))
  }
}

/**
 * Global helper function to log an {@link AppError}.
 *
 * @param error - Application error instance
 */
export const logAppError = (error: AppError): void => {
  new AppErrorLogger().logAppError(error)
}
