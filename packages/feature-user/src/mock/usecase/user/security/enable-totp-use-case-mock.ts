import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { EnableTotpUseCase } from '@/usecase/user/security/enable-totp-use-case'
import type { TotpRecoveryCodes } from '@mudrichenkoevgeny/shared-foundation'
import { UserSecurityRepositoryMock } from '@/mock/repository/user/security/user-security-repository-mock'
/** Mock implementation of {@link EnableTotpUseCase}. */
export class EnableTotpUseCaseMock extends EnableTotpUseCase {
  public executeCalls = 0
  public resultProvider: (mfaToken: string, code: string) => Promise<AppResult<TotpRecoveryCodes, AppError>> =
    async () => appResultFailure(CommonError.unknown())

  public constructor() {
    super(new UserSecurityRepositoryMock())
  }

  public override async execute(mfaToken: string, code: string): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    this.executeCalls++
    return this.resultProvider(mfaToken, code)
  }
}
