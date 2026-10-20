import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestUserSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserListParams, PagedResult, UserSummary } from '@mudrichenkoevgeny/shared-foundation'
import { GetUsersUseCase } from '@/usecase/user/get-users-use-case'
import { ManagementUserRepositoryMock } from '@/mock/repository/user/management-user-repository-mock'

/** Mock implementation of {@link GetUsersUseCase}. */
export class GetUsersUseCaseMock extends GetUsersUseCase {
  public resultProvider: (
    params?: ManagementUserListParams | null
  ) => Promise<AppResult<PagedResult<UserSummary>, AppError>> = async () =>
    appResultSuccess(
      createTestPagedResult({
        items: createTestUserSummaryList(2)
      })
    )

  public constructor() {
    super(new ManagementUserRepositoryMock())
  }

  public override async execute(
    params?: ManagementUserListParams | null
  ): Promise<AppResult<PagedResult<UserSummary>, AppError>> {
    return this.resultProvider(params)
  }
}
