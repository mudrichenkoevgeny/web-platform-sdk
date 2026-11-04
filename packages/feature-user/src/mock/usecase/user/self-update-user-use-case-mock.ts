import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SelfUpdateUserUseCase } from '@/usecase/user/self-update-user-use-case'
import type { UpdateUserParams } from '@/usecase/user/self-update-user-use-case'
import { createTestUserPrivatePayload, toUserPrivate, type UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { UserRepositoryMock } from '@/mock/repository/user/user-repository-mock'

/** Mock implementation of {@link SelfUpdateUserUseCase}. */
export class SelfUpdateUserUseCaseMock extends SelfUpdateUserUseCase {
  public executeCalls = 0
  public lastRequest: UpdateUserParams | null = null
  public resultProvider: (request: UpdateUserParams) => Promise<AppResult<UserPrivate, AppError>> = async () =>
    appResultSuccess(toUserPrivate(createTestUserPrivatePayload()))

  public constructor() {
    super(new UserRepositoryMock())
  }

  public override async execute(request: UpdateUserParams): Promise<AppResult<UserPrivate, AppError>> {
    this.executeCalls++
    this.lastRequest = request
    return this.resultProvider(request)
  }
}
