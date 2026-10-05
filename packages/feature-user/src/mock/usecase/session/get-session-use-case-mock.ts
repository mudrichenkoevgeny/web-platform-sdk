import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { UserSessionId } from '@mudrichenkoevgeny/shared-foundation'
import { GetSessionUseCase } from '@/usecase/session/GetSessionUseCase'
import type { UserSession } from '@mudrichenkoevgeny/shared-foundation'
import { SessionRepositoryMock } from '@/mock/repository/session/SessionRepositoryMock'
import { userSessionMock } from '@/mock/domain/model/session/userSessionMock'
/** Mock implementation of {@link GetSessionUseCase}. */
export class GetSessionUseCaseMock extends GetSessionUseCase {
  public executeCalls = 0
  public lastSessionId: UserSessionId | null = null
  public resultProvider: (id: UserSessionId) => Promise<AppResult<UserSession, AppError>> =
    async () => appResultSuccess(userSessionMock())

  public constructor() {
    super(new SessionRepositoryMock())
  }

  public override async execute(userSessionId: UserSessionId): Promise<AppResult<UserSession, AppError>> {
    this.executeCalls++
    this.lastSessionId = userSessionId
    return this.resultProvider(userSessionId)
  }
}
