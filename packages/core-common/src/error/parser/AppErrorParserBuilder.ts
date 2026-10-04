import type { AppError } from '@/model/AppError'
import { AppErrorParser } from '@/error/parser/AppErrorParser'

/**
 * Resolver implementation combining specific and common error parsers into a Chain of Responsibility.
 */
export class AppErrorParserResolver implements AppErrorParser {
  /**
   * Constructs a new {@link AppErrorParserResolver}.
   *
   * @param commonParser - Fallback error parser used when specific parsers fail to match
   * @param specificParsers - Ordered list of domain-specific error parsers
   */
  public constructor(
    private readonly commonParser: AppErrorParser,
    private readonly specificParsers: AppErrorParser[] = []
  ) {}

  /**
   * Parses an error by attempting specific parsers sequentially before falling back to the common parser.
   *
   * @param appError - Error to resolve into a localized message
   * @returns Formatted message string or fallback parser result
   */
  public parse(appError: AppError): string | null {
    for (const parser of this.specificParsers) {
      const message = parser.parse(appError)
      if (message !== null) {
        return message
      }
    }
    return this.commonParser.parse(appError)
  }
}

/**
 * Builder utility for assembling an {@link AppErrorParser} chain of responsibility.
 */
export const AppErrorParserBuilder = {
  /**
   * Builds an {@link AppErrorParser} chain combining domain-specific parsers with a common fallback parser.
   *
   * @param commonParser - Base fallback error parser
   * @param specificParsers - Array of feature-specific error parsers
   * @returns Composite {@link AppErrorParser} instance
   */
  build(
    commonParser: AppErrorParser,
    specificParsers: AppErrorParser[] = []
  ): AppErrorParser {
    return new AppErrorParserResolver(commonParser, specificParsers)
  }
}
