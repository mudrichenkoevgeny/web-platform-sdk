import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { LogoutUseCase } from '@/usecase/session/LogoutUseCase'
import { SessionRepositoryMock } from '@/mock/repository/session/SessionRepositoryMock'
import { UserRepositoryMock } from '@/mock/repository/user/UserRepositoryMock'
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
