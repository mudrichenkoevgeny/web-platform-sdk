import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { GetUserUseCase } from '@/usecase/user/get-user-use-case'
import type { UserDetails } from '@mudrichenkoevgeny/shared-foundation'
import { UserRepositoryMock } from '@/mock/repository/user/user-repository-mock'
import { userDetailsMock } from '@/mock/domain/model/user/user-details-mock'
/** Mock implementation of {@link GetUserUseCase}. */
export class GetUserUseCaseMock extends GetUserUseCase {
  public executeCalls = 0
  public resultProvider: () => Promise<AppResult<UserDetails, AppError>> = async () => appResultSuccess(userDetailsMock())

  public constructor() {
    super(new UserRepositoryMock())
  }

  public override async execute(): Promise<AppResult<UserDetails, AppError>> {
    this.executeCalls++
    return this.resultProvider()
  }
}
