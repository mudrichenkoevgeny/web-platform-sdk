import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk/core/common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk/core/common";
import { SetupTotpUseCase } from '@/feature/user/usecase/user/security/setup-totp-use-case'
import type { TotpSetup } from '@mudrichenkoevgeny/shared-foundation'
import { UserSecurityRepositoryMock } from '@/feature/user/mock/repository/user/security/user-security-repository-mock'
/** Mock implementation of {@link SetupTotpUseCase}. */
export class SetupTotpUseCaseMock extends SetupTotpUseCase {
  public executeCalls = 0
  public resultProvider: () => Promise<AppResult<TotpSetup, AppError>> = async () => appResultFailure(CommonError.unknown())

  public constructor() {
    super(new UserSecurityRepositoryMock())
  }

  public override async execute(): Promise<AppResult<TotpSetup, AppError>> {
    this.executeCalls++
    return this.resultProvider()
  }
}
