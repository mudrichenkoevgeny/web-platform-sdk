import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import type { PagedResult } from '@mudrichenkoevgeny/shared-foundation'
import { GetSessionsUseCase } from '@/usecase/session/GetSessionsUseCase'
import type { UserSession } from '@mudrichenkoevgeny/shared-foundation'
import { SessionRepositoryMock } from '@/repository/session/SessionRepositoryMock'
/** Mock implementation of {@link GetSessionsUseCase}. */
export class GetSessionsUseCaseMock extends GetSessionsUseCase {
  public executeCalls = 0
  public resultProvider: (page: number, size: number) => Promise<AppResult<PagedResult<UserSession>, AppError>> =
    async (page, size) => appResultSuccess({ items: [], totalCount: 0, pageNumber: page, pageSize: size, totalPages: 0 })

  public constructor() {
    super(new SessionRepositoryMock())
  }

  public override async invoke(pageNumber?: number | null, pageSize?: number | null): Promise<AppResult<PagedResult<UserSession>, AppError>> {
    this.executeCalls++
    return this.resultProvider(pageNumber ?? 1, pageSize ?? 10)
  }
}
