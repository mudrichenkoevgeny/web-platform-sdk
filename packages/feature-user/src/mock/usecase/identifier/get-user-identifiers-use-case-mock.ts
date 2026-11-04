import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestUserIdentifierSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import type { PagedResult, SelfIdentifierListParams, UserIdentifierSummary } from '@mudrichenkoevgeny/shared-foundation'
import { GetUserIdentifiersUseCase } from '@/usecase/identifier/get-user-identifiers-use-case'
import { IdentifierRepositoryMock } from '@/mock/repository/identifier/identifier-repository-mock'

/** Mock implementation of {@link GetUserIdentifiersUseCase}. */
export class GetUserIdentifiersUseCaseMock extends GetUserIdentifiersUseCase {
  public executeCalls = 0
  public resultProvider: (params?: SelfIdentifierListParams | null) => Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>> =
    async () =>
      appResultSuccess(
        createTestPagedResult({
          items: createTestUserIdentifierSummaryList(2)
        })
      )

  public constructor() {
    super(new IdentifierRepositoryMock())
  }

  public override async execute(params?: SelfIdentifierListParams | null): Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>> {
    this.executeCalls++
    return this.resultProvider(params)
  }
}
