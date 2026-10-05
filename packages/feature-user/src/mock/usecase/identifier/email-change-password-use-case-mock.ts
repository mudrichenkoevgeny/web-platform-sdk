import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { EmailChangePasswordUseCase } from '@/usecase/identifier/EmailChangePasswordUseCase'
import { IdentifierRepositoryMock } from '@/mock/repository/identifier/IdentifierRepositoryMock'
/** Mock implementation of {@link EmailChangePasswordUseCase}. */
export class EmailChangePasswordUseCaseMock extends EmailChangePasswordUseCase {
  public executeCalls = 0
  public resultProvider: (email: string, oldPass: string, newPass: string) => Promise<AppResult<void, AppError>> =
    async () => appResultSuccess(undefined)

  public constructor() {
    super(new IdentifierRepositoryMock())
  }

  public override async execute(email: string, oldPass: string, newPass: string): Promise<AppResult<void, AppError>> {
    this.executeCalls++
    return this.resultProvider(email, oldPass, newPass)
  }
}
