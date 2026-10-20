import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementDeleteSessionUseCase } from '@/usecase/session/management-delete-session-use-case'
import { ManagementSessionRepositoryMock } from '@/mock/repository/session/management-session-repository-mock'

/** Mock implementation of {@link ManagementDeleteSessionUseCase}. */
export class ManagementDeleteSessionUseCaseMock extends ManagementDeleteSessionUseCase {
  public resultProvider: (userId: UserId, sessionId: string) => Promise<AppResult<void, AppError>> =
    async () => appResultSuccess(undefined)

  public constructor() {
    super(new ManagementSessionRepositoryMock())
  }

  public override async execute(userId: UserId, sessionId: string): Promise<AppResult<void, AppError>> {
    return this.resultProvider(userId, sessionId)
  }
}
