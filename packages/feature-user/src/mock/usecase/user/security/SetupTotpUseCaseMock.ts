import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { SetupTotpUseCase } from '@/usecase/user/security/SetupTotpUseCase'
import type { TotpSetup } from '@mudrichenkoevgeny/shared-foundation'
import { UserSecurityRepositoryMock } from '@/repository/user/security/UserSecurityRepositoryMock'
/** Mock implementation of {@link SetupTotpUseCase}. */
export class SetupTotpUseCaseMock extends SetupTotpUseCase {
  public executeCalls = 0
  public resultProvider: () => Promise<AppResult<TotpSetup, AppError>> = async () => appResultFailure(CommonError.unknown())

  public constructor() {
    super(new UserSecurityRepositoryMock())
  }

  public override async invoke(): Promise<AppResult<TotpSetup, AppError>> {
    this.executeCalls++
    return this.resultProvider()
  }
}
