import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import { UpdateUserUseCase } from '@/usecase/user/update-user-use-case'
import { ManagementUserRepositoryMock } from '@/mock/repository/user/management-user-repository-mock'
import type { UpdateUserParams } from '@/repository/user/management-user-repository'

/** Mock implementation of {@link UpdateUserUseCase}. */
export class UpdateUserUseCaseMock extends UpdateUserUseCase {
  public resultProvider: (userId: UserId, params: UpdateUserParams) => Promise<AppResult<void, AppError>> =
    async () => appResultSuccess(undefined)

  public constructor() {
    super(new ManagementUserRepositoryMock())
  }

  public override async execute(userId: UserId, params: UpdateUserParams): Promise<AppResult<void, AppError>> {
    return this.resultProvider(userId, params)
  }
}
