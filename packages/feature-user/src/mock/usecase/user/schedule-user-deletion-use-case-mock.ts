import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { ScheduleUserDeletionUseCase } from '@/usecase/user/ScheduleUserDeletionUseCase'
import type { UserDetails } from '@mudrichenkoevgeny/shared-foundation'
import { UserRepositoryMock } from '@/mock/repository/user/UserRepositoryMock'
import { userDetailsMock } from '@/mock/domain/model/user/userDetailsMock'
/** Mock implementation of {@link ScheduleUserDeletionUseCase}. */
export class ScheduleUserDeletionUseCaseMock extends ScheduleUserDeletionUseCase {
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
