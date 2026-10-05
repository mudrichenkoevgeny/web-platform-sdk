import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { DeleteAllOtherSessionsUseCase } from '@/usecase/session/delete-all-other-sessions-use-case'
import { SessionRepositoryMock } from '@/mock/repository/session/session-repository-mock'
/** Mock implementation of {@link DeleteAllOtherSessionsUseCase}. */
export class DeleteAllOtherSessionsUseCaseMock extends DeleteAllOtherSessionsUseCase {
  public executeCalls = 0
  public resultProvider: () => Promise<AppResult<void, AppError>> = async () => appResultSuccess(undefined)

  public constructor() {
    super(new SessionRepositoryMock())
  }

  public override async execute(): Promise<AppResult<void, AppError>> {
    this.executeCalls++
    return this.resultProvider()
  }
}
