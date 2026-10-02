import { ApiErrorResponse } from '@mudrichenkoevgeny/shared-foundation'

export class ApiException extends Error {
  public constructor(public readonly apiErrorResponse: ApiErrorResponse) {
    super('ApiException')
    Object.setPrototypeOf(this, ApiException.prototype)
  }
}
