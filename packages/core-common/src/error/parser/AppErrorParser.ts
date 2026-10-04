import { AppError } from '@/model/AppError'

/**
 * Interface for parsing an {@link AppError} into a human-readable localized string.
 */
export interface AppErrorParser {
  /**
   * Resolves a localized string message for the specified application error.
   *
   * @param error - Application error instance to parse
   * @returns Formatted localized error message string or null if unhandled by this parser
   */
  parse(error: AppError): string | null
}
