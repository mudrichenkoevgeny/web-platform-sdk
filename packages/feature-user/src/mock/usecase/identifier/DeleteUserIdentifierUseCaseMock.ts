import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { UserIdentifierId } from '@mudrichenkoevgeny/shared-foundation'
import { DeleteUserIdentifierUseCase } from '@/usecase/identifier/DeleteUserIdentifierUseCase'
import { IdentifierRepositoryMock } from '@/repository/identifier/IdentifierRepositoryMock'
/** Mock implementation of {@link DeleteUserIdentifierUseCase}. */
export class DeleteUserIdentifierUseCaseMock extends DeleteUserIdentifierUseCase {
  public executeCalls = 0
  public resultProvider: (id: UserIdentifierId) => Promise<AppResult<void, AppError>> =
    async () => appResultSuccess(undefined)

  public constructor() {
    super(new IdentifierRepositoryMock())
  }

  public override async invoke(id: UserIdentifierId): Promise<AppResult<void, AppError>> {
    this.executeCalls++
    return this.resultProvider(id)
  }
}
