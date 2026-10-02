import { AppError } from '../error/model/AppError'
import { CommonError } from '../error/model/CommonError'

export type AppResultSuccess<T> = {
  readonly success: true
  readonly data: T
}

export type AppResultFailure<E> = {
  readonly success: false
  readonly error: E
}

export type AppResult<T, E = AppError> = AppResultSuccess<T> | AppResultFailure<E>

export const appResultSuccess = <T>(data: T): AppResultSuccess<T> => {
  return {
    success: true,
    data
  }
}

export const appResultFailure = <E>(error: E): AppResultFailure<E> => {
  return {
    success: false,
    error
  }
}

export const isSuccess = <T, E>(result: AppResult<T, E>): result is AppResultSuccess<T> => {
  return result.success
}

export const isFailure = <T, E>(result: AppResult<T, E>): result is AppResultFailure<E> => {
  return !result.success
}

export const foldResult = <T, E, R>(
  result: AppResult<T, E>,
  onSuccess: (data: T) => R,
  onFailure: (error: E) => R
): R => {
  if (result.success) {
    return onSuccess(result.data)
  }
  return onFailure(result.error)
}

export const onSuccess = <T, E>(
  result: AppResult<T, E>,
  block: (data: T) => void
): AppResult<T, E> => {
  if (result.success) {
    block(result.data)
  }
  return result
}

export const onError = <T, E>(
  result: AppResult<T, E>,
  block: (error: E) => void
): AppResult<T, E> => {
  if (!result.success) {
    block(result.error)
  }
  return result
}

export const flatMap = <T, E, R>(
  result: AppResult<T, E>,
  transform: (data: T) => AppResult<R, E>
): AppResult<R, E> => {
  if (result.success) {
    return transform(result.data)
  }
  return appResultFailure(result.error)
}

export const flatMapSuccess = flatMap

export const mapSuccess = <T, R>(
  result: AppResult<T, AppError>,
  transform: (data: T) => R
): AppResult<R, AppError> => {
  if (result.success) {
    try {
      return appResultSuccess(transform(result.data))
    } catch (e) {
      return appResultFailure(CommonError.contractViolation(e))
    }
  }
  return appResultFailure(result.error)
}
