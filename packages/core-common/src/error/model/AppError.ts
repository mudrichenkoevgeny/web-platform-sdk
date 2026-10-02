import { ErrorId } from './ErrorId'

export interface AppError {
  readonly id: ErrorId
  readonly code: string
  readonly args?: Record<string, string> | null
  readonly isRetryable: boolean
}
