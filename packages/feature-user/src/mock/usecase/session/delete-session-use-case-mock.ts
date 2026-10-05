import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { UserSessionId } from '@mudrichenkoevgeny/shared-foundation'
import { DeleteSessionUseCase } from '@/usecase/session/delete-session-use-case'
import { SessionRepositoryMock } from '@/mock/repository/session/session-repository-mock'
/** Mock implementation of {@link DeleteSessionUseCase}. */
export class DeleteSessionUseCaseMock extends DeleteSessionUseCase {
  public executeCalls = 0
  public resultProvider: (id: UserSessionId) => Promise<AppResult<void, AppError>> = async () => appResultSuccess(undefined)

  public constructor() {
    super(new SessionRepositoryMock())
  }

  public override async execute(userSessionId: UserSessionId): Promise<AppResult<void, AppError>> {
    this.executeCalls++
    return this.resultProvider(userSessionId)
  }
}
