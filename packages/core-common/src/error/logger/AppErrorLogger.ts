import { AppError } from '../model/AppError'
import {
  CommonErrorInternal,
  CommonErrorNoInternetConnection,
  CommonErrorNetwork,
  CommonErrorContractViolation
} from '../model/CommonError'

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

export class AppErrorLogger {
  public logAppError(error: AppError): void {
    console.error(getLogMessage(error))
  }
}

export const logAppError = (error: AppError): void => {
  new AppErrorLogger().logAppError(error)
}
