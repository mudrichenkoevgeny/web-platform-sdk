import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { createTestUserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifierId } from '@mudrichenkoevgeny/shared-foundation'
import { GetUserIdentifierUseCase } from '@/usecase/identifier/get-user-identifier-use-case'
import type { UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierRepositoryMock } from '@/mock/repository/identifier/identifier-repository-mock'
/** Mock implementation of {@link GetUserIdentifierUseCase}. */
export class GetUserIdentifierUseCaseMock extends GetUserIdentifierUseCase {
  public executeCalls = 0
  public resultProvider: (id: UserIdentifierId) => Promise<AppResult<UserIdentifierPrivate, AppError>> =
    async () => appResultSuccess(createTestUserIdentifierPrivate())

  public constructor() {
    super(new IdentifierRepositoryMock())
  }

  public override async execute(id: UserIdentifierId): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    this.executeCalls++
    return this.resultProvider(id)
  }
}
