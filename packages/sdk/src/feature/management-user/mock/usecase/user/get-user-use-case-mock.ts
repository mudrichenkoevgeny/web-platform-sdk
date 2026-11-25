import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk/core/common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk/core/common'
import { createTestUserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { UserId, UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { GetUserUseCase } from '@/feature/management-user/usecase/user/get-user-use-case'
import { ManagementUserRepositoryMock } from '@/feature/management-user/mock/repository/user/management-user-repository-mock'

/** Mock implementation of {@link GetUserUseCase}. */
export class GetUserUseCaseMock extends GetUserUseCase {
  public resultProvider: (userId: UserId) => Promise<AppResult<UserPrivate, AppError>> =
    async () => appResultSuccess(createTestUserPrivate())

  public constructor() {
    super(new ManagementUserRepositoryMock())
  }

  public override async execute(userId: UserId): Promise<AppResult<UserPrivate, AppError>> {
    return this.resultProvider(userId)
  }
}
