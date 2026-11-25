import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk/core/common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk/core/common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementDeleteAllUserSessionsUseCase } from '@/feature/management-user/usecase/session/management-delete-all-user-sessions-use-case'
import { ManagementSessionRepositoryMock } from '@/feature/management-user/mock/repository/session/management-session-repository-mock'

/** Mock implementation of {@link ManagementDeleteAllUserSessionsUseCase}. */
export class ManagementDeleteAllUserSessionsUseCaseMock extends ManagementDeleteAllUserSessionsUseCase {
  public resultProvider: (userId: UserId) => Promise<AppResult<void, AppError>> =
    async () => appResultSuccess(undefined)

  public constructor() {
    super(new ManagementSessionRepositoryMock())
  }

  public override async execute(userId: UserId): Promise<AppResult<void, AppError>> {
    return this.resultProvider(userId)
  }
}
