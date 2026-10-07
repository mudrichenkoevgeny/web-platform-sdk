import { AppResult, appResultSuccess, appResultFailure } from '@/result/app-result'
import { AppError } from '@/error/model/app-error'
import { ApiException } from '@/error/model/api-exception'
import { toServerError } from '@/error/mapper/to-server-error'
import { CommonError } from '@/error/model/common-error'
import { isNoInternetException } from '@/network/utils/is-no-internet-exception'

/**
 * Type guard checking if an error is an {@link ApiException}.
 *
 * @param error - Unknown error value to check
 * @returns True if error is instance of ApiException or has apiErrorResponse property
 */
export const isApiException = (error: unknown): error is ApiException => {
  return (
    error instanceof ApiException ||
    (typeof error === 'object' &&
      error !== null &&
      'apiErrorResponse' in error &&
      typeof (error as ApiException).apiErrorResponse === 'object' &&
      (error as ApiException).apiErrorResponse !== null)
  )
}

/**
 * Safely executes an async function and wraps the returned result or caught exception into an {@link AppResult}.
 *
 * @param call - Async function producing the data payload
 * @param isRetryable - Whether the operation can be retried on failure
 * @returns {@link AppResult} containing data on success or mapped {@link AppError} on failure
 */
export const callResult = async <T>(
  call: () => Promise<T>,
  isRetryable: boolean = false
): Promise<AppResult<T, AppError>> => {
  try {
    const data = await call()
    return appResultSuccess(data)
  } catch (e: unknown) {
    if (isApiException(e)) {
      return appResultFailure(toServerError(e.apiErrorResponse, isRetryable))
    }

    if (isNoInternetException(e)) {
      return appResultFailure(CommonError.noInternetConnection(e, isRetryable))
    }

    if (e instanceof SyntaxError) {
      return appResultFailure(CommonError.contractViolation(e, null, false))
    }

    if (e instanceof TypeError || (e instanceof Error && e.name === 'FetchError')) {
      return appResultFailure(CommonError.network(e, isRetryable))
    }

    return appResultFailure(CommonError.internal(e, isRetryable))
  }
}
