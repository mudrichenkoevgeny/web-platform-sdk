import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { GetUserUseCase } from '@/usecase/user/GetUserUseCase'
import type { UserDetails } from '@mudrichenkoevgeny/shared-foundation'
import { UserRepositoryMock } from '@/repository/user/UserRepositoryMock'
import { userDetailsMock } from '@mudrichenkoevgeny/shared-foundation'
/** Mock implementation of {@link GetUserUseCase}. */
export class GetUserUseCaseMock extends GetUserUseCase {
  public executeCalls = 0
  public resultProvider: () => Promise<AppResult<UserDetails, AppError>> = async () => appResultSuccess(userDetailsMock())

  public constructor() {
    super(new UserRepositoryMock())
  }

  public override async invoke(): Promise<AppResult<UserDetails, AppError>> {
    this.executeCalls++
    return this.resultProvider()
  }
}
