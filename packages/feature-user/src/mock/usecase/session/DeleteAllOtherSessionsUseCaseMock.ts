import { AppError, AppResult, appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { DeleteAllOtherSessionsUseCase } from '@/usecase/session/DeleteAllOtherSessionsUseCase'
import { SessionRepositoryMock } from '@/repository/session/SessionRepositoryMock'

/** Mock implementation of {@link DeleteAllOtherSessionsUseCase}. */
export class DeleteAllOtherSessionsUseCaseMock extends DeleteAllOtherSessionsUseCase {
  public executeCalls = 0
  public resultProvider: () => Promise<AppResult<void, AppError>> = async () => appResultSuccess(undefined)

  public constructor() {
    super(new SessionRepositoryMock())
  }

  public override async invoke(): Promise<AppResult<void, AppError>> {
    this.executeCalls++
    return this.resultProvider()
  }
}
