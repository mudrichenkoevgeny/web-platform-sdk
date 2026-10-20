import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId, UserIdentifierId } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementDeleteIdentifierUseCase } from '@/usecase/identifier/management-delete-identifier-use-case'
import { ManagementIdentifierRepositoryMock } from '@/mock/repository/identifier/management-identifier-repository-mock'

/** Mock implementation of {@link ManagementDeleteIdentifierUseCase}. */
export class ManagementDeleteIdentifierUseCaseMock extends ManagementDeleteIdentifierUseCase {
  public resultProvider: (userId: UserId, identifierId: UserIdentifierId) => Promise<AppResult<void, AppError>> =
    async () => appResultSuccess(undefined)

  public constructor() {
    super(new ManagementIdentifierRepositoryMock())
  }

  public override async execute(userId: UserId, identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    return this.resultProvider(userId, identifierId)
  }
}
