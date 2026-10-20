import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserPrivatePayload, toUserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { CreateUserUseCase } from '@/usecase/user/create-user-use-case'
import { ManagementUserRepositoryMock } from '@/mock/repository/user/management-user-repository-mock'
import type { CreateUserParams } from '@/repository/user/management-user-repository'

/** Mock implementation of {@link CreateUserUseCase}. */
export class CreateUserUseCaseMock extends CreateUserUseCase {
  public resultProvider: (params: CreateUserParams) => Promise<AppResult<UserPrivate, AppError>> =
    async () => appResultSuccess(toUserPrivate(createTestUserPrivatePayload()))

  public constructor() {
    super(new ManagementUserRepositoryMock())
  }

  public override async execute(params: CreateUserParams): Promise<AppResult<UserPrivate, AppError>> {
    return this.resultProvider(params)
  }
}
