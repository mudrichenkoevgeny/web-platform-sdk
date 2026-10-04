import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { AddUserIdentifierEmailUseCase } from '@/usecase/identifier/AddUserIdentifierEmailUseCase'
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierRepositoryMock } from '@/mock/repository/identifier/IdentifierRepositoryMock'
import { userIdentifierMock } from '@/mock/domain/model/identifier/userIdentifierMock'
/** Mock implementation of {@link AddUserIdentifierEmailUseCase}. */
export class AddUserIdentifierEmailUseCaseMock extends AddUserIdentifierEmailUseCase {
  public executeCalls = 0
  public resultProvider: (email: string, pass: string, code: string) => Promise<AppResult<UserIdentifier, AppError>> =
    async () => appResultSuccess(userIdentifierMock())

  public constructor() {
    super(new IdentifierRepositoryMock())
  }

  public override async execute(email: string, pass: string, code: string): Promise<AppResult<UserIdentifier, AppError>> {
    this.executeCalls++
    return this.resultProvider(email, pass, code)
  }
}
