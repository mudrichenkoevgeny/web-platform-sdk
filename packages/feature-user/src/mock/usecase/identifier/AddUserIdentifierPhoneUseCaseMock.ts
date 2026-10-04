import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { AddUserIdentifierPhoneUseCase } from '@/usecase/identifier/AddUserIdentifierPhoneUseCase'
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierRepositoryMock } from '@/repository/identifier/IdentifierRepositoryMock'
import { userIdentifierMock } from '@mudrichenkoevgeny/shared-foundation'
/** Mock implementation of {@link AddUserIdentifierPhoneUseCase}. */
export class AddUserIdentifierPhoneUseCaseMock extends AddUserIdentifierPhoneUseCase {
  public executeCalls = 0
  public resultProvider: (phone: string, code: string) => Promise<AppResult<UserIdentifier, AppError>> =
    async () => appResultSuccess(userIdentifierMock())

  public constructor() {
    super(new IdentifierRepositoryMock())
  }

  public override async invoke(phone: string, code: string): Promise<AppResult<UserIdentifier, AppError>> {
    this.executeCalls++
    return this.resultProvider(phone, code)
  }
}
