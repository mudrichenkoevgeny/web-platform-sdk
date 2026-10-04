import { AppError, AppResult, appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LogoutUseCase } from '@/usecase/session/LogoutUseCase'
import { SessionRepositoryMock } from '@/repository/session/SessionRepositoryMock'
import { UserRepositoryMock } from '@/repository/user/UserRepositoryMock'

/** Mock implementation of {@link LogoutUseCase}. */
export class LogoutUseCaseMock extends LogoutUseCase {
  public executeCalls = 0
  public resultProvider: () => Promise<AppResult<void, AppError>> = async () => appResultSuccess(undefined)

  public constructor() {
    super(new SessionRepositoryMock(), new UserRepositoryMock())
  }

  public override async invoke(): Promise<AppResult<void, AppError>> {
    this.executeCalls++
    return this.resultProvider()
  }
}
