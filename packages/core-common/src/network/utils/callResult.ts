import { AppResult, appResultSuccess, appResultFailure } from '@/result/AppResult'
import { AppError } from '@/error/model/AppError'
import { ApiException } from '@/error/model/ApiException'
import { toServerError } from '@/error/mapper/toServerError'
import { CommonError } from '@/error/model/CommonError'
import { isNoInternetException } from './isNoInternetException'

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
    if (e instanceof ApiException) {
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
