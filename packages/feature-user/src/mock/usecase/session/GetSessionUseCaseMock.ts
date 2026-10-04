import { AppError, AppResult, appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserSessionId } from '@mudrichenkoevgeny/shared-foundation'
import { GetSessionUseCase } from '@/usecase/session/GetSessionUseCase'
import { UserSession } from '@mudrichenkoevgeny/shared-foundation'
import { SessionRepositoryMock } from '@/repository/session/SessionRepositoryMock'
import { userSessionMock } from '@mudrichenkoevgeny/shared-foundation'

/** Mock implementation of {@link GetSessionUseCase}. */
export class GetSessionUseCaseMock extends GetSessionUseCase {
  public executeCalls = 0
  public lastSessionId: UserSessionId | null = null
  public resultProvider: (id: UserSessionId) => Promise<AppResult<UserSession, AppError>> =
    async () => appResultSuccess(userSessionMock())

  public constructor() {
    super(new SessionRepositoryMock())
  }

  public override async invoke(userSessionId: UserSessionId): Promise<AppResult<UserSession, AppError>> {
    this.executeCalls++
    this.lastSessionId = userSessionId
    return this.resultProvider(userSessionId)
  }
}
