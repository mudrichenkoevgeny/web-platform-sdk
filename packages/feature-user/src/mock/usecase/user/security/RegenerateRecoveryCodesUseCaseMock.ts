import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { RegenerateRecoveryCodesUseCase } from '@/usecase/user/security/RegenerateRecoveryCodesUseCase'
import type { TotpRecoveryCodes } from '@mudrichenkoevgeny/shared-foundation'
import { UserSecurityRepositoryMock } from '@/mock/repository/user/security/UserSecurityRepositoryMock'
/** Mock implementation of {@link RegenerateRecoveryCodesUseCase}. */
export class RegenerateRecoveryCodesUseCaseMock extends RegenerateRecoveryCodesUseCase {
  public executeCalls = 0
  public resultProvider: () => Promise<AppResult<TotpRecoveryCodes, AppError>> = async () => appResultFailure(CommonError.unknown())

  public constructor() {
    super(new UserSecurityRepositoryMock())
  }

  public override async execute(): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    this.executeCalls++
    return this.resultProvider()
  }
}
