import { ApiErrorResponse } from '@mudrichenkoevgeny/shared-foundation'
import { ServerError } from '../model/ServerError'
import { generateErrorId, toErrorIdOrNull } from '../model/ErrorId'

/**
 * Converts a structured API error response payload into a {@link ServerError}.
 *
 * @param apiErrorResponse - Structured server API error payload
 * @param isRetryable - Whether the failed request can be retried
 * @returns Mapped ServerError domain model instance
 */
export const toServerError = (
  apiErrorResponse: ApiErrorResponse,
  isRetryable: boolean = false
): ServerError => {
  return new ServerError(
    toErrorIdOrNull(apiErrorResponse.id) ?? generateErrorId(),
    apiErrorResponse.code,
    apiErrorResponse.message,
    apiErrorResponse.args,
    isRetryable
  )
}
