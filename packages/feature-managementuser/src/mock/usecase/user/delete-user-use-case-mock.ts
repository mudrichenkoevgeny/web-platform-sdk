import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import { DeleteUserUseCase } from '@/usecase/user/delete-user-use-case'
import { ManagementUserRepositoryMock } from '@/mock/repository/user/management-user-repository-mock'

/** Mock implementation of {@link DeleteUserUseCase}. */
export class DeleteUserUseCaseMock extends DeleteUserUseCase {
  public resultProvider: (userId: UserId) => Promise<AppResult<void, AppError>> =
    async () => appResultSuccess(undefined)

  public constructor() {
    super(new ManagementUserRepositoryMock())
  }

  public override async execute(userId: UserId): Promise<AppResult<void, AppError>> {
    return this.resultProvider(userId)
  }
}
