import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { RestoreUserUseCase } from '@/usecase/user/restore-user-use-case'
import type { UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { UserRepositoryMock } from '@/mock/repository/user/user-repository-mock'
import { userPrivateMock } from '@/mock/domain/model/user/user-details-mock'
/** Mock implementation of {@link RestoreUserUseCase}. */
export class RestoreUserUseCaseMock extends RestoreUserUseCase {
  public executeCalls = 0
  public resultProvider: () => Promise<AppResult<UserPrivate, AppError>> = async () => appResultSuccess(userPrivateMock())

  public constructor() {
    super(new UserRepositoryMock())
  }

  public override async execute(): Promise<AppResult<UserPrivate, AppError>> {
    this.executeCalls++
    return this.resultProvider()
  }
}
