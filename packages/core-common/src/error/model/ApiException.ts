import { ApiErrorResponse } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Exception thrown when an HTTP API call returns a structured server error response payload.
 */
export class ApiException extends Error {
  /**
   * Constructs a new {@link ApiException}.
   *
   * @param apiErrorResponse - Structured error response payload received from the server API
   */
  public constructor(public readonly apiErrorResponse: ApiErrorResponse) {
    super('ApiException')
    Object.setPrototypeOf(this, ApiException.prototype)
  }
}
