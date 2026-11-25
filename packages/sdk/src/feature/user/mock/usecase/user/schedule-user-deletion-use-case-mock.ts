import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk/core/common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk/core/common";
import { ScheduleUserDeletionUseCase } from '@/feature/user/usecase/user/schedule-user-deletion-use-case'
import { createTestUserPrivatePayload, toUserPrivate, type UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { UserRepositoryMock } from '@/feature/user/mock/repository/user/user-repository-mock'

/** Mock implementation of {@link ScheduleUserDeletionUseCase}. */
export class ScheduleUserDeletionUseCaseMock extends ScheduleUserDeletionUseCase {
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
