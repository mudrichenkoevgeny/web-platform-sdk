import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { PagedResult, SelfSessionListParams, UserSessionSummary } from '@mudrichenkoevgeny/shared-foundation'
import { GetSessionsUseCase } from '@/usecase/session/get-sessions-use-case'
import { SessionRepositoryMock } from '@/mock/repository/session/session-repository-mock'
/** Mock implementation of {@link GetSessionsUseCase}. */
export class GetSessionsUseCaseMock extends GetSessionsUseCase {
  public executeCalls = 0
  public resultProvider: (params?: SelfSessionListParams | null) => Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> =
    async (params) => appResultSuccess({ items: [], totalCount: 0, pageNumber: params?.pageNumber ?? 1, pageSize: params?.pageSize ?? 10, totalPages: 0 })

  public constructor() {
    super(new SessionRepositoryMock())
  }

  public override async execute(params?: SelfSessionListParams | null): Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> {
    this.executeCalls++
    return this.resultProvider(params)
  }
}
