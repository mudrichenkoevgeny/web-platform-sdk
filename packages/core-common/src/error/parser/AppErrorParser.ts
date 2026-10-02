import { AppError } from '../model/AppError'

export interface AppErrorParser {
  parse(error: AppError): string | null
}
