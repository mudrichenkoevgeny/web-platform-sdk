import { AppError, AppResult, appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EnableTotpUseCase } from '@/usecase/user/security/EnableTotpUseCase'
import { TotpRecoveryCodes } from '@mudrichenkoevgeny/shared-foundation'
import { UserSecurityRepositoryMock } from '@/repository/user/security/UserSecurityRepositoryMock'

/** Mock implementation of {@link EnableTotpUseCase}. */
export class EnableTotpUseCaseMock extends EnableTotpUseCase {
  public executeCalls = 0
  public resultProvider: (mfaToken: string, code: string) => Promise<AppResult<TotpRecoveryCodes, AppError>> =
    async () => appResultFailure(CommonError.unknown())

  public constructor() {
    super(new UserSecurityRepositoryMock())
  }

  public override async invoke(mfaToken: string, code: string): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    this.executeCalls++
    return this.resultProvider(mfaToken, code)
  }
}
