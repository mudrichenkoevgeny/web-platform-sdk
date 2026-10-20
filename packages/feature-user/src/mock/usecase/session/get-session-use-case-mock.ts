import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { createTestUserSessionPrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { UserSessionId } from '@mudrichenkoevgeny/shared-foundation'
import { GetSessionUseCase } from '@/usecase/session/get-session-use-case'
import type { UserSessionPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { SessionRepositoryMock } from '@/mock/repository/session/session-repository-mock'
/** Mock implementation of {@link GetSessionUseCase}. */
export class GetSessionUseCaseMock extends GetSessionUseCase {
  public executeCalls = 0
  public lastSessionId: UserSessionId | null = null
  public resultProvider: (id: UserSessionId) => Promise<AppResult<UserSessionPrivate, AppError>> =
    async () => appResultSuccess(createTestUserSessionPrivate())

  public constructor() {
    super(new SessionRepositoryMock())
  }

  public override async execute(userSessionId: UserSessionId): Promise<AppResult<UserSessionPrivate, AppError>> {
    this.executeCalls++
    this.lastSessionId = userSessionId
    return this.resultProvider(userSessionId)
  }
}
