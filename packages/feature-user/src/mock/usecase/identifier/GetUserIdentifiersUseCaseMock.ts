import { AppError, AppResult, appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { PagedResult } from '@mudrichenkoevgeny/shared-foundation'
import { GetUserIdentifiersUseCase } from '@/usecase/identifier/GetUserIdentifiersUseCase'
import { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierRepositoryMock } from '@/repository/identifier/IdentifierRepositoryMock'

/** Mock implementation of {@link GetUserIdentifiersUseCase}. */
export class GetUserIdentifiersUseCaseMock extends GetUserIdentifiersUseCase {
  public executeCalls = 0
  public resultProvider: (page: number, size: number) => Promise<AppResult<PagedResult<UserIdentifier>, AppError>> =
    async (page, size) => appResultSuccess({ items: [], totalCount: 0, pageNumber: page, pageSize: size, totalPages: 0 })

  public constructor() {
    super(new IdentifierRepositoryMock())
  }

  public override async invoke(pageNumber?: number | null, pageSize?: number | null): Promise<AppResult<PagedResult<UserIdentifier>, AppError>> {
    this.executeCalls++
    return this.resultProvider(pageNumber ?? 1, pageSize ?? 10)
  }
}
