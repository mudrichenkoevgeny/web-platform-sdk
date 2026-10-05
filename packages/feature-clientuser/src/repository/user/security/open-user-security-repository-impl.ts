import { isSuccess, mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { TotpRecoveryCodes, TotpSetup } from '@mudrichenkoevgeny/shared-foundation'
import { toTotpRecoveryCodes, toTotpSetup } from '@mudrichenkoevgeny/shared-foundation'
import {
  UserSecurityApi,
  UserSecurityRepository,
  UserStorage
} from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

/**
 * Implements {@link UserSecurityRepository} using {@link UserSecurityApi} and updating local TOTP state in {@link UserStorage}.
 */
export class OpenUserSecurityRepositoryImpl implements UserSecurityRepository {
  /**
   * Constructs a new {@link OpenUserSecurityRepositoryImpl}.
   *
   * @param userSecurityApi - HTTP API client for TOTP and security settings
   * @param userStorage - Local user profile storage
   */
  public constructor(
    private readonly userSecurityApi: UserSecurityApi,
    private readonly userStorage: UserStorage
  ) {}

  public async setupTotp(): Promise<AppResult<TotpSetup, AppError>> {
    const result = await this.userSecurityApi.setupTotp()
    return mapSuccess(result, (totpSetupPayload) => toTotpSetup(totpSetupPayload))
  }

  public async enableTotp(mfaToken: string, code: string): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    const result = await this.userSecurityApi.enableTotp({
      mfa_token: mfaToken,
      totp_code: code
    })
    const mapped = mapSuccess(result, (totpRecoveryCodesPayload) => toTotpRecoveryCodes(totpRecoveryCodesPayload))
    if (isSuccess(mapped)) {
      await this.updateTotpStatusInStorage(true)
    }
    return mapped
  }

  public async disableTotp(): Promise<AppResult<void, AppError>> {
    const result = await this.userSecurityApi.disableTotp()
    if (isSuccess(result)) {
      await this.updateTotpStatusInStorage(false)
    }
    return result
  }

  public async getRecoveryCodes(): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    const result = await this.userSecurityApi.getRecoveryCodes()
    return mapSuccess(result, (totpRecoveryCodesPayload) => toTotpRecoveryCodes(totpRecoveryCodesPayload))
  }

  public async regenerateRecoveryCodes(): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    const result = await this.userSecurityApi.regenerateRecoveryCodes()
    return mapSuccess(result, (totpRecoveryCodesPayload) => toTotpRecoveryCodes(totpRecoveryCodesPayload))
  }

  private async updateTotpStatusInStorage(isEnabled: boolean): Promise<void> {
    const currentUser = await this.userStorage.getCurrentUser()
    if (currentUser !== null) {
      await this.userStorage.updateCurrentUser({
        ...currentUser,
        isTotpEnabled: isEnabled
      })
    }
  }
}
