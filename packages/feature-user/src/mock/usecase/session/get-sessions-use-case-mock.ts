import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestUserSessionSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import type { PagedResult, SelfSessionListParams, UserSessionSummary } from '@mudrichenkoevgeny/shared-foundation'
import { GetSessionsUseCase } from '@/usecase/session/get-sessions-use-case'
import { SessionRepositoryMock } from '@/mock/repository/session/session-repository-mock'

/** Mock implementation of {@link GetSessionsUseCase}. */
export class GetSessionsUseCaseMock extends GetSessionsUseCase {
  public executeCalls = 0
  public resultProvider: (params?: SelfSessionListParams | null) => Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> =
    async () =>
      appResultSuccess(
        createTestPagedResult({
          items: createTestUserSessionSummaryList(2)
        })
      )

  public constructor() {
    super(new SessionRepositoryMock())
  }

  public override async execute(params?: SelfSessionListParams | null): Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> {
    this.executeCalls++
    return this.resultProvider(params)
  }
}
