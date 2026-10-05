import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { LogoutUseCase } from '@/usecase/session/logout-use-case'
import { SessionRepositoryMock } from '@/mock/repository/session/session-repository-mock'
import { UserRepositoryMock } from '@/mock/repository/user/user-repository-mock'
/** Mock implementation of {@link LogoutUseCase}. */
export class LogoutUseCaseMock extends LogoutUseCase {
  public executeCalls = 0
  public resultProvider: () => Promise<AppResult<void, AppError>> = async () => appResultSuccess(undefined)

  public constructor() {
    super(new SessionRepositoryMock(), new UserRepositoryMock())
  }

  public override async execute(): Promise<AppResult<void, AppError>> {
    this.executeCalls++
    return this.resultProvider()
  }
}
