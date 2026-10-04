import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { GetRecoveryCodesUseCase } from '@/usecase/user/security/GetRecoveryCodesUseCase'
import type { TotpRecoveryCodes } from '@mudrichenkoevgeny/shared-foundation'
import { UserSecurityRepositoryMock } from '@/repository/user/security/UserSecurityRepositoryMock'
/** Mock implementation of {@link GetRecoveryCodesUseCase}. */
export class GetRecoveryCodesUseCaseMock extends GetRecoveryCodesUseCase {
  public executeCalls = 0
  public resultProvider: () => Promise<AppResult<TotpRecoveryCodes, AppError>> = async () => appResultFailure(CommonError.unknown())

  public constructor() {
    super(new UserSecurityRepositoryMock())
  }

  public override async invoke(): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    this.executeCalls++
    return this.resultProvider()
  }
}
