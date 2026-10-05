import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { UserIdentifierId } from '@mudrichenkoevgeny/shared-foundation'
import { GetUserIdentifierUseCase } from '@/usecase/identifier/get-user-identifier-use-case'
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierRepositoryMock } from '@/mock/repository/identifier/identifier-repository-mock'
import { userIdentifierMock } from '@/mock/domain/model/identifier/user-identifier-mock'
/** Mock implementation of {@link GetUserIdentifierUseCase}. */
export class GetUserIdentifierUseCaseMock extends GetUserIdentifierUseCase {
  public executeCalls = 0
  public resultProvider: (id: UserIdentifierId) => Promise<AppResult<UserIdentifier, AppError>> =
    async () => appResultSuccess(userIdentifierMock())

  public constructor() {
    super(new IdentifierRepositoryMock())
  }

  public override async execute(id: UserIdentifierId): Promise<AppResult<UserIdentifier, AppError>> {
    this.executeCalls++
    return this.resultProvider(id)
  }
}
