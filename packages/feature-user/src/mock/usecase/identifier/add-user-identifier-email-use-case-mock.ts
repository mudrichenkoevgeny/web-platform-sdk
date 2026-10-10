import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { AddUserIdentifierEmailUseCase } from '@/usecase/identifier/add-user-identifier-email-use-case'
import type { UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierRepositoryMock } from '@/mock/repository/identifier/identifier-repository-mock'
import { userIdentifierPrivateMock } from '@/mock/domain/model/identifier/user-identifier-mock'
/** Mock implementation of {@link AddUserIdentifierEmailUseCase}. */
export class AddUserIdentifierEmailUseCaseMock extends AddUserIdentifierEmailUseCase {
  public executeCalls = 0
  public resultProvider: (email: string, pass: string, code: string) => Promise<AppResult<UserIdentifierPrivate, AppError>> =
    async () => appResultSuccess(userIdentifierPrivateMock())

  public constructor() {
    super(new IdentifierRepositoryMock())
  }

  public override async execute(email: string, pass: string, code: string): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    this.executeCalls++
    return this.resultProvider(email, pass, code)
  }
}
