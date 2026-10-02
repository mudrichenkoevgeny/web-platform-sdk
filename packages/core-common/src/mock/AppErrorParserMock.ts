import { AppError } from '../error/model/AppError'
import { AppErrorParser } from '../error/parser/AppErrorParser'

export class AppErrorParserMock implements AppErrorParser {
  private readonly fallbackMessage: string
  private readonly parsedMessages = new Map<string, string>()

  public constructor(fallbackMessage: string = 'Mock error message') {
    this.fallbackMessage = fallbackMessage
  }

  public mockParseForCode(code: string, message: string): void {
    this.parsedMessages.set(code, message)
  }

  public parse(error: AppError): string | null {
    if (this.parsedMessages.has(error.code)) {
      return this.parsedMessages.get(error.code) as string
    }
    return this.fallbackMessage
  }
}
