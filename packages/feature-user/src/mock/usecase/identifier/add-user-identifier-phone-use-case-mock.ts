import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { AddUserIdentifierPhoneUseCase } from '@/usecase/identifier/add-user-identifier-phone-use-case'
import type { UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierRepositoryMock } from '@/mock/repository/identifier/identifier-repository-mock'
import { userIdentifierPrivateMock } from '@/mock/domain/model/identifier/user-identifier-mock'
/** Mock implementation of {@link AddUserIdentifierPhoneUseCase}. */
export class AddUserIdentifierPhoneUseCaseMock extends AddUserIdentifierPhoneUseCase {
  public executeCalls = 0
  public resultProvider: (phone: string, code: string) => Promise<AppResult<UserIdentifierPrivate, AppError>> =
    async () => appResultSuccess(userIdentifierPrivateMock())

  public constructor() {
    super(new IdentifierRepositoryMock())
  }

  public override async execute(phone: string, code: string): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    this.executeCalls++
    return this.resultProvider(phone, code)
  }
}
