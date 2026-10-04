import type { AppError } from '@/error/model/AppError'
import type { ErrorId } from '@/error/model/ErrorId'

/**
 * Represents an error returned explicitly by the remote server API.
 */
export class ServerError implements AppError {
  /** Arguments map used for message interpolation. */
  public readonly args: Record<string, string>

  /**
   * Constructs a new {@link ServerError}.
   *
   * @param id - Unique error identifier
   * @param code - Error code string
   * @param message - Raw message string from server response
   * @param args - Key-value map of error parameters
   * @param isRetryable - Whether the failed operation can be retried
   */
  public constructor(
    public readonly id: ErrorId,
    public readonly code: string,
    public readonly message: string,
    args?: Record<string, string>,
    public readonly isRetryable: boolean = false
  ) {
    this.args = args ?? {}
  }
}
