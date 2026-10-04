import { AppError, AppResult, appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ScheduleUserDeletionUseCase } from '@/usecase/user/ScheduleUserDeletionUseCase'
import { UserDetails } from '@mudrichenkoevgeny/shared-foundation'
import { UserRepositoryMock } from '@/repository/user/UserRepositoryMock'
import { userDetailsMock } from '@mudrichenkoevgeny/shared-foundation'

/** Mock implementation of {@link ScheduleUserDeletionUseCase}. */
export class ScheduleUserDeletionUseCaseMock extends ScheduleUserDeletionUseCase {
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
