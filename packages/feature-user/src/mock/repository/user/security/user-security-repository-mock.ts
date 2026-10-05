import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { UserSecurityRepository } from '@/repository/user/security/user-security-repository'
import type { TotpRecoveryCodes, TotpSetup } from '@mudrichenkoevgeny/shared-foundation'
/**
 * Mock implementation of {@link UserSecurityRepository}.
 */
export class UserSecurityRepositoryMock implements UserSecurityRepository {
  public totpSetupResultProvider: () => Promise<AppResult<TotpSetup, AppError>> = async () =>
    appResultSuccess({
      secretKey: 'MOCK_SECRET_KEY',
      otpAuthUrl: 'otpauth://totp/mock',
      mfaToken: 'mock_mfa_token'
    })

  public enableTotpResultProvider: (mfaToken: string, code: string) => Promise<AppResult<TotpRecoveryCodes, AppError>> = async () =>
    appResultSuccess({
      codes: ['rec_1', 'rec_2']
    })

  public disableTotpResultProvider: () => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public recoveryCodesResultProvider: () => Promise<AppResult<TotpRecoveryCodes, AppError>> = async () =>
    appResultSuccess({
      codes: ['rec_1', 'rec_2']
    })

  public regenerateRecoveryCodesResultProvider: () => Promise<AppResult<TotpRecoveryCodes, AppError>> = async () =>
    appResultSuccess({
      codes: ['rec_3', 'rec_4']
    })

  public lastMfaToken: string | null = null
  public lastCode: string | null = null

  public async setupTotp(): Promise<AppResult<TotpSetup, AppError>> {
    return this.totpSetupResultProvider()
  }

  public async enableTotp(mfaToken: string, code: string): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    this.lastMfaToken = mfaToken
    this.lastCode = code
    return this.enableTotpResultProvider(mfaToken, code)
  }

  public async disableTotp(): Promise<AppResult<void, AppError>> {
    return this.disableTotpResultProvider()
  }

  public async getRecoveryCodes(): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    return this.recoveryCodesResultProvider()
  }

  public async regenerateRecoveryCodes(): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    return this.regenerateRecoveryCodesResultProvider()
  }
}
