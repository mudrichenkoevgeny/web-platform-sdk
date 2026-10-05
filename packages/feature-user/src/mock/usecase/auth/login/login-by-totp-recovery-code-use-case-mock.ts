import { appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { LoginByTotpRecoveryCodeUseCase } from '@/usecase/auth/login/login-by-totp-recovery-code-use-case'
import type { AuthData } from '@mudrichenkoevgeny/shared-foundation'
import { LoginRepositoryMock } from '@/mock/repository/auth/login/login-repository-mock'
import { AuthStorageMock } from '@/mock/storage/auth/auth-storage-mock'
import { UserStorageMock } from '@/mock/storage/user/user-storage-mock'
/**
 * Mock implementation of {@link LoginByTotpRecoveryCodeUseCase}.
 */
export class LoginByTotpRecoveryCodeUseCaseMock extends LoginByTotpRecoveryCodeUseCase {
  public executeCalls = 0
  public lastMfaToken: string | null = null
  public lastCode: string | null = null

  public resultProvider: (mfaToken: string, code: string) => Promise<AppResult<AuthData, AppError>> =
    async () => appResultFailure(CommonError.unknown())

  public constructor() {
    super(new LoginRepositoryMock(), new AuthStorageMock(), new UserStorageMock())
  }

  public override async execute(mfaToken: string, code: string): Promise<AppResult<AuthData, AppError>> {
    this.executeCalls++
    this.lastMfaToken = mfaToken
    this.lastCode = code
    return this.resultProvider(mfaToken, code)
  }
}
