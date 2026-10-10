import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { ScheduleUserDeletionUseCase } from '@/usecase/user/schedule-user-deletion-use-case'
import type { UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { UserRepositoryMock } from '@/mock/repository/user/user-repository-mock'
import { userPrivateMock } from '@/mock/domain/model/user/user-details-mock'
/** Mock implementation of {@link ScheduleUserDeletionUseCase}. */
export class ScheduleUserDeletionUseCaseMock extends ScheduleUserDeletionUseCase {
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
