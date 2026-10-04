import { AppError, AppResult, appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserSessionId } from '@mudrichenkoevgeny/shared-foundation'
import { DeleteSessionUseCase } from '@/usecase/session/DeleteSessionUseCase'
import { SessionRepositoryMock } from '@/repository/session/SessionRepositoryMock'

/** Mock implementation of {@link DeleteSessionUseCase}. */
export class DeleteSessionUseCaseMock extends DeleteSessionUseCase {
  public executeCalls = 0
  public resultProvider: (id: UserSessionId) => Promise<AppResult<void, AppError>> = async () => appResultSuccess(undefined)

  public constructor() {
    super(new SessionRepositoryMock())
  }

  public override async invoke(userSessionId: UserSessionId): Promise<AppResult<void, AppError>> {
    this.executeCalls++
    return this.resultProvider(userSessionId)
  }
}
