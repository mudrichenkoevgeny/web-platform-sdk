import { ApiErrorResponse } from '@mudrichenkoevgeny/shared-foundation'
import { ServerError } from '../model/ServerError'
import { generateErrorId, toErrorIdOrNull } from '../model/ErrorId'

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
