import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestUserSessionPrivateList } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSessionListParams, ManagementUserSessionListParams, PagedResult, UserSessionSummary } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementGetSessionsUseCase } from '@/usecase/session/management-get-sessions-use-case'
import { ManagementSessionRepositoryMock } from '@/mock/repository/session/management-session-repository-mock'

/** Mock implementation of {@link ManagementGetSessionsUseCase}. */
export class ManagementGetSessionsUseCaseMock extends ManagementGetSessionsUseCase {
  public resultProvider: (
    params?: ManagementGlobalSessionListParams | ManagementUserSessionListParams | null
  ) => Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> = async () =>
    appResultSuccess(
      createTestPagedResult({
        items: createTestUserSessionPrivateList(2)
      })
    )

  public constructor() {
    super(new ManagementSessionRepositoryMock())
  }

  public override async execute(
    params?: ManagementGlobalSessionListParams | ManagementUserSessionListParams | null
  ): Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> {
    return this.resultProvider(params)
  }
}
