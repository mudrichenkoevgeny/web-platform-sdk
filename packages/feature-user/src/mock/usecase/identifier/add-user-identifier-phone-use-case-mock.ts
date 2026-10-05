import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { AddUserIdentifierPhoneUseCase } from '@/usecase/identifier/add-user-identifier-phone-use-case'
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierRepositoryMock } from '@/mock/repository/identifier/identifier-repository-mock'
import { userIdentifierMock } from '@/mock/domain/model/identifier/user-identifier-mock'
/** Mock implementation of {@link AddUserIdentifierPhoneUseCase}. */
export class AddUserIdentifierPhoneUseCaseMock extends AddUserIdentifierPhoneUseCase {
  public executeCalls = 0
  public resultProvider: (phone: string, code: string) => Promise<AppResult<UserIdentifier, AppError>> =
    async () => appResultSuccess(userIdentifierMock())

  public constructor() {
    super(new IdentifierRepositoryMock())
  }

  public override async execute(phone: string, code: string): Promise<AppResult<UserIdentifier, AppError>> {
    this.executeCalls++
    return this.resultProvider(phone, code)
  }
}
