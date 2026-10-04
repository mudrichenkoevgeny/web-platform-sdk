import { AppError, AppResult, appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserSecurityRepository } from '@/repository/user/security/UserSecurityRepository'
import { TotpRecoveryCodes, TotpSetup } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Mock implementation of {@link UserSecurityRepository}.
 */
export class UserSecurityRepositoryMock implements UserSecurityRepository {
  public totpSetupResultProvider: () => Promise<AppResult<TotpSetup, AppError>> = async () =>
    appResultSuccess({
      totpSecretKey: 'MOCK_SECRET_KEY',
      totpOtpAuthUrl: 'otpauth://totp/mock',
      mfaToken: 'mock_mfa_token'
    })

  public enableTotpResultProvider: (mfaToken: string, code: string) => Promise<AppResult<TotpRecoveryCodes, AppError>> = async () =>
    appResultSuccess({
      totpRecoveryCodes: ['rec_1', 'rec_2']
    })

  public disableTotpResultProvider: () => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  public recoveryCodesResultProvider: () => Promise<AppResult<TotpRecoveryCodes, AppError>> = async () =>
    appResultSuccess({
      totpRecoveryCodes: ['rec_1', 'rec_2']
    })

  public regenerateRecoveryCodesResultProvider: () => Promise<AppResult<TotpRecoveryCodes, AppError>> = async () =>
    appResultSuccess({
      totpRecoveryCodes: ['rec_3', 'rec_4']
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
