import { AppError, AppResult, appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AddUserIdentifierEmailUseCase } from '@/usecase/identifier/AddUserIdentifierEmailUseCase'
import { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierRepositoryMock } from '@/repository/identifier/IdentifierRepositoryMock'
import { userIdentifierMock } from '@mudrichenkoevgeny/shared-foundation'

/** Mock implementation of {@link AddUserIdentifierEmailUseCase}. */
export class AddUserIdentifierEmailUseCaseMock extends AddUserIdentifierEmailUseCase {
  public executeCalls = 0
  public resultProvider: (email: string, pass: string, code: string) => Promise<AppResult<UserIdentifier, AppError>> =
    async () => appResultSuccess(userIdentifierMock())

  public constructor() {
    super(new IdentifierRepositoryMock())
  }

  public override async invoke(email: string, pass: string, code: string): Promise<AppResult<UserIdentifier, AppError>> {
    this.executeCalls++
    return this.resultProvider(email, pass, code)
  }
}
