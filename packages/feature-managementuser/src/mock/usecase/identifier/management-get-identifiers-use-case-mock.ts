import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestUserIdentifierPrivateList } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalIdentifierListParams, ManagementUserIdentifierListParams, PagedResult, UserIdentifierSummary } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementGetIdentifiersUseCase } from '@/usecase/identifier/management-get-identifiers-use-case'
import { ManagementIdentifierRepositoryMock } from '@/mock/repository/identifier/management-identifier-repository-mock'

/** Mock implementation of {@link ManagementGetIdentifiersUseCase}. */
export class ManagementGetIdentifiersUseCaseMock extends ManagementGetIdentifiersUseCase {
  public resultProvider: (
    params?: ManagementGlobalIdentifierListParams | ManagementUserIdentifierListParams | null
  ) => Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>> = async () =>
    appResultSuccess(
      createTestPagedResult({
        items: createTestUserIdentifierPrivateList(2)
      })
    )

  public constructor() {
    super(new ManagementIdentifierRepositoryMock())
  }

  public override async execute(
    params?: ManagementGlobalIdentifierListParams | ManagementUserIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>> {
    return this.resultProvider(params)
  }
}
