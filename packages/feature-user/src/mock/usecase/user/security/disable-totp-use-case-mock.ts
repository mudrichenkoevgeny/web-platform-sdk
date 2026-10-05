import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { DisableTotpUseCase } from '@/usecase/user/security/DisableTotpUseCase'
import { UserSecurityRepositoryMock } from '@/mock/repository/user/security/UserSecurityRepositoryMock'
/** Mock implementation of {@link DisableTotpUseCase}. */
export class DisableTotpUseCaseMock extends DisableTotpUseCase {
  public executeCalls = 0
  public resultProvider: () => Promise<AppResult<void, AppError>> = async () => appResultFailure(CommonError.unknown())

  public constructor() {
    super(new UserSecurityRepositoryMock())
  }

  public override async execute(): Promise<AppResult<void, AppError>> {
    this.executeCalls++
    return this.resultProvider()
  }
}
