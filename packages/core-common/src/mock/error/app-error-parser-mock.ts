import { AppError } from '@/error/model/app-error'
import { AppErrorParser } from '@/error/parser/app-error-parser'

/**
 * Mock implementation of {@link AppErrorParser} for testing error message resolution.
 */
export class AppErrorParserMock implements AppErrorParser {
  private readonly fallbackMessage: string
  private readonly parsedMessages = new Map<string, string>()

  /**
   * Initializes a new instance of {@link AppErrorParserMock}.
   *
   * @param fallbackMessage - Default message returned when no specific mapping exists
   */
  public constructor(fallbackMessage: string = 'Mock error message') {
    this.fallbackMessage = fallbackMessage
  }

  /**
   * Registers a mock parsed message for a given error code.
   *
   * @param code - Error code to associate with the message
   * @param message - User-facing message to return for the error code
   */
  public mockParseForCode(code: string, message: string): void {
    this.parsedMessages.set(code, message)
  }

  /**
   * Parses an {@link AppError} into a human-readable message.
   *
   * @param error - Application error to parse
   * @returns Resolved message string or fallback message
   */
  public parse(error: AppError): string | null {
    if (this.parsedMessages.has(error.code)) {
      return this.parsedMessages.get(error.code) as string
    }
    return this.fallbackMessage
  }
}
