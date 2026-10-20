import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { GetUserUseCase } from '@/usecase/user/get-user-use-case'
import { createTestUserPrivatePayload, toUserPrivate, type UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { UserRepositoryMock } from '@/mock/repository/user/user-repository-mock'

/** Mock implementation of {@link GetUserUseCase}. */
export class GetUserUseCaseMock extends GetUserUseCase {
  public executeCalls = 0
  public resultProvider: () => Promise<AppResult<UserPrivate, AppError>> = async () => appResultSuccess(toUserPrivate(createTestUserPrivatePayload()))

  public constructor() {
    super(new UserRepositoryMock())
  }

  public override async execute(): Promise<AppResult<UserPrivate, AppError>> {
    this.executeCalls++
    return this.resultProvider()
  }
}
