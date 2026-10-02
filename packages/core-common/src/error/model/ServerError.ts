import { AppError } from './AppError'
import { ErrorId } from './ErrorId'

export class ServerError implements AppError {
  public readonly args: Record<string, string>

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
