import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserPrivatePayload, toUserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { UserId, UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { GetUserUseCase } from '@/usecase/user/get-user-use-case'
import { ManagementUserRepositoryMock } from '@/mock/repository/user/management-user-repository-mock'

/** Mock implementation of {@link GetUserUseCase}. */
export class GetUserUseCaseMock extends GetUserUseCase {
  public resultProvider: (userId: UserId) => Promise<AppResult<UserPrivate, AppError>> =
    async () => appResultSuccess(toUserPrivate(createTestUserPrivatePayload()))

  public constructor() {
    super(new ManagementUserRepositoryMock())
  }

  public override async execute(userId: UserId): Promise<AppResult<UserPrivate, AppError>> {
    return this.resultProvider(userId)
  }
}
