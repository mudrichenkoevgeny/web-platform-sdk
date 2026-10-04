import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { UserIdentifierId } from '@mudrichenkoevgeny/shared-foundation'
import { GetUserIdentifierUseCase } from '@/usecase/identifier/GetUserIdentifierUseCase'
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierRepositoryMock } from '@/repository/identifier/IdentifierRepositoryMock'
import { userIdentifierMock } from '@mudrichenkoevgeny/shared-foundation'
/** Mock implementation of {@link GetUserIdentifierUseCase}. */
export class GetUserIdentifierUseCaseMock extends GetUserIdentifierUseCase {
  public executeCalls = 0
  public resultProvider: (id: UserIdentifierId) => Promise<AppResult<UserIdentifier, AppError>> =
    async () => appResultSuccess(userIdentifierMock())

  public constructor() {
    super(new IdentifierRepositoryMock())
  }

  public override async invoke(id: UserIdentifierId): Promise<AppResult<UserIdentifier, AppError>> {
    this.executeCalls++
    return this.resultProvider(id)
  }
}
