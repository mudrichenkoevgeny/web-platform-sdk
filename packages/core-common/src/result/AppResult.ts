import { AppError } from '@/error/model/AppError'
import { CommonError } from '@/error/model/CommonError'

/**
 * Successful result representation holding data payload of type T.
 */
export type AppResultSuccess<T> = {
  readonly success: true
  readonly data: T
}

/**
 * Failed result representation holding error payload of type E.
 */
export type AppResultFailure<E> = {
  readonly success: false
  readonly error: E
}

/**
 * Discriminated union result container representing either success with T or failure with E.
 */
export type AppResult<T, E = AppError> = AppResultSuccess<T> | AppResultFailure<E>

/**
 * Constructs a successful {@link AppResultSuccess} containing the provided data.
 *
 * @param data - Success payload value
 * @returns Successful AppResult
 */
export const appResultSuccess = <T>(data: T): AppResultSuccess<T> => {
  return {
    success: true,
    data
  }
}

/**
 * Constructs a failed {@link AppResultFailure} containing the provided error.
 *
 * @param error - Error payload value
 * @returns Failed AppResult
 */
export const appResultFailure = <E>(error: E): AppResultFailure<E> => {
  return {
    success: false,
    error
  }
}

/**
 * Type guard checking whether an {@link AppResult} is successful.
 *
 * @param result - Result instance to check
 * @returns True if result is AppResultSuccess
 */
export const isSuccess = <T, E>(result: AppResult<T, E>): result is AppResultSuccess<T> => {
  return result.success
}

/**
 * Type guard checking whether an {@link AppResult} is a failure.
 *
 * @param result - Result instance to check
 * @returns True if result is AppResultFailure
 */
export const isFailure = <T, E>(result: AppResult<T, E>): result is AppResultFailure<E> => {
  return !result.success
}

/**
 * Applies transform functions based on whether the result is successful or failed.
 *
 * @param result - Target AppResult instance
 * @param onSuccess - Handler called when result is successful
 * @param onFailure - Handler called when result is a failure
 * @returns Return value of executed handler
 */
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

/**
 * Executes a side-effect block if the result is successful.
 *
 * @param result - Target AppResult
 * @param block - Side-effect callback receiving success data
 * @returns Original result instance for chaining
 */
export const onSuccess = <T, E>(
  result: AppResult<T, E>,
  block: (data: T) => void
): AppResult<T, E> => {
  if (result.success) {
    block(result.data)
  }
  return result
}

/**
 * Executes a side-effect block if the result is a failure.
 *
 * @param result - Target AppResult
 * @param block - Side-effect callback receiving error value
 * @returns Original result instance for chaining
 */
export const onError = <T, E>(
  result: AppResult<T, E>,
  block: (error: E) => void
): AppResult<T, E> => {
  if (!result.success) {
    block(result.error)
  }
  return result
}

/**
 * Transforms success data with a function returning a new {@link AppResult}.
 *
 * @param result - Target AppResult
 * @param transform - Async or sync transformation function
 * @returns Transformed AppResult or original failure
 */
export const flatMap = <T, E, R>(
  result: AppResult<T, E>,
  transform: (data: T) => AppResult<R, E>
): AppResult<R, E> => {
  if (result.success) {
    return transform(result.data)
  }
  return appResultFailure(result.error)
}

/** Alias for {@link flatMap}. */
export const flatMapSuccess = flatMap

/**
 * Transforms success data with a mapping function, wrapping exceptions in contract violation error.
 *
 * @param result - Target AppResult
 * @param transform - Mapping function
 * @returns Mapped AppResult
 */
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
