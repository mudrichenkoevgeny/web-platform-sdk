import { AppError } from '../model/AppError'
import { AppErrorParser } from './AppErrorParser'

export class AppErrorParserResolver implements AppErrorParser {
  public constructor(
    private readonly commonParser: AppErrorParser,
    private readonly specificParsers: AppErrorParser[] = []
  ) {}

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

export const AppErrorParserBuilder = {
  build(
    commonParser: AppErrorParser,
    specificParsers: AppErrorParser[] = []
  ): AppErrorParser {
    return new AppErrorParserResolver(commonParser, specificParsers)
  }
}
